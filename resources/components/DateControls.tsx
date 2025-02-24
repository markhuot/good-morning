import React from "react";
import {Link, router} from "@inertiajs/react";

export function DateControls({ date }) {
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

    return <div className="flex items-start gap-4 px-10 pt-12">
        <Link className="group hover:text-slate-950 leading-none" href="/">
            <strong className="text-slate-950 font-bold mr-1 group-hover:underline block text-2xl -mb-1">{weekday}</strong>
            <span className="text-slate-400 text-sm">{dayMonth}</span>
        </Link>
        <div className="h-[2rem] flex items-center" tabIndex="0" onKeyDown={handleKeyDown}>
            <Link className="text-slate-400 hover:text-black hover:bg-slate-100 rounded inline-block px-2" tabIndex="-1" href={`?date=${yesterday.toISOString().replace(/\T.+$/, '')}`}>&larr;</Link>
            <Link className="text-slate-400 hover:text-black hover:bg-slate-100 rounded inline-block px-2" tabIndex="-1" href={`?date=${tomorrow.toISOString().replace(/\T.+$/, '')}`}>&rarr;</Link>
        </div>
    </div>
}
