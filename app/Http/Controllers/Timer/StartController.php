<?php

namespace App\Http\Controllers\Timer;

use App\Http\Controllers\Controller;
use App\Models\Todo;
use Illuminate\Http\Request;

class StartController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Todo $todo)
    {
        $todo->startTimer();
        $todo->save();

        return redirect()->back();
    }
}
