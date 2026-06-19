<?php

namespace Tests\Feature;

use App\Events\OrderAssigned;
use App\Events\OrderStatusChanged;
use App\Events\SettlementUpdated;
use App\Models\Market;
use App\Models\Order;
use App\Models\User;
use App\Services\OrderService;
use App\Services\ReceiptUploadService;
use App\Services\SettlementService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class RealtimeTrackingTest extends TestCase
{
    use RefreshDatabase;

    protected User $buyer;
    protected User $joki;
    protected User $admin;
    protected Market $market;
    protected Order $order;

    protected function setUp(): void
    {
        parent::setUp();

        $this->buyer = User::factory()->buyer()->create();
        $this->joki = User::factory()->joki()->create();
        $this->admin = User::factory()->admin()->create();
        $this->market = Market::create([
            'name' => 'Pasar Baru',
            'address' => 'Jl. Baru',
            'is_active' => true,
        ]);
        $this->order = Order::create([
            'buyer_id' => $this->buyer->id,
            'market_id' => $this->market->id,
            'estimated_amount' => 50000,
            'status' => 'WAITING_FOR_JOKI',
        ]);
    }

    /**
     * Test OrderAssigned event is dispatched on assignOrder.
     */
    public function test_order_assigned_event_dispatched(): void
    {
        Event::fake([OrderAssigned::class]);

        $orderService = app(OrderService::class);
        $orderService->assignOrder($this->joki, $this->order);

        Event::assertDispatched(OrderAssigned::class, function ($event) {
            $this->assertEquals($this->order->id, $event->order->id);
            $this->assertEquals('ASSIGNED', $event->order->status);
            
            $payload = $event->broadcastWith();
            $this->assertEquals($this->order->id, $payload['order_id']);
            $this->assertEquals('ASSIGNED', $payload['status']);
            $this->assertEquals($this->joki->name, $payload['assigned_joki_name']);
            $this->assertEquals($this->joki->phone_number, $payload['assigned_joki_phone']);
            $this->assertArrayHasKey('activity_log', $payload);
            $this->assertNotNull($payload['activity_log']);
            $this->assertEquals('ORDER_ASSIGNED', $payload['activity_log']['action']);
            
            $channels = $event->broadcastOn();
            $this->assertCount(1, $channels);
            $this->assertEquals('private-orders.' . $this->order->id, $channels[0]->name);

            return true;
        });
    }

    /**
     * Test OrderStatusChanged event is dispatched on status change.
     */
    public function test_order_status_changed_event_dispatched(): void
    {
        Event::fake([OrderStatusChanged::class]);

        $order = Order::create([
            'buyer_id' => $this->buyer->id,
            'market_id' => $this->market->id,
            'assigned_joki_id' => $this->joki->id,
            'status' => 'ASSIGNED',
            'estimated_amount' => 50000,
        ]);

        $orderService = app(OrderService::class);
        $orderService->updateStatus($this->joki, $order, 'SHOPPING');

        Event::assertDispatched(OrderStatusChanged::class, function ($event) use ($order) {
            $this->assertEquals($order->id, $event->order->id);
            $this->assertEquals('SHOPPING', $event->order->status);
            
            $payload = $event->broadcastWith();
            $this->assertEquals('SHOPPING', $payload['status']);
            $this->assertEquals('STATUS_CHANGED', $payload['activity_log']['action']);

            return true;
        });
    }

    /**
     * Test SettlementUpdated event is dispatched on receipt upload.
     */
    public function test_settlement_updated_event_dispatched_on_receipt_upload(): void
    {
        Event::fake([SettlementUpdated::class]);
        Storage::fake('public');

        $order = Order::create([
            'buyer_id' => $this->buyer->id,
            'market_id' => $this->market->id,
            'assigned_joki_id' => $this->joki->id,
            'status' => 'SHOPPING',
            'estimated_amount' => 50000,
        ]);

        $file = UploadedFile::fake()->image('receipt.jpg');
        $uploadService = app(ReceiptUploadService::class);
        $uploadService->upload($this->joki, $order, $file);

        Event::assertDispatched(SettlementUpdated::class, function ($event) use ($order) {
            $this->assertEquals($order->id, $event->order->id);
            
            $payload = $event->broadcastWith();
            $this->assertCount(1, $payload['receipts']);
            $this->assertEquals('RECEIPT_UPLOADED', $payload['activity_log']['action']);

            return true;
        });
    }

    /**
     * Test SettlementUpdated event is dispatched on settlement save.
     */
    public function test_settlement_updated_event_dispatched_on_settlement_save(): void
    {
        Event::fake([SettlementUpdated::class]);

        $order = Order::create([
            'buyer_id' => $this->buyer->id,
            'market_id' => $this->market->id,
            'assigned_joki_id' => $this->joki->id,
            'status' => 'SHOPPING',
            'estimated_amount' => 50000,
        ]);

        $settlementService = app(SettlementService::class);
        $settlementService->calculateAndSave($order, 45000);

        Event::assertDispatched(SettlementUpdated::class, function ($event) use ($order) {
            $this->assertEquals($order->id, $event->order->id);
            
            $payload = $event->broadcastWith();
            $this->assertEquals(45000, $payload['actual_amount']);
            $this->assertEquals(5000, $payload['refund_amount']);
            $this->assertEquals(0, $payload['additional_payment']);
            $this->assertEquals('SETTLEMENT_CALCULATED', $payload['activity_log']['action']);

            return true;
        });
    }

    /**
     * Test channel authorization access control.
     */
    public function test_channel_authorization_access_control(): void
    {
        config([
            'broadcasting.default' => 'reverb',
            'broadcasting.connections.reverb.key' => 'test-key',
            'broadcasting.connections.reverb.secret' => 'test-secret',
            'broadcasting.connections.reverb.app_id' => 'test-app',
        ]);

        $order = Order::create([
            'buyer_id' => $this->buyer->id,
            'market_id' => $this->market->id,
            'assigned_joki_id' => $this->joki->id,
            'status' => 'ASSIGNED',
            'estimated_amount' => 50000,
        ]);

        $otherBuyer = User::factory()->buyer()->create();
        $otherJoki = User::factory()->joki()->create();

        // 1. Buyer of the order: ALLOWED
        $this->actingAs($this->buyer);
        
        config(['broadcasting.default' => 'reverb']);
        $this->app->singleton(\Illuminate\Broadcasting\BroadcastManager::class, function ($app) {
            return new \Illuminate\Broadcasting\BroadcastManager($app);
        });
        $this->app->alias(\Illuminate\Broadcasting\BroadcastManager::class, \Illuminate\Contracts\Broadcasting\Factory::class);
        $this->app->alias(\Illuminate\Broadcasting\BroadcastManager::class, \Illuminate\Contracts\Broadcasting\Broadcaster::class);
        \Illuminate\Support\Facades\Broadcast::clearResolvedInstances();
        
        require base_path('routes/channels.php');

        $response = $this->postJson('/broadcasting/auth', [
            'channel_name' => 'private-orders.' . $order->id,
            'socket_id' => '1234.1234',
        ]);
        $response->assertStatus(200);

        // 2. Other buyer: DENIED
        $this->actingAs($otherBuyer);
        $response = $this->postJson('/broadcasting/auth', [
            'channel_name' => 'private-orders.' . $order->id,
            'socket_id' => '1234.1234',
        ]);
        $response->assertStatus(403);

        // 3. Assigned Joki: ALLOWED
        $this->actingAs($this->joki);
        $response = $this->postJson('/broadcasting/auth', [
            'channel_name' => 'private-orders.' . $order->id,
            'socket_id' => '1234.1234',
        ]);
        $response->assertStatus(200);

        // 4. Other Joki: DENIED
        $this->actingAs($otherJoki);
        $response = $this->postJson('/broadcasting/auth', [
            'channel_name' => 'private-orders.' . $order->id,
            'socket_id' => '1234.1234',
        ]);
        $response->assertStatus(403);

        // 5. Admin: ALLOWED
        $this->actingAs($this->admin);
        $response = $this->postJson('/broadcasting/auth', [
            'channel_name' => 'private-orders.' . $order->id,
            'socket_id' => '1234.1234',
        ]);
        $response->assertStatus(200);
    }
}
