<?php

namespace App\Http\Controllers\Todo;

use App\Http\Controllers\Controller;
use App\Models\Todo;
use Illuminate\Http\Request;

class ReorderController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $orderedIds = $request->collect('orderedIds');

        $todos = Todo::query()->whereIn('id', $orderedIds)->get();
        foreach ($todos as $todo) {
            $todo->sort_order = $orderedIds->search($todo->id);
            $todo->save();
        }

        if (request()->wantsJson()) {
            return $todos->map(fn ($todo) => ['id' => $todo->id, 'sort_order' => $todo->sort_order]);
        }

        return redirect()->back();
    }
}
