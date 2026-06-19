<?php

namespace App\Services;

use App\Models\ActivityLog;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class OrderService
{
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
}
