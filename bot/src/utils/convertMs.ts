export default function (s: number, shrink = true) {
    let ms = s % 1000;
    s = (s - ms) / 1000;
    let secs = s % 60;
    s = (s - secs) / 60;
    let mins = s % 60;
    let hrs = (s - mins) / 60;

    if (shrink) {
        if (hrs > 0) {
            if (mins == 0) {
                return `${hrs}h`;
            } else {
                return `${hrs}h ${mins}m`;
            }
        } else if (mins > 0) {
            if (secs == 0) {
                return `${mins}m`;
            } else {
                return `${mins}m`;
            }
        } else {
            if (secs == 0) {
                return `${Math.round((ms / 1000) * 10) / 10}s`;
            } else {
                return `${secs}s`;
            }
        }
    } else {
        if (hrs > 0) {
            if (mins == 0) {
                return `${hrs}hr`;
            } else {
                return `${hrs}hr ${mins}min`;
            }
        } else if (mins > 0) {
            if (secs == 0) {
                return `${mins}min`;
            } else {
                return `${mins}min ${secs}sec`;
            }
        } else {
            if (secs == 0) {
                return `${Math.ceil((ms / 1000) * 10) / 10}sec`;
            } else {
                return `${secs}sec`;
            }
        }
    }
}