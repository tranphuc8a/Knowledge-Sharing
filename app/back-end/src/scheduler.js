const cron = require('node-cron');
const mysql = require('mysql2/promise')
const dbConfig = require('./configs/db-config');
const CodeScheduler = require('./scheduler/code-scheduler');
const LoginScheduler = require('./scheduler/login-scheduler');

//connect db
global.schedulerConn
var connectDB = async () => {
    try {
        global.schedulerConn = await mysql.createConnection(dbConfig.localhost);
        await global.schedulerConn.ping();
        console.log('scheduler connect to db successfully');
    } catch (e) {
        console.log(e);
    }
};

async function runScheduler() {
    // connect to database
    await connectDB();

    // init schedulers
    var codeScheduler = new CodeScheduler(cron);
    var loginScheduler = new LoginScheduler(cron);

    // activate schedulers
    codeScheduler.scheduler();
    loginScheduler.scheduler();
}
runScheduler();


