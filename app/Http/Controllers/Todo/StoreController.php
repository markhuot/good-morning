<?php

namespace App\Http\Controllers\Todo;

use App\Http\Controllers\Controller;
use App\Requests\Todo\StoreRequest;
use Illuminate\Http\Request;

class StoreController extends Controller
{
    public function __invoke(StoreRequest $request)
    {
        $maxSortOrder = auth()->user()->todos()->where('day', '=', $request->date->format('Y-m-d'))->max('sort_order');

        auth()->user()->todos()->create([
            'title' => $request->title,
            'day' => $request->date,
            'sort_order' => $maxSortOrder + 1,
        ]);

        return redirect()->route('dashboard', ['date' => $request->date->format('Y-m-d')]);
    }
}
