import { closestCenter, DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {Link, router} from '@inertiajs/react';
import React, {PropsWithChildren, useEffect, useState} from 'react';
import {AddTodo} from "../components/AddTodo";
import {Todo} from "../components/Todo";
import {completeTodo, deferTodo, deleteTodo, toggleTimer} from "../components/Actions";

async function php(strings, ...values) {
    return router.post('/handler', {
        hash: strings[0],
        params: values,
    });
}

export const reorderTodos = (orderedIds) => {
    php`
        $todos = \App\Models\Todo::query()
            ->whereIn('id', ${orderedIds})
            ->each(fn ($todo) => $todo->update([
                'sort_order' => array_search($todo->id, ${orderedIds})
            ]));
    `
}

export default function Dashboard({ date, todos, notes }) {
    function updateNotes(event) {
        router.post('/notes', { date, contents: event.target.value });
    }

    function handleDragEnd(event) {
        const ids = todos.map(todo => todo.id);
        const oldIndex = ids.indexOf(event.active.id);
        const newIndex = ids.indexOf(event.over.id);
        const newOrder = arrayMove(ids, oldIndex, newIndex);
        reorderTodos(newOrder);
    }

    function moveTodo(todoId, direction) {
        const ids = todos.map(todo => todo.id);
        const oldIndex = ids.indexOf(todoId);
        if ((oldIndex === 0 && direction === -1) ||
            (oldIndex === ids.length - 1 && direction === 1))
        {
            return;
        }
        const newOrder = arrayMove(ids, oldIndex, oldIndex + direction);
        reorderTodos(newOrder);
    }

    const sensors = useSensors(
        useSensor(PointerSensor),
    )

    return <div className="mt-[clamp(0px,calc((100vw-1100px)/2),100px)] min-h-screen md:min-h-0 mx-auto max-w-[1100px] bg-white border border-slate-100 border-b-2 border-b-blue-300 rounded-lg overflow-hidden shadow-lg space-y-8 flex items-stretch">
        <div className="flex flex-col md:flex-row flex-grow">
            <div className="md:w-1/2 pb-12">
                <h1><DateControls date={date}/></h1>
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={todos.map(todo => todo.id)} strategy={verticalListSortingStrategy}>
                        <ul className="mt-6">
                            {todos.map(todo => <Row key={todo.id} todo={todo} moveTodo={moveTodo}/>)}
                        </ul>
                    </SortableContext>
                </DndContext>
                <AddTodo date={date}/>
            </div>
            <div className="md:w-1/2 bg-slate-50 relative flex-grow min-h-[50vh]">
                <textarea className="w-full h-full py-14 px-10 bg-transparent peer resize-none" placeholder=" " onInput={updateNotes}>{notes?.contents}</textarea>
                <p className="hidden peer-placeholder-shown:block pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-300">If you fail to plan, you plan to fail</p>
            </div>
        </div>
    </div>;
}

function Row({ todo, moveTodo }: PropsWithChildren<{todo: any}>) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({id: todo.id});

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const handleKeyDown = event => {
        if (event.code === 'Space') {
            completeTodo(todo.id);
        }
        if (event.code === 'Backspace') {
            deleteTodo(todo.id);
        }
        if (event.code === 'ArrowRight') {
            deferTodo(todo.id);
        }
        if (event.code === 'ArrowUp') {
            moveTodo(todo.id, -1);
        }
        if (event.code === 'ArrowDown') {
            moveTodo(todo.id, 1);
        }
        if (event.code === 'F8') {
            toggleTimer(todo.id);
        }
    }

    return <li ref={setNodeRef} style={style} {...attributes} onKeyDown={handleKeyDown} className="py-2 px-10 focus:bg-blue-100 focus:outline-none">
        <span className="text-slate-200 hover:text-slate-500 relative -left-[1em]" {...listeners}>&#x28ff;</span>
        <Todo todo={todo}/>
    </li>
}

function DateControls({ date }) {
    const weekdayFormatter = new Intl.DateTimeFormat(undefined, { weekday: 'long' });
    const dayMonthFormatter = new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'short' });

    const weekday = weekdayFormatter.format(new Date(date+'T00:00:00'));
    const dayMonth = dayMonthFormatter.format(new Date(date+'T00:00:00'));

    const yesterday = new Date(date+'T00:00:00');
    yesterday.setDate(yesterday.getDate() - 1);

    const tomorrow = new Date(date+'T00:00:00');
    tomorrow.setDate(tomorrow.getDate() + 1);

    const handleKeyDown = event => {
        if (event.code === 'ArrowRight') {
            router.get(`?date=${tomorrow.toISOString().replace(/\T.+$/, '')}`);
        }
        if (event.code === 'ArrowLeft') {
            router.get(`?date=${yesterday.toISOString().replace(/\T.+$/, '')}`);
        }
    };

    return <div className="flex gap-4 px-10 pt-12 text-lg">
        <Link className="group hover:text-slate-950" href="/">
            <strong className="text-slate-950 font-bold mr-1 group-hover:underline">{weekday}</strong>
            <span className="text-slate-400">{dayMonth}</span>
        </Link>
        <div tabIndex="0" onKeyDown={handleKeyDown}>
            <Link className="text-slate-400 hover:text-black hover:bg-slate-100 rounded inline-block px-2" tabIndex="-1" href={`?date=${yesterday.toISOString().replace(/\T.+$/, '')}`}>&larr;</Link>
            <Link className="text-slate-400 hover:text-black hover:bg-slate-100 rounded inline-block px-2" tabIndex="-1" href={`?date=${tomorrow.toISOString().replace(/\T.+$/, '')}`}>&rarr;</Link>
        </div>
    </div>
}
