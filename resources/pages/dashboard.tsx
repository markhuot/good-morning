import { closestCenter, DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { router } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';

function php(strings, ...values) {
    return router.post('/handler', {
        hash: strings[0],
        params: values,
    });
}

const addTodo = (formData) => php`
    //$request = app(\App\Requests\Todo\StoreRequest::class);

    $maxSortOrder = auth()->user()->todos()
        ->where('day', '=', ${formData.get('date')})
        ->max('sort_order');

    return auth()->user()->todos()->create([
        'title' => ${formData.get('title')},
        'day' => \Carbon\Carbon::createFromFormat('Y-m-d', ${formData.get('date')}),
        'sort_order' => $maxSortOrder + 1,
    ]);
`;

const deleteTodo = (todoId) => {
    if (! confirm('Are you sure you want to delete this todo?')) {
        return;
    }

    php`
        \App\Models\Todo::where('id', '=', ${todoId})->firstOrFail()->delete();
    `
}

export default function Dashboard({ date, todos, notes }) {
    // function addTodo(formData) {
    //     router.post('/todos', formData);
    // }

    function updateNotes(event) {
        router.post('/notes', { date, contents: event.target.value });
    }

    function reorderTodos(event) {
        const ids = todos.map(todo => todo.id);
        const oldIndex = ids.indexOf(event.active.id);
        const newIndex = ids.indexOf(event.over.id);
        const newOrder = arrayMove(ids, oldIndex, newIndex);

        router.post('/todos/reorder', { orderedIds: newOrder });
    }

    const sensors = useSensors(
        useSensor(PointerSensor),
    )

    return <div className="mt-[clamp(0px,calc((100vw-1100px)/2),100px)] min-h-screen md:min-h-0 mx-auto max-w-[1100px] bg-white border border-slate-100 border-b-2 border-b-blue-300 rounded-lg overflow-hidden shadow-lg space-y-8 flex items-stretch">
        <div className="flex flex-col md:flex-row flex-grow">
            <div className="md:w-1/2 pb-12">
                <h1><DateControls date={date}/></h1>
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={reorderTodos}>
                    <SortableContext items={todos.map(todo => todo.id)} strategy={verticalListSortingStrategy}>
                        <ul className="mt-6">
                            {todos.map(todo => <Todo key={todo.id} {...todo}/>)}
                        </ul>
                    </SortableContext>
                </DndContext>
                <form action={addTodo}>
                    <input type="hidden" name="date" value={date}/>
                    <input type="text" name="title"/>
                    <button type="submit">Add</button>
                </form>
            </div>
            <div className="md:w-1/2 bg-slate-50 relative flex-grow min-h-[50vh]">
                <textarea className="w-full h-full py-14 px-10 bg-transparent peer resize-none" placeholder=" " onInput={updateNotes}>{notes?.contents}</textarea>
                <p className="hidden peer-placeholder-shown:block pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-300">If you fail to plan, you plan to fail</p>
            </div>
        </div>
    </div>;
}

function Todo(todo) {
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


    return <li ref={setNodeRef} style={style} {...attributes} className="py-2 px-10 focus:bg-blue-100 focus:outline-none">
        <span className="text-slate-200 hover:text-slate-500 relative -left-[1em]" {...listeners}>&#x28ff;</span>
        <Actions todo={todo}/>
        {todo.title} ({todo.id})
    </li>
}

function Actions({todo}) {
    function toggleTimer() {
        router.post('/todos/' + todo.id + '/timers/' + (todo.timer_started_at ? 'stop' : 'start'));
    }

    // function deleteTodo() {
    //     if (! confirm('Are you sure you want to delete this todo?')) {
    //         return;
    //     }
    //     router.post('/todos/' + todo.id, {_method: 'delete'});
    // }

    function deferTodo() {
        const day = todo.day.replace(/\T.+$/, '');
        const tomorrow = new Date(day+'T00:00:00');
        tomorrow.setDate(tomorrow.getDate() + 1);
        router.post('/todos/' + todo.id, {_method: 'put', day: tomorrow.toISOString().replace(/\T.+$/, '')});
    }

    function changeTodo() {
        router.post('/todos/' + todo.id, {_method: 'put', completed: !todo.completed});
    }

    return <div className="group inline-block -mt-2 -ml-4 hover:absolute hover:bg-white hover:z-50 hover:w-48 hover:shadow-md rounded-lg hover:overflow-hidden">
        <ul>
            <li className="">
                <label className="pl-4 pt-2 group-hover:pb-2 group-hover:pr-4 cursor-pointer inline-block w-full hover:bg-slate-50">
                    <span className="inline-block w-[20px] h-[20px] mr-2 relative">
                        <input type="checkbox" checked={todo.completed} className="peer hidden" onChange={changeTodo}/>
                        <span className={`absolute w-[calc(100%+6px)] h-[calc(100%+6px)] -mt-[3px] -ml-[3px] rounded overflow-hidden ${todo.timer_started_at ? 'inline-block' : 'hidden'}`}>
                            <span className="{{$todo->timer_started_at?'inline-block':'hidden'}} absolute w-[200%] h-[200%] -mt-[50%] -ml-[50%] rounded motion-safe:animate-[spin_3s_linear_infinite] bg-gradient-to-b from-transparent via-transparent via-50% to-50% to-blue-200"></span>
                        </span>
                        <span className="hidden peer-[:not(:checked)]:inline-block absolute top-0 left-0 w-full h-full rounded border-2 border-blue-300 bg-white"></span>
                        <span className="hidden peer-checked:inline-block absolute top-0 left-0 w-full h-full rounded border-2 border-blue-500 bg-blue-300">
                            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-700 font-bold">&#x2713;</span>
                        </span>
                    </span>
                    <span className="hidden group-hover:inline">
                        Complete
                    </span>
                </label>
            </li>
            <li className="hidden group-hover:block">
                <form action={toggleTimer}>
                    <button className="w-full text-left px-4 py-2 hover:bg-slate-50 flex justify-between">
                        <span>
                            {todo.timer_started_at ? (
                                <><span className="inline-block text-center w-[20px]">&#x23f8;&#xfe0e;</span> Pause</>
                            ) : (
                                <><span className="inline-block text-center w-[20px]">&#x25B6;</span> Start</>
                            )}
                        </span>
                        <span className="text-slate-400"><Timer {...todo}/></span>
                    </button>
                </form>
            </li>
            <li className="hidden group-hover:block">
                <form action={deferTodo}>
                    <button className="w-full text-left px-4 py-2 hover:bg-slate-50">
                        <span className="inline-block text-center w-[20px]">&rarr;</span>
                        Defer
                    </button>
                </form>
            </li>
            <li className="hidden group-hover:block"><hr/></li>
            <li className="hidden group-hover:block">
                <form action={() => deleteTodo(todo.id)}>
                    <button className="w-full text-left text-red-500 px-4 py-2 hover:bg-red-50">
                        <span className="inline-block text-center w-[20px]">&#8998;</span>
                        Delete&hellip;
                    </button>
                </form>
            </li>
        </ul>
    </div>;
}

function Timer({timer_started_at, timer_elapsed}) {
    function calculateTotalTime() {
        const runningTime = timer_started_at ? (new Date().getTime() - new Date(timer_started_at).getTime())/1000 : 0;
        return timer_elapsed + runningTime;
    }

    function formatTotalTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor(seconds / 60) % 60;
        const remainingSeconds = Math.floor(seconds % 60);
        return [
            hours ? `${hours}h` : '',
            minutes ? `${minutes}m` : '',
            minutes === 0 ? `${remainingSeconds}s` : '',
        ].join(' ');
    }

    const [totalTime, setTotalTime] = useState(calculateTotalTime());

    useEffect(() => {
        if (timer_started_at) {
            const interval = setInterval(() => {
                setTotalTime(calculateTotalTime());
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [timer_started_at]);

    return totalTime > 0 ? formatTotalTime(totalTime) : '';
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

    return <div className="flex gap-4 px-10 pt-12 text-lg">
        <a className="group hover:text-slate-950" href="/">
            <strong className="text-slate-950 font-bold mr-1 group-hover:underline">{weekday}</strong>
            <span className="text-slate-400">{dayMonth}</span>
        </a>
        <div>
            <a className="text-slate-400 hover:text-black hover:bg-slate-100 rounded inline-block px-2" href={`?date=${yesterday.toISOString().replace(/\T.+$/, '')}`}>&larr;</a>
            <a className="text-slate-400 hover:text-black hover:bg-slate-100 rounded inline-block px-2" href={`?date=${tomorrow.toISOString().replace(/\T.+$/, '')}`}>&rarr;</a>
        </div>
    </div>
}
