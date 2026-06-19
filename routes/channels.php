<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('orders.{orderId}', function ($user, $orderId) {
    $order = \App\Models\Order::find($orderId);
    
    if (!$order) {
        return false;
    }

    if ($user->isAdmin()) {
        return true;
    }

    if ($user->isJoki() && (int) $order->assigned_joki_id === (int) $user->id) {
        return true;
    }

    if ($user->isBuyer() && (int) $order->buyer_id === (int) $user->id) {
        return true;
    }

    return false;
});
