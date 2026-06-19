<?php

namespace App\Policies;

use App\Models\Order;
use App\Models\User;

class OrderPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        // All authenticated users can view their respective lists
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Order $order): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        if ($user->isBuyer()) {
            return $order->buyer_id === $user->id;
        }

        if ($user->isJoki()) {
            // Joki can view waiting orders or orders assigned to them
            return $order->status === 'WAITING_FOR_JOKI'
                || $order->assigned_joki_id === $user->id;
        }

        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->isBuyer();
    }

    /**
     * Determine whether the joki can assign (claim) an order.
     */
    public function assign(User $user, Order $order): bool
    {
        return $user->isJoki() && $order->status === 'WAITING_FOR_JOKI';
    }

    /**
     * Determine whether the joki can update the order status.
     */
    public function updateStatus(User $user, Order $order): bool
    {
        return $user->isJoki() && $order->assigned_joki_id === $user->id;
    }
}
