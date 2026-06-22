<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

use App\Http\Controllers\MarketController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\MasterChecklistController;
use App\Http\Controllers\ComplaintController;
use Illuminate\Http\Request;

Route::get('/dashboard', function (Request $request) {
    $user = $request->user();
    if ($user->isAdmin()) {
        return redirect()->route('admin.orders.index');
    }
    if ($user->isJoki()) {
        return redirect()->route('joki.orders.index');
    }
    return redirect()->route('markets.index');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Buyer routes
    Route::middleware('role:buyer')->group(function () {
        Route::get('/markets', [MarketController::class, 'index'])->name('markets.index');
        Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
        Route::get('/orders/create/{market}', [OrderController::class, 'create'])->name('orders.create');
        Route::post('/orders', [OrderController::class, 'store'])->name('orders.store');
        Route::post('/orders/{order}/complaints', [ComplaintController::class, 'store'])->name('complaints.store');
    });

    // Shared routes between Buyer and Joki
    Route::middleware('role:buyer,joki')->group(function () {
        Route::get('/orders/{order}', [OrderController::class, 'show'])->name('orders.show');
    });

    // Admin routes
    Route::middleware('role:admin')->group(function () {
        Route::get('/admin/orders', [OrderController::class, 'adminIndex'])->name('admin.orders.index');
        Route::get('/admin/orders/{order}', [OrderController::class, 'adminShow'])->name('admin.orders.show');
        Route::get('/admin/checklists', [MasterChecklistController::class, 'adminIndex'])->name('admin.checklists.index');
        Route::get('/admin/checklists/{checklist}', [MasterChecklistController::class, 'adminShow'])->name('admin.checklists.show');
        Route::post('/admin/checklists/generate', [MasterChecklistController::class, 'triggerAggregation'])->name('admin.checklists.generate');
        Route::get('/admin/complaints', [ComplaintController::class, 'adminIndex'])->name('admin.complaints.index');
        Route::post('/admin/complaints/{complaint}/status', [ComplaintController::class, 'adminUpdateStatus'])->name('admin.complaints.status');
        
        // Admin Market Management
        Route::get('/admin/markets', [MarketController::class, 'adminIndex'])->name('admin.markets.index');
        Route::post('/admin/markets', [MarketController::class, 'store'])->name('admin.markets.store');
        Route::patch('/admin/markets/{market}/toggle', [MarketController::class, 'toggleStatus'])->name('admin.markets.toggle');
    });

    // Joki routes
    Route::middleware('role:joki')->group(function () {
        Route::get('/joki/orders', [OrderController::class, 'jokiIndex'])->name('joki.orders.index');
        Route::get('/joki/assigned', [OrderController::class, 'jokiAssignedOrders'])->name('joki.orders.assigned');
        Route::get('/joki/orders/{order}', [OrderController::class, 'jokiOrderWorkflow'])->name('joki.orders.show');
        Route::post('/joki/orders/{order}/assign', [OrderController::class, 'assignOrder'])->name('joki.orders.assign');
        Route::post('/joki/orders/{order}/status', [OrderController::class, 'updateOrderStatus'])->name('joki.orders.status');
        Route::post('/joki/orders/{order}/settle', [OrderController::class, 'saveSettlement'])->name('joki.orders.settle');
        Route::get('/joki/checklists', [MasterChecklistController::class, 'jokiIndex'])->name('joki.checklists.index');
        Route::get('/joki/checklists/{checklist}', [MasterChecklistController::class, 'jokiShow'])->name('joki.checklists.show');
    });
});

Route::get('/health', function () {
    try {
        \DB::connection()->getPdo();
        $dbStatus = 'OK';
    } catch (\Exception $e) {
        $dbStatus = 'FAILED: ' . $e->getMessage();
    }

    try {
        \Illuminate\Support\Facades\Redis::connection()->ping();
        $redisStatus = 'OK';
    } catch (\Exception $e) {
        $redisStatus = 'FAILED: ' . $e->getMessage();
    }

    $statusCode = ($dbStatus === 'OK' && $redisStatus === 'OK') ? 200 : 500;

    return response()->json([
        'status' => $statusCode === 200 ? 'healthy' : 'unhealthy',
        'database' => $dbStatus,
        'redis' => $redisStatus,
    ], $statusCode);
});

require __DIR__.'/auth.php';
