<?php

namespace Tests\Feature;

use App\Exceptions\InvalidStatusTransitionException;
use App\Exceptions\UnauthorizedAssignmentException;
use App\Exceptions\SettlementValidationException;
use App\Models\Market;
use App\Models\Order;
use App\Models\User;
use App\Services\OrderService;
use App\Services\SettlementService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redis;
use Tests\TestCase;

class ProductionReadinessTest extends TestCase
{
    use RefreshDatabase;

    protected User $buyer;
    protected User $joki;
    protected Market $market;

    protected function setUp(): void
    {
        parent::setUp();

        $this->buyer = User::factory()->buyer()->create();
        $this->joki = User::factory()->joki()->create();
        $this->market = Market::create(['name' => 'Pasar Kramat', 'address' => 'Jl. Kramat', 'is_active' => true]);
    }

    /**
     * Test the health check endpoint returns 200 when database and Redis are operational.
     */
    public function test_health_endpoint(): void
    {
        // Mock Redis ping
        Redis::shouldReceive('connection')
            ->once()
            ->andReturn(new class {
                public function ping() {
                    return 'PONG';
                }
            });

        $response = $this->get('/health');

        $response->assertStatus(200);
        $response->assertJson([
            'status' => 'healthy',
            'database' => 'OK',
            'redis' => 'OK',
        ]);
    }

    /**
     * Test the health check endpoint returns 500 when Redis fails.
     */
    public function test_health_endpoint_fails_on_redis_error(): void
    {
        // Mock Redis throwing an exception
        Redis::shouldReceive('connection')
            ->once()
            ->andThrow(new \Exception('Redis connection timed out'));

        $response = $this->get('/health');

        $response->assertStatus(500);
        $response->assertJson([
            'status' => 'unhealthy',
            'database' => 'OK',
        ]);
        $this->assertStringContainsString('FAILED', $response->json('redis'));
    }

    /**
     * Test cache invalidation for Market lists.
     */
    public function test_cache_invalidation_markets(): void
    {
        Cache::flush();

        // 1. Visit markets list, cache active markets
        $this->actingAs($this->buyer)->get(route('markets.index'));
        $this->assertTrue(Cache::has('markets:active'));

        // 2. Modify a market, cache should be cleared
        $this->market->update(['name' => 'Pasar Kramat Baru']);
        $this->assertFalse(Cache::has('markets:active'));
    }

    /**
     * Test cache invalidation for Available Orders.
     */
    public function test_cache_invalidation_orders(): void
    {
        Cache::flush();

        // 1. Create a waiting order
        $order = Order::create([
            'buyer_id' => $this->buyer->id,
            'market_id' => $this->market->id,
            'estimated_amount' => 100000,
            'status' => 'WAITING_FOR_JOKI',
        ]);

        // 2. View available orders as Joki, should cache it
        $this->actingAs($this->joki)->get(route('joki.orders.index'));
        $this->assertTrue(Cache::has('orders:available'));

        // 3. Joki assigns/claims order, cache should be cleared
        $this->actingAs($this->joki)->post(route('joki.orders.assign', $order->id));
        $this->assertFalse(Cache::has('orders:available'));
    }

    /**
     * Test custom exception: InvalidStatusTransitionException rendering.
     */
    public function test_custom_exception_invalid_status_transition(): void
    {
        $order = Order::create([
            'buyer_id' => $this->buyer->id,
            'market_id' => $this->market->id,
            'assigned_joki_id' => $this->joki->id,
            'status' => 'ASSIGNED',
            'estimated_amount' => 100000,
        ]);

        // Transition from ASSIGNED directly to DELIVERING (invalid status transition)
        $response = $this->actingAs($this->joki)
            ->from(route('joki.orders.show', $order->id))
            ->post(route('joki.orders.status', $order->id), [
                'status' => 'DELIVERING',
            ]);

        // Verify it redirects back with error bag
        $response->assertRedirect(route('joki.orders.show', $order->id));
        $response->assertSessionHasErrors('status');
        
        $this->assertEquals(
            'Transisi status dari ASSIGNED ke DELIVERING tidak diperbolehkan.',
            session('errors')->get('status')[0]
        );
    }

    /**
     * Test custom exception: UnauthorizedAssignmentException rendering.
     */
    public function test_custom_exception_unauthorized_assignment(): void
    {
        $otherJoki = User::factory()->joki()->create();

        $order = Order::create([
            'buyer_id' => $this->buyer->id,
            'market_id' => $this->market->id,
            'assigned_joki_id' => $this->joki->id,
            'status' => 'ASSIGNED',
            'estimated_amount' => 100000,
        ]);

        // Other Joki tries to update status (unauthorized)
        $response = $this->actingAs($otherJoki)
            ->post(route('joki.orders.status', $order->id), [
                'status' => 'SHOPPING',
            ]);

        $response->assertStatus(403);
    }

    /**
     * Test custom exception: SettlementValidationException rendering.
     */
    public function test_custom_exception_settlement_validation(): void
    {
        $order = Order::create([
            'buyer_id' => $this->buyer->id,
            'market_id' => $this->market->id,
            'assigned_joki_id' => $this->joki->id,
            'status' => 'SHOPPING',
            'estimated_amount' => 100000,
        ]);

        $this->expectException(SettlementValidationException::class);

        app(SettlementService::class)->calculateAndSave($order, -1000);
    }
}
