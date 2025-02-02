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
        return view('dashboard.index', [
            'date' => CarbonImmutable::createFromDate($request->date('date'))->startOfDay(),
            'todos' => auth()->user()->todos()->orderBy('sort_order'),
            'notes' => auth()->user()->notes(),
        ]);
    }
}
