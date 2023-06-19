

class LoginScheduler {
    constructor(cron) {
        this.cron = cron;
        this.conn = global.schedulerConn
    }

    /*
    * * * * *
    | | | | |
    | | | | +---- Ngày trong tuần (0 - 7) (Chủ nhật = 0 hoặc 7)
    | | | +------ Tháng (1 - 12)
    | | +-------- Ngày trong tháng (1 - 31)
    | +---------- Giờ (0 - 23)
    +------------ Phút (0 - 59)
    */
    scheduler() {
        // scheduler at 11:11 everyday
        this.cron.schedule('11 11 * * *', () => {
            // delete records having expired refresh token (7 days)
            let query = `DELETE FROM login WHERE STR_TO_DATE(time, '%Y-%m-%d %H:%i:%s') < DATE_SUB(NOW(), INTERVAL 7 DAY);`;
            this.conn.query(query)
                .then(del => {
                    console.log('Scheduler cleaned login table successfully');
                })
                .catch(error => {
                    console.log(error);
                });
        }, {
            timezone: 'Asia/Ho_Chi_Minh' // Time zone VietNam
        });
    }
}

module.exports = LoginScheduler;