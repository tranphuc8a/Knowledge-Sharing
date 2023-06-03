const moment = require('moment');

class DateTime{
    static now(){
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
}

module.exports = DateTime;