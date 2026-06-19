<?php

namespace App\Policies;

use App\Models\MasterChecklist;
use App\Models\User;

class MasterChecklistPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->isAdmin() || $user->isJoki();
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, MasterChecklist $masterChecklist): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        if ($user->isJoki()) {
            return $masterChecklist->assigned_joki_id === $user->id;
        }

        return false;
    }

    /**
     * Determine whether the user can generate checklists.
     */
    public function generate(User $user): bool
    {
        return $user->isAdmin();
    }
}
