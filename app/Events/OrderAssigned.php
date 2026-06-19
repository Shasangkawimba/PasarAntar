<?php

namespace App\Events;

use App\Models\Order;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class OrderAssigned implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public Order $order;
    public ?array $activityLog;

    /**
     * Create a new event instance.
     */
    public function __construct(Order $order, ?array $activityLog = null)
    {
        $this->order = $order;
        $this->activityLog = $activityLog;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('orders.' . $this->order->id),
        ];
    }

    /**
     * Get the data to broadcast.
     *
     * @return array<string, mixed>
     */
    public function broadcastWith(): array
    {
        return [
            'order_id' => $this->order->id,
            'status' => $this->order->status,
            'assigned_joki_name' => $this->order->joki?->name,
            'assigned_joki_phone' => $this->order->joki?->phone_number,
            'actual_amount' => $this->order->actual_amount,
            'refund_amount' => $this->order->refund_amount,
            'additional_payment' => $this->order->additional_payment,
            'activity_log' => $this->activityLog,
        ];
    }
}
