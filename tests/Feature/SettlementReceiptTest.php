<?php

namespace Tests\Feature;

use App\Models\ActivityLog;
use App\Models\Market;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class SettlementReceiptTest extends TestCase
{
    use RefreshDatabase;

    protected User $buyer;
    protected User $assignedJoki;
    protected User $otherJoki;
    protected Market $market;
    protected Order $order;

    protected function setUp(): void
    {
        parent::setUp();

        // Create users
        $this->buyer = User::factory()->buyer()->create();
        $this->assignedJoki = User::factory()->joki()->create();
        $this->otherJoki = User::factory()->joki()->create();

        // Create market
        $this->market = Market::create([
            'name' => 'Pasar Kramat Jati',
            'address' => 'Jl. Raya Bogor',
            'is_active' => true,
        ]);

        // Create order in SHOPPING status assigned to Joki
        $this->order = Order::create([
            'buyer_id' => $this->buyer->id,
            'market_id' => $this->market->id,
            'assigned_joki_id' => $this->assignedJoki->id,
            'status' => 'SHOPPING',
            'estimated_amount' => 100000,
        ]);

        // Add an order item
        OrderItem::create([
            'order_id' => $this->order->id,
            'product_name' => 'Bayam',
            'quantity' => 2,
        ]);

        Storage::fake('public');
    }

    /**
     * Test that the assigned Joki can upload a receipt and set the actual amount.
     */
    public function test_assigned_joki_can_upload_receipt_and_settle(): void
    {
        $file = UploadedFile::fake()->image('receipt.jpg');

        $response = $this->actingAs($this->assignedJoki)
            ->post(route('joki.orders.settle', $this->order->id), [
                'actual_amount' => 90000,
                'receipt' => $file,
            ]);

        $response->assertRedirect(route('joki.orders.show', $this->order->id));
        $response->assertSessionHas('success');

        // Assert database updates
        $this->order->refresh();
        $this->assertEquals(90000, $this->order->actual_amount);
        $this->assertEquals(10000, $this->order->refund_amount);
        $this->assertEquals(0, $this->order->additional_payment);

        $this->assertCount(1, $this->order->receipts);
        $receipt = $this->order->receipts->first();
        $this->assertNotNull($receipt->image_url);
        $this->assertEquals($this->assignedJoki->id, $receipt->uploaded_by);

        // Assert files exist on disk
        $path = str_replace('/storage/', '', $receipt->image_url);
        Storage::disk('public')->assertExists($path);
    }

    /**
     * Test that an unassigned Joki cannot upload a receipt or settle.
     */
    public function test_non_assigned_joki_cannot_upload_receipt_or_settle(): void
    {
        $file = UploadedFile::fake()->image('receipt.jpg');

        $response = $this->actingAs($this->otherJoki)
            ->post(route('joki.orders.settle', $this->order->id), [
                'actual_amount' => 90000,
                'receipt' => $file,
            ]);

        $response->assertStatus(403);
        $this->assertEquals(0, $this->order->refresh()->receipts()->count());
        $this->assertNull($this->order->actual_amount);
    }

    /**
     * Test that a Buyer cannot upload a receipt or settle.
     */
    public function test_buyer_cannot_upload_receipt_or_settle(): void
    {
        $file = UploadedFile::fake()->image('receipt.jpg');

        $response = $this->actingAs($this->buyer)
            ->post(route('joki.orders.settle', $this->order->id), [
                'actual_amount' => 90000,
                'receipt' => $file,
            ]);

        $response->assertStatus(403);
        $this->assertEquals(0, $this->order->refresh()->receipts()->count());
        $this->assertNull($this->order->actual_amount);
    }

    /**
     * Test settlement calculation: Refund case.
     */
    public function test_settlement_calculation_refund(): void
    {
        $file = UploadedFile::fake()->image('receipt.jpg');

        $response = $this->actingAs($this->assignedJoki)
            ->post(route('joki.orders.settle', $this->order->id), [
                'actual_amount' => 85000,
                'receipt' => $file,
            ]);

        $response->assertRedirect();
        $this->order->refresh();
        $this->assertEquals(85000, $this->order->actual_amount);
        $this->assertEquals(15000, $this->order->refund_amount);
        $this->assertEquals(0, $this->order->additional_payment);
    }

    /**
     * Test settlement calculation: Additional payment case.
     */
    public function test_settlement_calculation_additional_payment(): void
    {
        $file = UploadedFile::fake()->image('receipt.jpg');

        $response = $this->actingAs($this->assignedJoki)
            ->post(route('joki.orders.settle', $this->order->id), [
                'actual_amount' => 120000,
                'receipt' => $file,
            ]);

        $response->assertRedirect();
        $this->order->refresh();
        $this->assertEquals(120000, $this->order->actual_amount);
        $this->assertEquals(0, $this->order->refund_amount);
        $this->assertEquals(20000, $this->order->additional_payment);
    }

    /**
     * Test settlement calculation: Exact match case.
     */
    public function test_settlement_calculation_exact_match(): void
    {
        $file = UploadedFile::fake()->image('receipt.jpg');

        $response = $this->actingAs($this->assignedJoki)
            ->post(route('joki.orders.settle', $this->order->id), [
                'actual_amount' => 100000,
                'receipt' => $file,
            ]);

        $response->assertRedirect();
        $this->order->refresh();
        $this->assertEquals(100000, $this->order->actual_amount);
        $this->assertEquals(0, $this->order->refund_amount);
        $this->assertEquals(0, $this->order->additional_payment);
    }

    /**
     * Test that order cannot transition to COMPLETED without uploading a receipt.
     */
    public function test_cannot_complete_without_receipt(): void
    {
        // First move status to DELIVERING
        $this->order->update(['status' => 'DELIVERING']);

        // Set actual amount but DO NOT upload a receipt
        $this->order->update(['actual_amount' => 90000]);

        $response = $this->actingAs($this->assignedJoki)
            ->post(route('joki.orders.status', $this->order->id), [
                'status' => 'COMPLETED',
            ]);

        $response->assertSessionHasErrors('status');
        $this->assertEquals('DELIVERING', $this->order->refresh()->status);
    }

    /**
     * Test that order cannot transition to COMPLETED without actual amount.
     */
    public function test_cannot_complete_without_actual_amount(): void
    {
        // Move status to DELIVERING
        $this->order->update(['status' => 'DELIVERING']);

        // Upload a receipt but DO NOT set actual_amount
        $file = UploadedFile::fake()->image('receipt.jpg');
        $this->actingAs($this->assignedJoki)
            ->post(route('joki.orders.settle', $this->order->id), [
                'actual_amount' => 0, // This sets actual amount to 0, which IS set. We want it to be null.
                'receipt' => $file,
            ]);

        // Reset actual amount to null manually to simulate receipt uploaded but actual amount empty
        $this->order->update(['actual_amount' => null]);

        $response = $this->actingAs($this->assignedJoki)
            ->post(route('joki.orders.status', $this->order->id), [
                'status' => 'COMPLETED',
            ]);

        $response->assertSessionHasErrors('status');
        $this->assertEquals('DELIVERING', $this->order->refresh()->status);
    }

    /**
     * Test that order can transition to COMPLETED when both receipt and actual amount exist.
     */
    public function test_can_complete_with_receipt_and_actual_amount(): void
    {
        $this->order->update(['status' => 'DELIVERING']);

        $file = UploadedFile::fake()->image('receipt.jpg');
        $this->actingAs($this->assignedJoki)
            ->post(route('joki.orders.settle', $this->order->id), [
                'actual_amount' => 95000,
                'receipt' => $file,
            ]);

        $response = $this->actingAs($this->assignedJoki)
            ->post(route('joki.orders.status', $this->order->id), [
                'status' => 'COMPLETED',
            ]);

        $response->assertRedirect(route('joki.orders.show', $this->order->id));
        $this->assertEquals('COMPLETED', $this->order->refresh()->status);
    }

    /**
     * Test that activity logs are created for receipt upload and settlement calculation.
     */
    public function test_activity_log_created(): void
    {
        $file = UploadedFile::fake()->image('receipt.jpg');

        $this->actingAs($this->assignedJoki)
            ->post(route('joki.orders.settle', $this->order->id), [
                'actual_amount' => 80000,
                'receipt' => $file,
            ]);

        // Assert RECEIPT_UPLOADED log exists
        $this->assertDatabaseHas('activity_logs', [
            'user_id' => $this->assignedJoki->id,
            'action' => 'RECEIPT_UPLOADED',
        ]);

        // Assert SETTLEMENT_CALCULATED log exists
        $this->assertDatabaseHas('activity_logs', [
            'user_id' => $this->assignedJoki->id,
            'action' => 'SETTLEMENT_CALCULATED',
        ]);

        $log = ActivityLog::where('action', 'SETTLEMENT_CALCULATED')->first();
        $this->assertEquals(100000, $log->metadata['estimated_amount']);
        $this->assertEquals(80000, $log->metadata['actual_amount']);
        $this->assertEquals(20000, $log->metadata['refund_amount']);
        $this->assertEquals(0, $log->metadata['additional_payment']);
    }
}
