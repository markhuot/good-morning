import React from 'react';

export function Checkbox({ id, completed, color, timer_started_at, completeTodo, checkedClassName }) {
    return (
        <span className="inline-block w-[20px] h-[20px] mr-2 relative" style={{"--color": color || '#155dfc'}}>
            <input type="checkbox" checked={completed} className="peer hidden" onChange={() => completeTodo(id)}/>
            <span className={`absolute w-[calc(100%+6px)] h-[calc(100%+6px)] -mt-[3px] -ml-[3px] rounded overflow-hidden ${timer_started_at ? 'inline-block' : 'hidden'}`}>
                <span className="{{$todo->timer_started_at?'inline-block':'hidden'}} absolute w-[200%] h-[200%] -mt-[50%] -ml-[50%] rounded motion-safe:animate-[spin_3s_linear_infinite] bg-gradient-to-b from-transparent via-transparent via-50% to-50% to-[color-mix(in_srgb,_var(--color)_30%,_transparent)]"></span>
            </span>
            <span className="hidden peer-[:not(:checked)]:inline-block absolute top-0 left-0 w-full h-full rounded border-2 border-[var(--color)] bg-white"></span>
            <span className={`hidden peer-checked:inline-block absolute top-0 left-0 w-full h-full rounded border-2 border-[color-mix(in_srgb,_var(--color)_40%,_white)] bg-[color-mix(in_srgb,_var(--color)_10%,_white)] ${checkedClassName}`}>
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[color-mix(in_srgb,_var(--color)_80%,_white)] font-bold">&#x2713;</span>
            </span>
        </span>
    );
}
