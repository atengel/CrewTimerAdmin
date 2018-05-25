export default class TimeUtil {
    static get2digitString(i) {
        let s = String(i);
        if (s.length < 2) s = '0' + s;
        return s;
    }


    static get3digitString(i) {
        let s = String(i);
        while (s.length < 3) s = '0' + s;
        return s;
    }

    /**
     * Convert a time formatted as [[HH:]MM:]SS.MMM] to milliseconds.
     * 
     * The algorithm starts from the right and multiplies the first set of
     * numbers by 1000, the 2nd set from right by 60000 and the the third by
     * 3600000. Any of the fields can be missing on the left.
     * 
     * @param time
     * @return
     */
    static timeToMilli(/*String*/ time) {
        let sign = 1;
        time = time.trim();
        if (time.startsWith('-')) {
            sign = -1;
            time = time.substring(1);
        }
        if (time == null || time.length === 0) return 0;
        let times = time.split(':');
        let factor = 1000;
        let v = 0.0;
        for (let i = times.length - 1; i >= 0; i--) {
            try {
                v = v + factor * Number.parseFloat(times[i]);
            } catch (e) {
                console.log("Bad time format: '" + time + "'");
            }
            factor = factor * 60;
        }
        return Math.trunc(v * sign);
    }

    static milliToString(elapsed, includeHours = true) {
        let negative = elapsed < 0;
        if (negative) elapsed = -elapsed;
        let h = Math.trunc(elapsed / (60000 * 60));
        elapsed = elapsed - 60000 * 60 * h;
        let m = Math.trunc(elapsed / 60000);
        elapsed = elapsed - 60000 * m;
        let s = Math.trunc(elapsed / 1000);
        elapsed = elapsed - 1000 * s;
        let frac = elapsed;

        // Otter Island has times greater than 60 minutes
        let result =
            TimeUtil.get2digitString(m) + ':' +  TimeUtil.get2digitString(s) + '.' +  TimeUtil.get3digitString(frac);
        if (includeHours) result =  TimeUtil.get2digitString(h) + ':' + result;
        if (negative) result = '-' + result;
        return result;
    }

    static timeDiff(time1, time2, includeHours = true) {
        if (!time1 || !time2) return '';
        const t1 = TimeUtil.timeToMilli(time1);
        const t2 = TimeUtil.timeToMilli(time2);
        const delta = t2-t1;
        const s = TimeUtil.milliToString(delta,includeHours);
        return s;
    }

    static timeAdd(time1, time2, includeHours = true) {
        if (!time1 || !time2) return time1;
        const t1 = TimeUtil.timeToMilli(time1);
        const t2 = TimeUtil.timeToMilli(time2);
        const delta = t2+t1;
        const s = TimeUtil.milliToString(delta,includeHours);
        return s;
    }
};