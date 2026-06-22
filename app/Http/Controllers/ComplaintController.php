<?php

namespace App\Http\Controllers;

use App\Models\Complaint;
use App\Models\Order;
use App\Models\ActivityLog;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;
use Carbon\Carbon;

class ComplaintController extends Controller
{
    /**
     * Buyer: Store a newly created complaint in storage.
     */
    public function store(Request $request, Order $order): RedirectResponse
    {
        // Only buyer of this order can complain
        if ($request->user()->id !== $order->buyer_id || !$request->user()->isBuyer()) {
            abort(403, 'Unauthorized action.');
        }

        // Must be COMPLETED
        if ($order->status !== 'COMPLETED') {
            return back()->withErrors(['status' => 'Pesanan belum selesai, tidak dapat mengajukan aduan.']);
        }

        // Only 1 complaint allowed per order
        if ($order->complaint()->exists()) {
            return back()->withErrors(['status' => 'Pengaduan untuk pesanan ini sudah ada.']);
        }

        // Check if within 24 hours of being COMPLETED
        // We find the completion time from activity log. If not found, fallback to updated_at.
        $completionLog = ActivityLog::where('action', 'STATUS_CHANGED')
            ->where('metadata->order_id', $order->id)
            ->where('metadata->new_status', 'COMPLETED')
            ->latest()
            ->first();

        $completedAt = $completionLog ? Carbon::parse($completionLog->created_at) : Carbon::parse($order->updated_at);

        if (Carbon::now()->diffInHours($completedAt, true) >= 24) {
            return back()->withErrors(['status' => 'Batas waktu pengajuan aduan (1x24 jam) telah habis.']);
        }

        $validated = $request->validate([
            'reason' => ['required', 'string', 'in:Barang tidak sampai,Barang rusak atau kurang,Nominal nota tidak sesuai'],
            'description' => ['required', 'string', 'max:1000'],
        ]);

        $complaint = Complaint::create([
            'order_id' => $order->id,
            'buyer_id' => $request->user()->id,
            'reason' => $validated['reason'],
            'description' => $validated['description'],
            'status' => 'PENDING',
        ]);

        return redirect()->route('orders.show', $order->id)
            ->with('success', 'Pengaduan berhasil diajukan dan sedang diproses oleh tim kami.');
    }

    /**
     * Admin: Display a listing of the complaints.
     */
    public function adminIndex(): Response
    {
        Gate::authorize('viewAny', Complaint::class);

        $complaints = Complaint::with(['order', 'buyer'])
            ->latest()
            ->get();

        return Inertia::render('Admin/ComplaintList', [
            'complaints' => $complaints,
        ]);
    }

    /**
     * Admin: Update the specified complaint's status.
     */
    public function adminUpdateStatus(Request $request, Complaint $complaint): RedirectResponse
    {
        Gate::authorize('updateStatus', $complaint);

        $validated = $request->validate([
            'status' => ['required', 'string', 'in:RESOLVED,REJECTED'],
            'admin_notes' => ['nullable', 'string', 'max:1000'],
        ]);

        $complaint->update([
            'status' => $validated['status'],
            'admin_notes' => $validated['admin_notes'],
        ]);

        return back()->with('success', 'Status pengaduan berhasil diperbarui.');
    }
}
