<?php

namespace App\Services;

use App\Models\ActivityLog;
use App\Models\MasterChecklist;
use App\Models\MasterChecklistItem;
use App\Models\Order;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class AggregationService
{
    /**
     * Aggregate eligible orders (status = ASSIGNED, no checklist)
     * into Master Checklists chunked by max 5 orders, isolated by market and joki.
     *
     * @return int Number of checklists generated
     */
    public function aggregateEligibleOrders(): int
    {
        return DB::transaction(function () {
            // Fetch eligible orders with a write lock to prevent race conditions
            $orders = Order::with('items')
                ->where('status', 'ASSIGNED')
                ->whereNull('master_checklist_id')
                ->lockForUpdate()
                ->get();

            if ($orders->isEmpty()) {
                return 0;
            }

            // Group orders by market_id and assigned_joki_id
            $grouped = $orders->groupBy(function (Order $order) {
                return $order->market_id . '-' . $order->assigned_joki_id;
            });

            $checklistsCount = 0;

            foreach ($grouped as $groupKey => $groupOrders) {
                // Chunk the grouped orders to max 5 per checklist
                $chunks = $groupOrders->chunk(5);

                foreach ($chunks as $chunk) {
                    // Double check in case of concurrent execution changes
                    $validOrders = $chunk->filter(function (Order $order) {
                        return $order->fresh()->master_checklist_id === null;
                    });

                    if ($validOrders->isEmpty()) {
                        continue;
                    }

                    $firstOrder = $validOrders->first();

                    // 1. Create Master Checklist
                    $checklist = MasterChecklist::create([
                        'market_id' => $firstOrder->market_id,
                        'assigned_joki_id' => $firstOrder->assigned_joki_id,
                        'status' => 'READY_TO_SHOP',
                    ]);

                    // 2. Associate Orders with this Checklist
                    foreach ($validOrders as $order) {
                        $order->update([
                            'master_checklist_id' => $checklist->id,
                        ]);
                    }

                    // 3. Aggregate Item Quantities (Case-insensitive matching)
                    $aggregatedItems = [];

                    foreach ($validOrders as $order) {
                        foreach ($order->items as $item) {
                            $normalizedKey = trim(strtolower($item->product_name));

                            if (! isset($aggregatedItems[$normalizedKey])) {
                                $aggregatedItems[$normalizedKey] = [
                                    'name' => $item->product_name, // keep original casing of the first item found
                                    'quantity' => 0,
                                ];
                            }

                            $aggregatedItems[$normalizedKey]['quantity'] += $item->quantity;
                        }
                    }

                    // 4. Create Master Checklist Items
                    foreach ($aggregatedItems as $aggItem) {
                        MasterChecklistItem::create([
                            'checklist_id' => $checklist->id,
                            'item_name' => $aggItem['name'],
                            'total_quantity' => $aggItem['quantity'],
                        ]);
                    }

                    // 5. Create Activity Log
                    ActivityLog::create([
                        'user_id' => auth()->id() ?? $firstOrder->assigned_joki_id,
                        'action' => 'CHECKLIST_GENERATED',
                        'metadata' => [
                            'checklist_id' => $checklist->id,
                            'total_orders' => $validOrders->count(),
                            'total_items' => count($aggregatedItems),
                        ],
                    ]);

                    // Structured Contextual Log
                    Log::info('Master Checklist generated.', [
                        'checklist_id' => $checklist->id,
                        'market_id' => $checklist->market_id,
                        'assigned_joki_id' => $checklist->assigned_joki_id,
                        'total_orders' => $validOrders->count(),
                        'total_items' => count($aggregatedItems),
                    ]);

                    // Invalidate Caches
                    Cache::forget('checklists:admin');
                    Cache::forget("checklists:joki:{$firstOrder->assigned_joki_id}");

                    $checklistsCount++;
                }
            }

            return $checklistsCount;
        });
    }
}
