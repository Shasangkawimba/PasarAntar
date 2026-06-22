<?php

namespace App\Policies;

use App\Models\Complaint;
use App\Models\User;

class ComplaintPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Complaint $complaint): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        return $user->isBuyer() && $complaint->buyer_id === $user->id;
    }

    /**
     * Determine whether the user can update the status of the complaint.
     */
    public function updateStatus(User $user, Complaint $complaint): bool
    {
        return $user->isAdmin();
    }
}
