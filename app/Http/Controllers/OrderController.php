<?php

namespace App\Http\Controllers;

use App\Http\Requests\OrderStoreRequest;
use App\Models\ActivityLog;
use App\Models\Market;
use App\Models\Order;
use App\Services\OrderService;
use App\Services\SettlementService;
use App\Services\ReceiptUploadService;
use App\Http\Requests\OrderSettleRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    protected OrderService $orderService;

    public function __construct(OrderService $orderService)
    {
        $this->orderService = $orderService;
    }

    /**
     * Display a listing of the buyer's own orders.
     */
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Order::class);

        $orders = $request->user()->orders()
            ->with('market')
            ->latest()
            ->get();

        return Inertia::render('Buyer/MyOrders', [
            'orders' => $orders,
        ]);
    }

    /**
     * Show the form for creating a new order.
     */
    public function create(Market $market): Response
    {
        Gate::authorize('create', Order::class);

        return Inertia::render('Buyer/CreateOrder', [
            'market' => $market,
        ]);
    }

    /**
     * Store a newly created order.
     */
    public function store(OrderStoreRequest $request): RedirectResponse
    {
        // FormRequest handles the authorize and validation rules
        $order = $this->orderService->createOrder($request->user(), $request->validated());

        return redirect()->route('orders.index')
            ->with('success', "Pesanan {$order->order_number} berhasil dibuat.");
    }

    /**
     * Display the specified order's details for Buyer.
     */
    public function show(Order $order): Response
    {
        Gate::authorize('view', $order);

        $order->load(['market', 'items', 'receipts.uploader', 'joki']);

        return Inertia::render('Buyer/OrderDetail', [
            'order' => $order,
        ]);
    }

    /**
     * Display a listing of all orders for Admin.
     */
    public function adminIndex(Request $request): Response
    {
        Gate::authorize('viewAny', Order::class);

        $orders = Order::with(['buyer', 'market'])
            ->latest()
            ->get();

        return Inertia::render('Admin/OrdersList', [
            'orders' => $orders,
        ]);
    }

    /**
     * Display the specified order's details for Admin.
     */
    public function adminShow(Order $order): Response
    {
        Gate::authorize('view', $order);

        $order->load(['buyer', 'market', 'items', 'receipts.uploader', 'joki']);

        $activityLogs = ActivityLog::where('metadata->order_id', $order->id)
            ->with('user')
            ->latest()
            ->get();

        return Inertia::render('Admin/OrderDetail', [
            'order' => $order,
            'activityLogs' => $activityLogs,
        ]);
    }

    /**
     * Display a listing of available orders for Joki.
     */
    public function jokiIndex(Request $request): Response
    {
        Gate::authorize('viewAny', Order::class);

        $orders = \Illuminate\Support\Facades\Cache::remember('orders:available', now()->addMinutes(10), function () {
            return Order::with(['buyer', 'market'])
                ->where('status', 'WAITING_FOR_JOKI')
                ->latest()
                ->get();
        });

        return Inertia::render('Joki/AvailableOrders', [
            'orders' => $orders,
        ]);
    }

    /**
     * Display a listing of orders assigned to the authenticated Joki.
     */
    public function jokiAssignedOrders(Request $request): Response
    {
        $orders = Order::with(['buyer', 'market'])
            ->where('assigned_joki_id', $request->user()->id)
            ->latest()
            ->get();

        return Inertia::render('Joki/AssignedOrders', [
            'orders' => $orders,
        ]);
    }

    /**
     * Display order workflow page for Joki.
     */
    public function jokiOrderWorkflow(Order $order): Response
    {
        Gate::authorize('updateStatus', $order);

        $order->load(['buyer', 'market', 'items', 'receipts']);

        return Inertia::render('Joki/OrderWorkflow', [
            'order' => $order,
        ]);
    }

    /**
     * Assign an order to the authenticated Joki.
     */
    public function assignOrder(Order $order): RedirectResponse
    {
        Gate::authorize('assign', $order);

        $this->orderService->assignOrder(request()->user(), $order);

        return redirect()->route('joki.orders.assigned')
            ->with('success', "Pesanan {$order->order_number} berhasil diambil.");
    }

    /**
     * Update order status by the assigned Joki.
     */
    public function updateOrderStatus(Request $request, Order $order): RedirectResponse
    {
        Gate::authorize('updateStatus', $order);

        $request->validate([
            'status' => ['required', 'string'],
        ]);

        $this->orderService->updateStatus($request->user(), $order, $request->input('status'));

        return redirect()->route('joki.orders.show', $order->id)
            ->with('success', 'Status pesanan berhasil diperbarui.');
    }

    /**
     * Save order receipt and calculate settlement.
     */
    public function saveSettlement(
        OrderSettleRequest $request,
        Order $order,
        ReceiptUploadService $receiptUploadService,
        SettlementService $settlementService
    ): RedirectResponse {
        Gate::authorize('settle', $order);

        DB::transaction(function () use ($request, $order, $receiptUploadService, $settlementService) {
            if ($request->hasFile('receipt')) {
                $receiptUploadService->upload($request->user(), $order, $request->file('receipt'));
            }

            $settlementService->calculateAndSave($order, (int) $request->input('actual_amount'));
        });

        return redirect()->route('joki.orders.show', $order->id)
            ->with('success', 'Nota belanja dan perhitungan selisih berhasil disimpan.');
    }
}
