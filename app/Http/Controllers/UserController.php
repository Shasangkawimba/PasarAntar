<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    /**
     * Display a listing of users for Admin.
     */
    public function adminIndex(Request $request): Response
    {
        $users = User::whereIn('role', ['buyer', 'joki'])
            ->orderBy('id', 'desc')
            ->get();

        return Inertia::render('Admin/UserList', [
            'users' => $users,
        ]);
    }

    /**
     * Toggle the active status of a user.
     */
    public function toggleStatus(User $user)
    {
        // Prevent admin from disabling themselves or other admins just in case
        if ($user->isAdmin()) {
            return redirect()->back()->with('error', 'Tidak dapat menonaktifkan akun Admin.');
        }

        $user->update([
            'is_active' => !$user->is_active,
        ]);

        $action = $user->is_active ? 'Admin mengaktifkan akun pengguna' : 'Admin menonaktifkan akun pengguna';

        ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => $action,
            'metadata' => [
                'target_user_id' => $user->id,
                'target_user_name' => $user->name,
                'target_user_role' => $user->role,
                'new_status' => $user->is_active ? 'active' : 'suspended',
            ]
        ]);

        $message = $user->is_active 
            ? 'Akun pengguna berhasil diaktifkan.' 
            : 'Akun pengguna berhasil dinonaktifkan.';

        return redirect()->back()->with('success', $message);
    }
}
