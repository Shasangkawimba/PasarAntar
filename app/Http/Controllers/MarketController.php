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
        $markets = Market::where('is_active', true)->get();

        return Inertia::render('Buyer/MarketList', [
            'markets' => $markets,
        ]);
    }
}
