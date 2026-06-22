<?php

namespace Tests\Feature;

use App\Models\Market;
use App\Models\Order;
use App\Models\User;
use App\Models\ActivityLog;
use App\Models\Complaint;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ComplaintTest extends TestCase
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

        $this->market = Market::create(['name' => 'Pasar A', 'address' => 'Alamat A', 'is_active' => true]);
        $this->buyer = User::factory()->buyer()->create();
        $this->otherBuyer = User::factory()->buyer()->create();
        $this->joki = User::factory()->joki()->create();
        $this->admin = User::factory()->admin()->create();
    }

    private function createCompletedOrder($buyerId, $timeOffsetHours = 0): Order
    {
        Carbon::setTestNow(Carbon::now()->subHours($timeOffsetHours));

        $order = Order::create([
            'buyer_id' => $buyerId,
            'market_id' => $this->market->id,
            'assigned_joki_id' => $this->joki->id,
            'status' => 'COMPLETED',
            'estimated_amount' => 100000,
            'actual_amount' => 100000,
        ]);

        // Mock activity log for completion
        ActivityLog::create([
            'user_id' => $this->joki->id,
            'action' => 'STATUS_CHANGED',
            'metadata' => [
                'order_id' => $order->id,
                'old_status' => 'DELIVERING',
                'new_status' => 'COMPLETED',
            ]
        ]);

        Carbon::setTestNow(); // reset to real now

        return $order;
    }

    public function test_buyer_can_create_complaint_within_24_hours(): void
    {
        $order = $this->createCompletedOrder($this->buyer->id, 10); // 10 hours ago

        $response = $this->actingAs($this->buyer)
            ->post(route('complaints.store', $order->id), [
                'reason' => 'Barang tidak sampai',
                'description' => 'Tunggu 10 jam tidak ada kabar',
            ]);

        $response->assertRedirect(route('orders.show', $order->id));
        $this->assertDatabaseHas('complaints', [
            'order_id' => $order->id,
            'buyer_id' => $this->buyer->id,
            'reason' => 'Barang tidak sampai',
            'status' => 'PENDING',
        ]);
    }

    public function test_buyer_cannot_create_complaint_after_24_hours(): void
    {
        $order = $this->createCompletedOrder($this->buyer->id, 25); // 25 hours ago

        $response = $this->actingAs($this->buyer)
            ->post(route('complaints.store', $order->id), [
                'reason' => 'Barang tidak sampai',
                'description' => 'Telat mengadu',
            ]);

        $response->assertSessionHasErrors('status');
        $this->assertDatabaseMissing('complaints', ['order_id' => $order->id]);
    }

    public function test_buyer_cannot_create_complaint_for_others_order(): void
    {
        $order = $this->createCompletedOrder($this->otherBuyer->id, 10);

        $response = $this->actingAs($this->buyer)
            ->post(route('complaints.store', $order->id), [
                'reason' => 'Barang tidak sampai',
                'description' => 'Bukan pesanan saya',
            ]);

        $response->assertStatus(403);
    }

    public function test_admin_can_resolve_complaint(): void
    {
        $order = $this->createCompletedOrder($this->buyer->id, 10);
        $complaint = Complaint::create([
            'order_id' => $order->id,
            'buyer_id' => $this->buyer->id,
            'reason' => 'Barang tidak sampai',
            'description' => 'Tunggu 10 jam',
            'status' => 'PENDING',
        ]);

        $response = $this->actingAs($this->admin)
            ->post(route('admin.complaints.status', $complaint->id), [
                'status' => 'RESOLVED',
                'admin_notes' => 'Dana telah dikembalikan secara manual',
            ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('complaints', [
            'id' => $complaint->id,
            'status' => 'RESOLVED',
            'admin_notes' => 'Dana telah dikembalikan secara manual',
        ]);
    }
}
