<?php

namespace App\Http\Controllers;

use App\Http\Requests\OrderStoreRequest;
use App\Models\Market;
use App\Models\Order;
use App\Services\OrderService;
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

        $order->load(['market', 'items', 'receipts.uploader']);

        return Inertia::render('Buyer/OrderDetail', [
            'order' => $order,
        ]);
    }

    /**
     * Display a listing of all orders for Admin.
     */
    public function adminIndex(Request $request): Response
    {
        // Admin middleware handles authorization, but checking policy is good practice
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

        return Inertia::render('Admin/OrderDetail', [
            'order' => $order,
        ]);
    }

    /**
     * Display a listing of available orders for Joki.
     */
    public function jokiIndex(Request $request): Response
    {
        Gate::authorize('viewAny', Order::class);

        $orders = Order::with(['buyer', 'market'])
            ->where('status', 'WAITING_FOR_JOKI')
            ->latest()
            ->get();

        return Inertia::render('Joki/AvailableOrders', [
            'orders' => $orders,
        ]);
    }
}
