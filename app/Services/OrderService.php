<?php

namespace App\Services;

use App\Models\ActivityLog;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

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
     * @throws \Illuminate\Validation\ValidationException
     */
    public function assignOrder(User $joki, Order $order): Order
    {
        if ($order->status !== 'WAITING_FOR_JOKI') {
            throw ValidationException::withMessages([
                'status' => 'Pesanan ini tidak dapat diambil karena statusnya bukan WAITING_FOR_JOKI.',
            ]);
        }

        return DB::transaction(function () use ($joki, $order) {
            $order->update([
                'assigned_joki_id' => $joki->id,
                'status' => 'ASSIGNED',
            ]);

            ActivityLog::create([
                'user_id' => $joki->id,
                'action' => 'ORDER_ASSIGNED',
                'metadata' => [
                    'order_id' => $order->id,
                    'order_number' => $order->order_number,
                    'old_status' => 'WAITING_FOR_JOKI',
                    'new_status' => 'ASSIGNED',
                ],
            ]);

            return $order->fresh();
        });
    }

    /**
     * Update order status with validated transition.
     *
     * @param  \App\Models\User  $joki
     * @param  \App\Models\Order  $order
     * @param  string  $newStatus
     * @return \App\Models\Order
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function updateStatus(User $joki, Order $order, string $newStatus): Order
    {
        $allowed = self::TRANSITIONS[$order->status] ?? [];

        if (! in_array($newStatus, $allowed)) {
            throw ValidationException::withMessages([
                'status' => "Transisi status dari {$order->status} ke {$newStatus} tidak diperbolehkan.",
            ]);
        }

        if ($order->assigned_joki_id !== $joki->id) {
            throw ValidationException::withMessages([
                'status' => 'Anda tidak memiliki akses untuk mengubah status pesanan ini.',
            ]);
        }

        if ($newStatus === 'COMPLETED') {
            if (!$order->receipts()->exists()) {
                throw ValidationException::withMessages([
                    'status' => 'Pesanan tidak dapat diselesaikan karena nota belanja belum diunggah.',
                ]);
            }
            if ($order->actual_amount === null) {
                throw ValidationException::withMessages([
                    'status' => 'Pesanan tidak dapat diselesaikan karena nominal riil belanja belum diisi.',
                ]);
            }
        }

        return DB::transaction(function () use ($joki, $order, $newStatus) {
            $oldStatus = $order->status;

            $order->update([
                'status' => $newStatus,
            ]);

            ActivityLog::create([
                'user_id' => $joki->id,
                'action' => 'STATUS_CHANGED',
                'metadata' => [
                    'order_id' => $order->id,
                    'order_number' => $order->order_number,
                    'old_status' => $oldStatus,
                    'new_status' => $newStatus,
                ],
            ]);

            return $order->fresh();
        });
    }
}

