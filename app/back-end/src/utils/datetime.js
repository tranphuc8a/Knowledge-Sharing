const moment = require('moment');

class DateTime {
    static now() {
        return moment().format('YYYY-MM-DD HH:mm:ss');
    }
    static timestringToTimestamp(timeString){
        const timestamp = moment(timeString).unix();
        return timestamp;
    }
    static timestampToTimestring(timestamp, format = 'YYYY-MM-DD HH:mm:ss'){
        const timeString = moment.unix(timestamp).format(format);
        return timeString;
    }
    // get duration by minutes between 2 formated times
    static durationMinutes(currentTime, pastTime) {
        return moment.duration(moment(currentTime).diff(moment(pastTime))).asMinutes();
    }
}

module.exports = DateTime;