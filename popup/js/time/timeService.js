export default class TimeService {
    parseTime(timeStr) {
        const [dateStr, time] = timeStr.split(" ");
        const [year, month, day] = dateStr.split("-");
        const [hours, minutes] = time.split(":");
        return new Date(year, month - 1, day, hours, minutes);
    }

    convertTo24H(timeStr) {
        const [time, period] = timeStr.split(" ");
        let [hours, minutes] = time.split(":")

        hours = parseInt(hours);

        if (period == "PM" && hours != 12) {
            hours += 12;
        } else if (period == "AM" && hours == 12) {
            hours = 12;
        }

        if (hours < 10) {
            hours = "0" + hours;
        }

        return `${hours}:${minutes}`
    }

    convertTo12H(timeStr) {
        const splitTime = timeStr.split(":");
        let hours = parseInt(splitTime[0], 10);
        const minutes = parseInt(splitTime[1], 10);
        let period;

        if (hours < 12) {
            period = "AM";
        } else {
            period = "PM";
        }

        if (hours === 0) {
            hours = 12;
        } else if (hours > 12) {
            hours = hours - 12;
        }

        return minutes == "00" ? `${hours} ${period}` : `${hours}:${minutes.toString().padStart(2, "0")} ${period}`;
    }
}