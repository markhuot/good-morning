import React from "react";
import {router} from "@inertiajs/react";

function php(strings, ...values) {
    return router.post('/handler', {
        hash: strings[0],
        params: values,
    });
}

// function php(strings, ...values) {
//     return formData => {
//         return router.post('/handler', {
//             ...Object.fromEntries(formData.entries()),
//             hash: strings[0],
//             params: values,
//         });
//     }
// }

const addTodo = formData => php`
    $maxSortOrder = auth()->user()->todos()
        ->where('day', '=', ${formData.get('date')})
        ->max('sort_order');

    return auth()->user()->todos()->create([
        'title' => ${formData.get('title')},
        'day' => \Carbon\Carbon::createFromFormat('Y-m-d', ${formData.get('date')}),
        'sort_order' => $maxSortOrder + 1,
    ]);
`;

// const addTodo = php`
//     $request = app(\App\Requests\Todo\StoreRequest::class);
//
//     $maxSortOrder = auth()->user()->todos()
//         ->where('day', '=', $request->date->format('Y-m-d'))
//         ->max('sort_order');
//
//     return auth()->user()->todos()->create([
//         'title' => $request->title,
//         'day' => $request->date,
//         'sort_order' => $maxSortOrder + 1,
//     ]);
// `

export function AddTodo({ date }) {
    return (
        <form action={addTodo}>
            <input type="hidden" name="date" value={date}/>
            <input type="text" name="title"/>
            <button type="submit">Add</button>
        </form>
    );
}
