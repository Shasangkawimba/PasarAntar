<?php

namespace App\Jobs;

use App\Services\AggregationService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class GenerateMasterChecklistJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(AggregationService $aggregationService): void
    {
        Log::info('GenerateMasterChecklistJob started.');
        $count = $aggregationService->aggregateEligibleOrders();
        Log::info("GenerateMasterChecklistJob finished. Generated {$count} checklists.");
    }
}
