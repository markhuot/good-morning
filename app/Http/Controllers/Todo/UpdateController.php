<?php

namespace App\Http\Controllers\Todo;

use App\Http\Controllers\Controller;
use App\Models\Todo;
use App\Requests\Todo\UpdateRequest;
use Illuminate\Http\Request;

class UpdateController extends Controller
{
    public function __invoke(Todo $todo, UpdateRequest $request)
    {
        if ($request->title) {
            $todo->title = $request->title;
        }

        if ($request->day !== null) {
            $todo->day = $request->day;
        }

        if ($request->completed !== null) {
            $todo->completed = $request->completed;
        }

        if ($request->completed === true) {
            $todo->stopTimer();
        }

        if ($todo->isDirty()) {
            $todo->save();
        }

        if (request()->wantsJson()) {
            return $todo;
        }

        return redirect()->route('dashboard');
    }
}
