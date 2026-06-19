<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number')->unique();
            $table->foreignId('buyer_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('market_id')->constrained('markets')->cascadeOnDelete();
            $table->foreignId('assigned_joki_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('master_checklist_id')->nullable()->constrained('master_checklists')->nullOnDelete();
            $table->string('status')->default('WAITING_FOR_JOKI'); // 'WAITING_FOR_JOKI', 'ASSIGNED', 'SHOPPING', 'DELIVERING', 'COMPLETED'
            $table->bigInteger('estimated_amount');
            $table->bigInteger('actual_amount')->nullable();
            $table->bigInteger('refund_amount')->nullable();
            $table->bigInteger('additional_payment')->nullable();
            $table->timestamps();

            // Indexes for optimizing queries
            $table->index(['buyer_id', 'status']);
            $table->index(['assigned_joki_id', 'status']);
            $table->index(['market_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
