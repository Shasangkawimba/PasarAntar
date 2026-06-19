<?php

namespace Tests\Feature;

use App\Models\Market;
use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class JokiAssignmentTest extends TestCase
{
    use RefreshDatabase;

    protected Market $market;
    protected User $buyer;
    protected User $joki;
    protected User $otherJoki;
    protected User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        $this->market = Market::create([
            'name' => 'Pasar Gede',
            'address' => 'Jl. Urip Sumoharjo, Surakarta',
            'is_active' => true,
        ]);

        $this->buyer = User::factory()->buyer()->create();
        $this->joki = User::factory()->joki()->create();
        $this->otherJoki = User::factory()->joki()->create();
        $this->admin = User::factory()->admin()->create();
    }

    /**
     * Helper to create a waiting order.
     */
    private function createWaitingOrder(): Order
    {
        return Order::create([
            'buyer_id' => $this->buyer->id,
            'market_id' => $this->market->id,
            'estimated_amount' => 100000,
            'status' => 'WAITING_FOR_JOKI',
        ]);
    }

    /**
     * Test Joki can assign (claim) a waiting order.
     */
    public function test_joki_can_assign_order(): void
    {
        $order = $this->createWaitingOrder();

        $response = $this->actingAs($this->joki)
            ->post(route('joki.orders.assign', $order->id));

        $response->assertRedirect(route('joki.orders.assigned'));

        $order->refresh();
        $this->assertEquals('ASSIGNED', $order->status);
        $this->assertEquals($this->joki->id, $order->assigned_joki_id);

        $this->assertDatabaseHas('activity_logs', [
            'user_id' => $this->joki->id,
            'action' => 'ORDER_ASSIGNED',
        ]);
    }

    /**
     * Test cannot assign an already assigned order.
     */
    public function test_cannot_assign_already_assigned_order(): void
    {
        $order = $this->createWaitingOrder();
        $order->update([
            'status' => 'ASSIGNED',
            'assigned_joki_id' => $this->otherJoki->id,
        ]);

        $response = $this->actingAs($this->joki)
            ->post(route('joki.orders.assign', $order->id));

        $response->assertStatus(403);
    }

    /**
     * Test Joki cannot access another Joki's order workflow.
     */
    public function test_joki_cannot_access_another_joki_order(): void
    {
        $order = $this->createWaitingOrder();
        $order->update([
            'status' => 'ASSIGNED',
            'assigned_joki_id' => $this->otherJoki->id,
        ]);

        $response = $this->actingAs($this->joki)
            ->get(route('joki.orders.show', $order->id));

        $response->assertStatus(403);
    }

    /**
     * Test valid status transitions: ASSIGNED → SHOPPING → DELIVERING → COMPLETED.
     */
    public function test_valid_status_transitions(): void
    {
        $order = $this->createWaitingOrder();
        // Assign first
        $this->actingAs($this->joki)
            ->post(route('joki.orders.assign', $order->id));

        // ASSIGNED → SHOPPING
        $response = $this->actingAs($this->joki)
            ->post(route('joki.orders.status', $order->id), ['status' => 'SHOPPING']);
        $response->assertRedirect();
        $order->refresh();
        $this->assertEquals('SHOPPING', $order->status);

        // SHOPPING → DELIVERING
        $response = $this->actingAs($this->joki)
            ->post(route('joki.orders.status', $order->id), ['status' => 'DELIVERING']);
        $response->assertRedirect();
        $order->refresh();
        $this->assertEquals('DELIVERING', $order->status);

        // DELIVERING → COMPLETED
        // Set actual amount and mock receipt to allow completion
        $order->update(['actual_amount' => 90000]);
        \App\Models\Receipt::create([
            'order_id' => $order->id,
            'image_url' => '/storage/receipts/test.jpg',
            'uploaded_by' => $this->joki->id,
        ]);

        $response = $this->actingAs($this->joki)
            ->post(route('joki.orders.status', $order->id), ['status' => 'COMPLETED']);
        $response->assertRedirect();
        $order->refresh();
        $this->assertEquals('COMPLETED', $order->status);
    }

    /**
     * Test invalid status transitions are rejected.
     */
    public function test_invalid_status_transitions(): void
    {
        $order = $this->createWaitingOrder();
        $order->update([
            'status' => 'ASSIGNED',
            'assigned_joki_id' => $this->joki->id,
        ]);

        // ASSIGNED → DELIVERING (skip SHOPPING — invalid)
        $response = $this->actingAs($this->joki)
            ->post(route('joki.orders.status', $order->id), ['status' => 'DELIVERING']);
        $response->assertSessionHasErrors('status');

        // ASSIGNED → COMPLETED (skip — invalid)
        $response = $this->actingAs($this->joki)
            ->post(route('joki.orders.status', $order->id), ['status' => 'COMPLETED']);
        $response->assertSessionHasErrors('status');

        // Status should remain ASSIGNED
        $order->refresh();
        $this->assertEquals('ASSIGNED', $order->status);
    }

    /**
     * Test activity logs are created for assignment and status changes.
     */
    public function test_activity_log_created(): void
    {
        $order = $this->createWaitingOrder();

        // Assign
        $this->actingAs($this->joki)
            ->post(route('joki.orders.assign', $order->id));

        $this->assertDatabaseHas('activity_logs', [
            'user_id' => $this->joki->id,
            'action' => 'ORDER_ASSIGNED',
        ]);

        // Status change
        $this->actingAs($this->joki)
            ->post(route('joki.orders.status', $order->id), ['status' => 'SHOPPING']);

        $this->assertDatabaseHas('activity_logs', [
            'user_id' => $this->joki->id,
            'action' => 'STATUS_CHANGED',
        ]);
    }

    /**
     * Test Buyer cannot change order status.
     */
    public function test_buyer_cannot_change_status(): void
    {
        $order = $this->createWaitingOrder();
        $order->update([
            'status' => 'ASSIGNED',
            'assigned_joki_id' => $this->joki->id,
        ]);

        $response = $this->actingAs($this->buyer)
            ->post(route('joki.orders.status', $order->id), ['status' => 'SHOPPING']);

        $response->assertStatus(403);
    }

    /**
     * Test Buyer cannot assign an order.
     */
    public function test_buyer_cannot_assign_order(): void
    {
        $order = $this->createWaitingOrder();

        $response = $this->actingAs($this->buyer)
            ->post(route('joki.orders.assign', $order->id));

        $response->assertStatus(403);
    }
}
