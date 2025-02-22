import React from "react";
import {php} from "@markhuot/synapse/php";
import {usePage} from "@inertiajs/react";

const addTodo = php`
    use App\Models\Todo;
    use App\Requests\Todo\StoreRequest;

    $request = app(StoreRequest::class);
    Gate::authorize('create', Todo::class);

    $maxSortOrder = auth()->user()->todos()
        ->where('day', '=', $request->date->format('Y-m-d'))
        ->max('sort_order');

    auth()->user()->todos()->create([
        'title' => $request->title,
        'day' => $request->date,
        'sort_order' => $maxSortOrder + 1,
    ]);
`.execute;

export function AddTodo({ date }) {
    const {errors} = usePage().props;

    return (
        <form action={addTodo}>
            <input type="hidden" name="date" value={date}/>
            <input type="text" name="title" placeholder="title"/>
            {errors.title && <div>{errors.title}</div>}
            <button type="submit">Add</button>
        </form>
    );
}
