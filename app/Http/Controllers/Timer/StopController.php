<?php

namespace App\Http\Controllers\Timer;

use App\Http\Controllers\Controller;
use App\Models\Todo;
use Illuminate\Http\Request;

class StopController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Todo $todo)
    {
        $todo->stopTimer();
        $todo->save();

        return redirect()->back();
    }
}
