const moment = require('moment');

class DateTime {
    static now() {
        return moment().format('YYYY-MM-DD HH:mm:ss');
    }

    // get duration by minutes between 2 formated times
    static durationMinutes(currentTime, pastTime) {
        return moment.duration(moment(currentTime).diff(moment(pastTime))).asMinutes();
    }
}

module.exports = DateTime;