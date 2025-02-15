import {useEffect, useState} from "react";

export function Timer({timer_started_at, timer_elapsed}) {
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
