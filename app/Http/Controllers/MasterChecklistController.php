<?php

namespace App\Http\Controllers;

use App\Jobs\GenerateMasterChecklistJob;
use App\Models\MasterChecklist;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class MasterChecklistController extends Controller
{
    /**
     * Display a listing of all master checklists for Admin.
     */
    public function adminIndex(): Response
    {
        Gate::authorize('generate', MasterChecklist::class);

        $checklists = \Illuminate\Support\Facades\Cache::remember('checklists:admin', now()->addHours(1), function () {
            return MasterChecklist::with(['market', 'joki'])
                ->withCount('orders')
                ->latest()
                ->get()
                ->toArray();
        });

        return Inertia::render('Admin/MasterChecklistList', [
            'checklists' => $checklists,
        ]);
    }

    /**
     * Display the specified master checklist for Admin.
     */
    public function adminShow(MasterChecklist $checklist): Response
    {
        Gate::authorize('view', $checklist);

        $checklist->load(['market', 'joki', 'items', 'orders.buyer']);

        return Inertia::render('Admin/MasterChecklistDetail', [
            'checklist' => $checklist,
        ]);
    }

    /**
     * Display a listing of master checklists for Joki.
     */
    public function jokiIndex(Request $request): Response
    {
        Gate::authorize('viewAny', MasterChecklist::class);

        $jokiId = $request->user()->id;
        $checklists = \Illuminate\Support\Facades\Cache::remember("checklists:joki:{$jokiId}", now()->addHours(1), function () use ($jokiId) {
            return MasterChecklist::with(['market'])
                ->withCount('orders')
                ->where('assigned_joki_id', $jokiId)
                ->latest()
                ->get()
                ->toArray();
        });

        return Inertia::render('Joki/MasterChecklistList', [
            'checklists' => $checklists,
        ]);
    }

    /**
     * Display the specified master checklist for Joki.
     */
    public function jokiShow(MasterChecklist $checklist): Response
    {
        Gate::authorize('view', $checklist);

        $checklist->load(['market', 'items', 'orders.buyer']);

        return Inertia::render('Joki/MasterChecklistDetail', [
            'checklist' => $checklist,
        ]);
    }

    /**
     * Trigger the background job to generate master checklists manually.
     */
    public function triggerAggregation(): RedirectResponse
    {
        Gate::authorize('generate', MasterChecklist::class);

        $eligibleOrdersCount = \App\Models\Order::where('status', 'ASSIGNED')
            ->whereNull('master_checklist_id')
            ->count();

        if ($eligibleOrdersCount === 0) {
            return redirect()->route('admin.checklists.index')
                ->with('info', 'Tidak ada pesanan aktif berstatus ASSIGNED yang siap diagregasikan.');
        }

        GenerateMasterChecklistJob::dispatch();

        return redirect()->route('admin.checklists.index')
            ->with('success', 'Proses penciptaan Master Checklist telah dimulai di latar belakang.');
    }
}
