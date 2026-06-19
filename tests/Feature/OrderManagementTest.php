<?php

namespace Tests\Feature;

use App\Models\Market;
use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderManagementTest extends TestCase
{
    use RefreshDatabase;

    protected Market $market;
    protected User $buyer;
    protected User $otherBuyer;
    protected User $joki;
    protected User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        $this->market = Market::create([
            'name' => 'Pasar Legi',
            'address' => 'Jl. S. Parman, Surakarta',
            'is_active' => true,
        ]);

        $this->buyer = User::factory()->buyer()->create();
        $this->otherBuyer = User::factory()->buyer()->create();
        $this->joki = User::factory()->joki()->create();
        $this->admin = User::factory()->admin()->create();
    }

    /**
     * Test Buyer can successfully create an order with valid data.
     */
    public function test_buyer_can_create_order(): void
    {
        $payload = [
            'market_id' => $this->market->id,
            'estimated_amount' => 125000,
            'items' => [
                [
                    'product_name' => 'Bayam Hijau',
                    'quantity' => 3,
                    'notes' => 'Ikat besar dan segar',
                ],
                [
                    'product_name' => 'Dada Ayam Fillet',
                    'quantity' => 1,
                    'notes' => 'Potong kecil-kecil',
                ]
            ]
        ];

        $response = $this->actingAs($this->buyer)->post(route('orders.store'), $payload);

        $response->assertRedirect(route('orders.index'));
        $this->assertDatabaseHas('orders', [
            'buyer_id' => $this->buyer->id,
            'market_id' => $this->market->id,
            'estimated_amount' => 125000,
            'status' => 'WAITING_FOR_JOKI',
        ]);

        $order = Order::where('buyer_id', $this->buyer->id)->first();
        $this->assertNotNull($order);
        $this->assertNotEmpty($order->order_number);
        $this->assertStringStartsWith('PA-', $order->order_number);

        $this->assertCount(2, $order->items);
        $this->assertDatabaseHas('order_items', [
            'order_id' => $order->id,
            'product_name' => 'Bayam Hijau',
            'quantity' => 3,
        ]);

        // Check Activity Log creation
        $this->assertDatabaseHas('activity_logs', [
            'user_id' => $this->buyer->id,
            'action' => 'ORDER_CREATED',
        ]);
    }

    /**
     * Test Order store validation rules.
     */
    public function test_order_creation_validation(): void
    {
        // 1. Missing market_id, negative estimated_amount, empty items
        $payload = [
            'estimated_amount' => -100,
            'items' => []
        ];

        $response = $this->actingAs($this->buyer)->post(route('orders.store'), $payload);
        $response->assertStatus(302);
        $response->assertSessionHasErrors(['market_id', 'estimated_amount', 'items']);

        // 2. Invalid nested item structure (missing product_name, negative quantity)
        $payload = [
            'market_id' => $this->market->id,
            'estimated_amount' => 50000,
            'items' => [
                [
                    'product_name' => '',
                    'quantity' => 0,
                ]
            ]
        ];

        $response = $this->actingAs($this->buyer)->post(route('orders.store'), $payload);
        $response->assertStatus(302);
        $response->assertSessionHasErrors(['items.0.product_name', 'items.0.quantity']);
    }

    /**
     * Test Buyer can view their own orders list and detail.
     */
    public function test_buyer_can_view_own_order(): void
    {
        $order = Order::create([
            'buyer_id' => $this->buyer->id,
            'market_id' => $this->market->id,
            'estimated_amount' => 75000,
            'status' => 'WAITING_FOR_JOKI',
        ]);

        // 1. View listing
        $response = $this->actingAs($this->buyer)->get(route('orders.index'));
        $response->assertStatus(200);

        // 2. View details
        $response = $this->actingAs($this->buyer)->get(route('orders.show', $order->id));
        $response->assertStatus(200);
    }

    /**
     * Test Buyer is forbidden from accessing other buyers' orders.
     */
    public function test_buyer_forbidden_access_to_other_orders(): void
    {
        $otherOrder = Order::create([
            'buyer_id' => $this->otherBuyer->id,
            'market_id' => $this->market->id,
            'estimated_amount' => 90000,
            'status' => 'WAITING_FOR_JOKI',
        ]);

        $response = $this->actingAs($this->buyer)->get(route('orders.show', $otherOrder->id));
        $response->assertStatus(403);
    }

    /**
     * Test Admin can view all orders list and details.
     */
    public function test_admin_can_view_all_orders(): void
    {
        $order1 = Order::create([
            'buyer_id' => $this->buyer->id,
            'market_id' => $this->market->id,
            'estimated_amount' => 50000,
        ]);

        $order2 = Order::create([
            'buyer_id' => $this->otherBuyer->id,
            'market_id' => $this->market->id,
            'estimated_amount' => 100000,
        ]);

        // 1. View listing
        $response = $this->actingAs($this->admin)->get(route('admin.orders.index'));
        $response->assertStatus(200);

        // 2. View detail 1
        $response = $this->actingAs($this->admin)->get(route('admin.orders.show', $order1->id));
        $response->assertStatus(200);

        // 3. View detail 2
        $response = $this->actingAs($this->admin)->get(route('admin.orders.show', $order2->id));
        $response->assertStatus(200);
    }

    /**
     * Test Joki can view available waiting orders, but cannot view completed/assigned orders or other roles.
     */
    public function test_joki_can_only_view_waiting_orders(): void
    {
        $waitingOrder = Order::create([
            'buyer_id' => $this->buyer->id,
            'market_id' => $this->market->id,
            'status' => 'WAITING_FOR_JOKI',
            'estimated_amount' => 60000,
        ]);

        $assignedOrder = Order::create([
            'buyer_id' => $this->otherBuyer->id,
            'market_id' => $this->market->id,
            'status' => 'ASSIGNED',
            'estimated_amount' => 80000,
        ]);

        // 1. View available list (Joki sees only waiting orders)
        $response = $this->actingAs($this->joki)->get(route('joki.orders.index'));
        $response->assertStatus(200);
        // Note: filtering happens in view data, which we test in show page policy below

        // 2. Access waiting order detail (Allowed)
        $response = $this->actingAs($this->joki)->get(route('orders.show', $waitingOrder->id));
        $response->assertStatus(200);

        // 3. Access assigned order detail (Forbidden in Phase 3)
        $response = $this->actingAs($this->joki)->get(route('orders.show', $assignedOrder->id));
        $response->assertStatus(403);
    }
}
