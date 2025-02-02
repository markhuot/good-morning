<?php

namespace App\Http\Controllers\Note;

use App\Http\Controllers\Controller;
use App\Models\Note;
use App\Requests\Note\StoreRequest;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Http\Request;

class StoreController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(StoreRequest $request)
    {
        /** @var HasMany $notesQuery */
        $notesQuery = auth()->user()->notes();
        $note = $notesQuery->upsert([
            'day' => $request->date->format('Y-m-d'),
            'contents' => $request->contents,
        ], [
            'user_id', 'day',
        ]);

        if (request()->wantsJson()) {
            return response()->json($note);
        }

        return redirect()->back();
    }
}
