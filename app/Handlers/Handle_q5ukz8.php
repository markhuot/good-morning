<?php

namespace App\Handlers;

class Handle_q5ukz8
{
    public function __invoke(...$params)
    {
        
    //$request = app(\App\Requests\Todo\StoreRequest::class);

    $maxSortOrder = auth()->user()->todos()
        ->where('day', '=', $params[0])
        ->max('sort_order');

    return auth()->user()->todos()->create([
        'title' => $params[1],
        'day' => \Carbon\Carbon::createFromFormat('Y-m-d', $params[2]),
        'sort_order' => $maxSortOrder + 1,
    ]);

    }
}
