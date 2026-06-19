<?php

namespace Tests\Feature;

use App\Models\ActivityLog;
use App\Models\Market;
use App\Models\MasterChecklist;
use App\Models\MasterChecklistItem;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Receipt;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DomainModelTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test User roles and helper methods.
     */
    public function test_user_roles_and_helpers(): void
    {
        $buyer = User::factory()->buyer()->create();
        $joki = User::factory()->joki()->create();
        $admin = User::factory()->admin()->create();

        $this->assertTrue($buyer->isBuyer());
        $this->assertFalse($buyer->isJoki());
        $this->assertFalse($buyer->isAdmin());

        $this->assertTrue($joki->isJoki());
        $this->assertFalse($joki->isBuyer());
        $this->assertFalse($joki->isAdmin());

        $this->assertTrue($admin->isAdmin());
        $this->assertFalse($admin->isBuyer());
        $this->assertFalse($admin->isJoki());
    }

    /**
     * Test Market creation and relationships.
     */
    public function test_market_creation_and_relationships(): void
    {
        $market = Market::create([
            'name' => 'Pasar Gede',
            'address' => 'Jl. Jend. Sudirman No. 1',
            'is_active' => true,
        ]);

        $this->assertDatabaseHas('markets', [
            'name' => 'Pasar Gede',
            'is_active' => true,
        ]);

        $this->assertInstanceOf(Market::class, $market);
    }

    /**
     * Test Order creation, automatic order_number generation, and relationships.
     */
    public function test_order_creation_and_relations(): void
    {
        $buyer = User::factory()->buyer()->create();
        $joki = User::factory()->joki()->create();
        $market = Market::create([
            'name' => 'Pasar Gede',
            'address' => 'Jl. Jend. Sudirman No. 1',
        ]);

        $checklist = MasterChecklist::create([
            'market_id' => $market->id,
            'assigned_joki_id' => $joki->id,
            'status' => 'READY_TO_SHOP',
        ]);

        $order = Order::create([
            'buyer_id' => $buyer->id,
            'market_id' => $market->id,
            'assigned_joki_id' => $joki->id,
            'master_checklist_id' => $checklist->id,
            'status' => 'WAITING_FOR_JOKI',
            'estimated_amount' => 150000,
        ]);

        // Verify order number auto generation
        $this->assertNotEmpty($order->order_number);
        $this->assertStringStartsWith('PA-', $order->order_number);

        // Verify relationships
        $this->assertEquals($buyer->id, $order->buyer->id);
        $this->assertEquals($market->id, $order->market->id);
        $this->assertEquals($joki->id, $order->joki->id);
        $this->assertEquals($checklist->id, $order->masterChecklist->id);

        // Verify reverse relationships
        $this->assertCount(1, $buyer->orders);
        $this->assertEquals($order->id, $buyer->orders->first()->id);

        $this->assertCount(1, $joki->assignedOrders);
        $this->assertEquals($order->id, $joki->assignedOrders->first()->id);

        $this->assertCount(1, $market->orders);
        $this->assertCount(1, $checklist->orders);
    }

    /**
     * Test OrderItem creation and relationships.
     */
    public function test_order_item_creation_and_relationships(): void
    {
        $buyer = User::factory()->buyer()->create();
        $market = Market::create(['name' => 'Pasar Gede', 'address' => 'Jl. Jend. Sudirman']);
        $order = Order::create([
            'buyer_id' => $buyer->id,
            'market_id' => $market->id,
            'estimated_amount' => 50000,
        ]);

        $item = OrderItem::create([
            'order_id' => $order->id,
            'product_name' => 'Bayam',
            'quantity' => 3,
            'notes' => 'Pilih yang segar',
        ]);

        $this->assertEquals($order->id, $item->order->id);
        $this->assertCount(1, $order->items);
        $this->assertEquals('Bayam', $order->items->first()->product_name);
    }

    /**
     * Test MasterChecklist and MasterChecklistItem relationships.
     */
    public function test_master_checklist_items_relations(): void
    {
        $market = Market::create(['name' => 'Pasar Gede', 'address' => 'Jl. Jend. Sudirman']);
        $checklist = MasterChecklist::create([
            'market_id' => $market->id,
            'status' => 'READY_TO_SHOP',
        ]);

        $checkItem = MasterChecklistItem::create([
            'checklist_id' => $checklist->id,
            'item_name' => 'Bayam',
            'total_quantity' => 10,
        ]);

        $this->assertEquals($checklist->id, $checkItem->checklist->id);
        $this->assertCount(1, $checklist->items);
        $this->assertEquals('Bayam', $checklist->items->first()->item_name);
    }

    /**
     * Test Receipt and ActivityLog models.
     */
    public function test_receipt_and_activity_log(): void
    {
        $buyer = User::factory()->buyer()->create();
        $joki = User::factory()->joki()->create();
        $market = Market::create(['name' => 'Pasar Gede', 'address' => 'Jl. Jend. Sudirman']);
        $order = Order::create([
            'buyer_id' => $buyer->id,
            'market_id' => $market->id,
            'estimated_amount' => 50000,
        ]);

        $receipt = Receipt::create([
            'order_id' => $order->id,
            'image_url' => 'https://example.com/receipt.jpg',
            'uploaded_by' => $joki->id,
        ]);

        $this->assertEquals($order->id, $receipt->order->id);
        $this->assertEquals($joki->id, $receipt->uploader->id);
        $this->assertCount(1, $order->receipts);

        $log = ActivityLog::create([
            'user_id' => $buyer->id,
            'action' => 'ORDER_CREATED',
            'metadata' => ['order_id' => $order->id],
        ]);

        $this->assertEquals($buyer->id, $log->user->id);
        $this->assertEquals($order->id, $log->metadata['order_id']);
    }
}
