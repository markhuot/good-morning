<template>
    <form action="addTodo">
        <input type="hidden" name="date" value={date}/>
        <input type="text" name="title"/>
        <button type="submit">Add</button>
    </form>
</template>

<script setup>
    const addTodo = php`
        $request = app(StoreRequest::class);

        $maxSortOrder = auth()->user()->todos()
            ->where('day', '=', $request->date->format('Y-m-d'))
            ->max('sort_order');

        auth()->user()->todos()->create([
            'title' => $request->title,
            'day' => $request->date,
            'sort_order' => $maxSortOrder + 1,
        ]);
    `
</script>
