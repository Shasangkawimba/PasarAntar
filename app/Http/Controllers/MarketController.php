<?php

namespace App\Http\Controllers;

use App\Models\Market;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MarketController extends Controller
{
    /**
     * Display a listing of active markets.
     */
    public function index(Request $request): Response
    {
        $markets = \Illuminate\Support\Facades\Cache::remember('markets:active', now()->addHours(24), function () {
            return Market::where('is_active', true)->get()->toArray();
        });

        $marketsArray = is_array($markets) ? array_values($markets) : $markets->values()->all();

        return Inertia::render('Buyer/MarketList', [
            'markets' => $marketsArray,
        ]);
    }

    /**
     * Display a listing of all markets for Admin.
     */
    public function adminIndex(): Response
    {
        $markets = Market::orderBy('id', 'desc')->get();
        return Inertia::render('Admin/MarketList', [
            'markets' => $markets,
        ]);
    }

    /**
     * Store a newly created market in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:markets,name',
            'address' => 'required|string',
        ]);

        Market::create([
            'name' => $validated['name'],
            'address' => $validated['address'],
            'is_active' => true,
        ]);

        \Illuminate\Support\Facades\Cache::forget('markets:active');

        return redirect()->back()->with('success', 'Pasar berhasil ditambahkan.');
    }

    /**
     * Toggle the active status of a market.
     */
    public function toggleStatus(Market $market)
    {
        $market->update([
            'is_active' => !$market->is_active,
        ]);

        \Illuminate\Support\Facades\Cache::forget('markets:active');

        return redirect()->back()->with('success', 'Status pasar berhasil diperbarui.');
    }
}
