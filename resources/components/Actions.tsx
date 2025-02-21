import React from "react";
import {Timer} from "./Timer";
import {compose, php} from "../js/php"


// export const completeTodo = (todo) => php`
//     bind: \App\Models\Todo $todo
//     authorize: ['update', $todo]
//     ---
//     $todo = \App\Models\Todo::findOrFail(${todo});
//     auth()->user()->can('update', $todo);
//     Gate::authorize('update', $todo);

//     $todo->completed = !$todo->completed;
//     $todo->save();
// `({
//     bind:{todo},
//     middleware: 'can:update,todo',
//     authorize: ['update', todo],
//     call: `fn (\App\Models\Todo $todo) => $todo`,
// });


// export const completeTodo = (todo) => php`
//     return function (\App\Models\Todo $todo) {
//         $todo->completed = !$todo->completed;
//         $todo->save();
//     }
// `({
//     bind: {todo},
//     middleware: 'can:update,todo',
// });


const before = (todo) => php`
    use \App\Models\Todo;
    $todo = Todo::findOrFail(${todo});
    Gate::authorize('update', $todo);
`

// export const test1 = (todo) => compose(before(todo), php`$todo->delete();`);
// export const test2 = (todo) => before(todo, php`$todo->delete();`);
// export const test3 = (todo) => php(before, todo).exec`$todo->delete();`;
// export const test4 = (todo) => before(todo)`$todo->delete();`;
// export const test5 = (todo) => php`${before(todo)} $todo->delete();`;
// export const test6 = before`$todo->delete();`;
// export const test7 = (todo) => before(todo) + php`$todo->delete();`;
// export const test8 = (todo) => [before(todo), php`$todo->delete();`];

/**
 * `compose(...codes)` shouldn't do anything on compilation. Instead it should
 * trigger a single HTTP request with _two_ hashes to be run.
 * 
 * On the PHP side the two hashes should call `require ${hash}.php` with the
 * appropriate variables filled in before the require statement. In pseudo code
 * it would look like,
 * 
 * function handle($params) {
 *   $variable0 = $params[0];
 *   $variable1 = $params[1];
 *   unset($params);
 *   foreach ($hashes as $hash) {
 *     require "{$hash}.php";
 *   }
 * }
 */
export const completeTodo = (todo) => compose(before(todo), php`
    $todo->completed = !$todo->completed;
    $todo->save();
`);

export const deleteTodo = (todo) => {
    if (! confirm('Are you sure you want to delete this todo?')) {
        return;
    }

    php`$todo->delete();`;
}

export const deferTodo = (todoId) => php`
    $todo->day = $todo->day->addDay();
    $todo->save();
`;

export const toggleTimer = (todoId) => php`
    $todo->toggleTimer();
    $todo->save();
`;

export function Actions({todo}) {
    return <div className="group inline-block -mt-2 -ml-4 hover:absolute hover:bg-white hover:z-50 hover:w-48 hover:shadow-md rounded-lg hover:overflow-hidden">
        <ul>
            <li className="">
                <label className="pl-4 pt-2 group-hover:pb-2 group-hover:pr-4 cursor-pointer inline-block w-full hover:bg-slate-50">
                    <span className="inline-block w-[20px] h-[20px] mr-2 relative">
                        <input type="checkbox" checked={todo.completed} className="peer hidden" onChange={() => completeTodo(todo.id)}/>
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
                <form action={() => deferTodo(todo.id)}>
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
