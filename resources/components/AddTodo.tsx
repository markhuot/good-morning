import React from "react";
import {phpEventHandler} from "../js/php";

const addTodo = phpEventHandler`
    $request = app(\App\Requests\Todo\StoreRequest::class);

    $maxSortOrder = auth()->user()->todos()
        ->where('day', '=', $request->date->format('Y-m-d'))
        ->max('sort_order');

    return auth()->user()->todos()->create([
        'title' => $request->title,
        'day' => $request->date,
        'sort_order' => $maxSortOrder + 1,
    ]);
`;

export function AddTodo({ date }) {
    return (
        <form action={addTodo}>
            <input type="hidden" name="date" value={date}/>
            <input type="text" name="title"/>
            <button type="submit">Add</button>
        </form>
    );
}
