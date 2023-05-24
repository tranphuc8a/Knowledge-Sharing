const moment = require('moment');

class DateTime{
    static now(){
        return moment().format('YYYY-MM-DD HH:mm:ss');
    }
}

module.exports = DateTime;