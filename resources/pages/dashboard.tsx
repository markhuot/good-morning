import { closestCenter, DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {Link, router} from '@inertiajs/react';
import React, {PropsWithChildren, useEffect, useRef, useState} from 'react';
import {AddTodo} from "../components/AddTodo";
import {Todo} from "../components/Todo";
import {completeTodo, deferTodo, deleteTodo, toggleTimer} from "../components/Actions";
import {DateControls} from "../components/DateControls";
import {php} from "@markhuot/synapse/php";

const reorderTodos = (orderedIds) => php`
    use \App\Models\Todo;

    $todos = Todo::query()
        ->whereIn('id', ${orderedIds})
        ->each(fn ($todo) => $todo->update([
            'sort_order' => array_search($todo->id, ${orderedIds})
        ]));
`.execute();

const updateNotes = (day, contents) => php`
    auth()->user()->notes()->upsert([
        'day' => ${day},
        'contents' => ${contents},
    ], [
        'user_id', 'day',
    ]);
`.execute();

export default function Dashboard({ date, todos, notes }) {
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
        useSensor(PointerSensor, {
            activationConstraint: {
                delay: 250,
                distance: 250,
            },
        }),
    )

    const handleShare = async () => {
        const clipboardItemData = {
            'text/html': 'Today,<br/><br/><ul>' + todos.map(todo => `<li>${todo.title}</li>`).join('') + '</ul>',
            'text/plain': "Today,\n\n" + todos.map(todo => `- ${todo.title}`).join("\n"),
        }
        const clipboardItem = new ClipboardItem(clipboardItemData);
        await navigator.clipboard.write([clipboardItem]);
    }

    return <div className="mt-[clamp(0px,calc((100vw-1100px)/2),100px)] min-h-screen md:min-h-0 mx-auto max-w-[1100px] bg-white border border-slate-100 border-b-2 border-b-blue-300 rounded-lg overflow-hidden shadow-lg space-y-8 flex items-stretch">
        <div className="flex flex-col md:flex-row flex-grow">
            <div className="md:w-1/2 pb-12">
                <h1 className="flex justify-between items-baseline pr-8">
                    <DateControls date={date}/>
                    <button className="text-slate-400 hover:text-black hover:bg-slate-100 rounded inline-block px-2" onClick={handleShare}>&#9099;</button>
                </h1>
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
                <textarea className="w-full h-full py-14 px-10 bg-transparent peer resize-none" placeholder=" " onInput={(event) => updateNotes(date, event.target.value)}>{notes?.contents}</textarea>
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
    const todoRef = useRef(null);

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const handleKeyDown = event => {
        if (event.code === 'Space') {
            event.preventDefault();
            completeTodo(todo.id);
        }
        if (event.code === 'Backspace') {
            event.preventDefault();
            deleteTodo(todo.id);
        }
        if (event.code === 'ArrowRight') {
            event.preventDefault();
            deferTodo(todo.id);
        }
        if (event.code === 'ArrowUp') {
            event.preventDefault();
            moveTodo(todo.id, -1);
        }
        if (event.code === 'ArrowDown') {
            event.preventDefault();
            moveTodo(todo.id, 1);
        }
        if (event.code === 'F8') {
            event.preventDefault();
            toggleTimer(todo.id);
        }
        if (event.code === 'Enter') {
            event.preventDefault();
            todoRef.current?.focus();
        }
    }

    return <li ref={setNodeRef} style={style} {...attributes} {...listeners} onKeyDown={handleKeyDown} className="py-2 px-10 focus-visible:bg-blue-100 focus-visible:outline-none [&:has([data-todo-title]:focus)]:bg-none [&:has([data-todo-title]:focus)]:ring-4 [&:has([data-todo-title]:focus)]:ring-blue-100 [&:has([data-todo-title]:focus)]:ring-inset">
        {/*<span {...listeners} className="text-slate-200 hover:text-slate-500 relative -left-[1em]" >&#x28ff;</span>*/}
        <Todo ref={todoRef} todo={todo}/>
    </li>
}
