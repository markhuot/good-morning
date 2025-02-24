import {useEffect, useState} from "react";

export function Timer({timer_started_at, timer_elapsed, estimate, timer_increment}) {
    function calculateTotalTime() {
        const runningTime = timer_started_at ? (new Date().getTime() - new Date(timer_started_at).getTime())/1000 : 0;

        // If the timer is counting up, return it
        if (timer_increment === 1) {
            //console.log(id, timer_increment, 'up');
            return timer_elapsed + runningTime;
        }

        // Otherwise calculate the remaining time (estimate is in minutes, so it must be converted to seconds)
        //console.log(id, timer_increment, 'down');
        return (estimate * 60) - (timer_elapsed + runningTime);
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
        let interval;

        if (timer_started_at) {
            interval = setInterval(() => {
                setTotalTime(calculateTotalTime());
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [timer_started_at, timer_increment]);

    return totalTime > 0 ? formatTotalTime(totalTime) : '';
}
