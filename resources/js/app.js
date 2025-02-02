import './bootstrap';
import Alpine from 'alpinejs'
import Sortable from 'sortablejs';
import {intervalToDuration, subSeconds} from "date-fns";

window.totalElapsedTime = (elapsedSeconds, timerStartedAt) => {
    const duration = intervalToDuration({
        start: subSeconds(timerStartedAt ? new Date(timerStartedAt): new Date(), elapsedSeconds),
        end: new Date(),
    })

    return [
        duration.hours ? `${duration.hours}h` : '',
        duration.minutes ? `${duration.minutes}m` : '',
        duration.seconds && ! duration.minutes ? `${duration.seconds}s` : '',
    ].filter(Boolean).join(' ');
};
window.Alpine = Alpine;
window.Sortable = Sortable;

Alpine.start();

