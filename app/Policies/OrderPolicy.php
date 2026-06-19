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
            // In Phase 3, Jokis can only view orders waiting for a joki
            return $order->status === 'WAITING_FOR_JOKI';
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
}
