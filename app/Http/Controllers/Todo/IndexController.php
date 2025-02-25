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
        $date = CarbonImmutable::createFromDate($request->date('date'))
            ->startOfDay();

        $today = CarbonImmutable::now()
            ->startOfDay();

        return inertia('dashboard', [
            'date' => $date->format('Y-m-d'),
            'todos' => auth()->user()->todos()->forDay($date)->orderBy('sort_order')->get(),
            'triage' => $date->isSameDay($today) ? auth()->user()->todos()->forDay($today->subDay())->where('completed', '=', false)->where('ignored_when_late', '=', false)->get() : [],
            'notes' => auth()->user()->notes()->where('day', '=', $date)->first(),
        ]);
    }
}
