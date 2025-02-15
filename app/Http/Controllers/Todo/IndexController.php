<?php

namespace App\Http\Controllers\Todo;

use App\Http\Controllers\Controller;
use Carbon\CarbonImmutable;
use Illuminate\Http\Request;

class IndexController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        return inertia('dashboard', [
            'date' => $date = CarbonImmutable::createFromDate($request->date('date'))->startOfDay()->format('Y-m-d'),
            'todos' => auth()->user()->todos()->where('day', '=', $date)->orderBy('sort_order')->get(),
            'notes' => auth()->user()->notes()->where('day', '=', $date)->first(),
        ]);
    }
}
