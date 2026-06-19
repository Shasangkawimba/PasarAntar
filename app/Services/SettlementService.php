<?php

namespace App\Services;

use App\Models\Order;
use App\Models\ActivityLog;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class SettlementService
{
    /**
     * Calculate and save settlement details for an order.
     *
     * @param Order $order
     * @param int $actualAmount
     * @return Order
     *
     * @throws ValidationException
     */
    public function calculateAndSave(Order $order, int $actualAmount): Order
    {
        if ($actualAmount < 0) {
            throw ValidationException::withMessages([
                'actual_amount' => 'Jumlah aktual harus lebih besar atau sama dengan 0.',
            ]);
        }

        $estimatedAmount = $order->estimated_amount;
        $refundAmount = 0;
        $additionalPayment = 0;

        if ($estimatedAmount > $actualAmount) {
            $refundAmount = $estimatedAmount - $actualAmount;
        } elseif ($actualAmount > $estimatedAmount) {
            $additionalPayment = $actualAmount - $estimatedAmount;
        }

        return DB::transaction(function () use ($order, $actualAmount, $refundAmount, $additionalPayment, $estimatedAmount) {
            $order->update([
                'actual_amount' => $actualAmount,
                'refund_amount' => $refundAmount,
                'additional_payment' => $additionalPayment,
            ]);

            ActivityLog::create([
                'user_id' => auth()->id() ?? $order->assigned_joki_id,
                'action' => 'SETTLEMENT_CALCULATED',
                'metadata' => [
                    'order_id' => $order->id,
                    'order_number' => $order->order_number,
                    'estimated_amount' => $estimatedAmount,
                    'actual_amount' => $actualAmount,
                    'refund_amount' => $refundAmount,
                    'additional_payment' => $additionalPayment,
                ],
            ]);

            return $order->fresh();
        });
    }
}
