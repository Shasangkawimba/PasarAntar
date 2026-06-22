<?php

namespace App\Services;

use App\Models\ActivityLog;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use App\Exceptions\InvalidStatusTransitionException;
use App\Exceptions\UnauthorizedAssignmentException;
use App\Exceptions\SettlementValidationException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class OrderService
{
    /**
     * Allowed status transitions.
     */
    protected const TRANSITIONS = [
        'WAITING_FOR_JOKI' => ['ASSIGNED', 'CANCELLED'],
        'ASSIGNED'         => ['SHOPPING'],
        'SHOPPING'         => ['DELIVERING'],
        'DELIVERING'       => ['COMPLETED'],
    ];

    /**
     * Create a new order with its items and log the activity.
     *
     * @param  \App\Models\User  $buyer
     * @param  array  $data
     * @return \App\Models\Order
     */
    public function createOrder(User $buyer, array $data): Order
    {
        return DB::transaction(function () use ($buyer, $data) {
            // 1. Create the Order
            $order = Order::create([
                'buyer_id' => $buyer->id,
                'market_id' => $data['market_id'],
                'status' => 'WAITING_FOR_JOKI',
                'estimated_amount' => $data['estimated_amount'],
            ]);

            // 2. Create the Order Items
            foreach ($data['items'] as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_name' => $item['product_name'],
                    'quantity' => $item['quantity'],
                    'notes' => $item['notes'] ?? null,
                ]);
            }

            // 3. Create the Activity Log
            ActivityLog::create([
                'user_id' => $buyer->id,
                'action' => 'ORDER_CREATED',
                'metadata' => [
                    'order_id' => $order->id,
                    'order_number' => $order->order_number,
                    'market_id' => $order->market_id,
                    'estimated_amount' => $order->estimated_amount,
                ],
            ]);

            // 4. Invalidate Caches
            Cache::forget('orders:available');

            return $order;
        });
    }

    /**
     * Assign an order to a joki.
     *
     * @param  \App\Models\User  $joki
     * @param  \App\Models\Order  $order
     * @return \App\Models\Order
     *
     * @throws InvalidStatusTransitionException
     */
    public function assignOrder(User $joki, Order $order): Order
    {
        if ($order->status !== 'WAITING_FOR_JOKI') {
            throw new InvalidStatusTransitionException('Pesanan ini tidak dapat diambil karena statusnya bukan WAITING_FOR_JOKI.');
        }

        $activityLog = null;
        $updatedOrder = DB::transaction(function () use ($joki, $order, &$activityLog) {
            $order->update([
                'assigned_joki_id' => $joki->id,
                'status' => 'ASSIGNED',
            ]);

            $activityLog = ActivityLog::create([
                'user_id' => $joki->id,
                'action' => 'ORDER_ASSIGNED',
                'metadata' => [
                    'order_id' => $order->id,
                    'order_number' => $order->order_number,
                    'old_status' => 'WAITING_FOR_JOKI',
                    'new_status' => 'ASSIGNED',
                ],
            ]);

            // Structured Contextual Log
            Log::info('Order assigned to Joki.', [
                'order_id' => $order->id,
                'order_number' => $order->order_number,
                'joki_id' => $joki->id,
                'joki_name' => $joki->name,
            ]);

            // Invalidate Caches
            Cache::forget('orders:available');

            return $order->fresh();
        });

        if ($activityLog) {
            event(new \App\Events\OrderAssigned($updatedOrder, [
                'id' => $activityLog->id,
                'action' => $activityLog->action,
                'metadata' => $activityLog->metadata,
                'created_at' => $activityLog->created_at->toIso8601String(),
                'user' => [
                    'id' => $joki->id,
                    'name' => $joki->name,
                    'email' => $joki->email,
                    'phone_number' => $joki->phone_number,
                ],
            ]));
        }

        return $updatedOrder;
    }

    /**
     * Update order status with validated transition.
     *
     * @param  \App\Models\User  $joki
     * @param  \App\Models\Order  $order
     * @param  string  $newStatus
     * @param  string|null  $deliveryProofUrl
     * @return \App\Models\Order
     *
     * @throws InvalidStatusTransitionException
     * @throws UnauthorizedAssignmentException
     * @throws SettlementValidationException
     */
    public function updateStatus(User $joki, Order $order, string $newStatus, ?string $deliveryProofUrl = null): Order
    {
        $allowed = self::TRANSITIONS[$order->status] ?? [];

        if (! in_array($newStatus, $allowed)) {
            throw new InvalidStatusTransitionException("Transisi status dari {$order->status} ke {$newStatus} tidak diperbolehkan.");
        }

        if ($order->assigned_joki_id !== $joki->id) {
            throw new UnauthorizedAssignmentException('Anda tidak memiliki akses untuk mengubah status pesanan ini.');
        }

        if ($newStatus === 'COMPLETED') {
            if (!$order->receipts()->exists()) {
                throw new SettlementValidationException('Pesanan tidak dapat diselesaikan karena nota belanja belum diunggah.');
            }
            if ($order->actual_amount === null) {
                throw new SettlementValidationException('Pesanan tidak dapat diselesaikan karena nominal riil belanja belum diisi.');
            }
            if ($deliveryProofUrl === null && $order->delivery_proof_url === null) {
                throw new SettlementValidationException('Pesanan tidak dapat diselesaikan karena foto bukti penyerahan barang belum diunggah.');
            }
        }

        $activityLog = null;
        $updatedOrder = DB::transaction(function () use ($joki, $order, $newStatus, $deliveryProofUrl, &$activityLog) {
            $oldStatus = $order->status;

            $updateData = ['status' => $newStatus];
            if ($deliveryProofUrl !== null) {
                $updateData['delivery_proof_url'] = $deliveryProofUrl;
            }

            $order->update($updateData);

            $activityLog = ActivityLog::create([
                'user_id' => $joki->id,
                'action' => 'STATUS_CHANGED',
                'metadata' => [
                    'order_id' => $order->id,
                    'order_number' => $order->order_number,
                    'old_status' => $oldStatus,
                    'new_status' => $newStatus,
                ],
            ]);

            // Structured Contextual Log
            Log::info('Order status updated.', [
                'order_id' => $order->id,
                'order_number' => $order->order_number,
                'joki_id' => $joki->id,
                'old_status' => $oldStatus,
                'new_status' => $newStatus,
            ]);

            // Invalidate Caches
            Cache::forget('orders:available');

            return $order->fresh();
        });

        if ($activityLog) {
            event(new \App\Events\OrderStatusChanged($updatedOrder, [
                'id' => $activityLog->id,
                'action' => $activityLog->action,
                'metadata' => $activityLog->metadata,
                'created_at' => $activityLog->created_at->toIso8601String(),
                'user' => [
                    'id' => $joki->id,
                    'name' => $joki->name,
                    'email' => $joki->email,
                    'phone_number' => $joki->phone_number,
                ],
            ]));
        }

        return $updatedOrder;
    }
}
