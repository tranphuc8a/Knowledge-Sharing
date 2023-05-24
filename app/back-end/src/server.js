//import
const express = require('express')
const serverConfig = require('./configs/server-config')
const Route = require('./routes/route')
const mysql = require('mysql2/promise')
const dbConfig = require('./configs/db-config')
const bodyParser = require('body-parser');

//create express app
const app = express()

//body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


//route
const route = new Route(app);
route.route();

//connect db
global.connection
var connectDB = async () => {
    try {
        global.connection = await mysql.createConnection(dbConfig.localhost);
        await global.connection.ping();
        console.log('connect to freaking db successfully');
    } catch (e) {
        console.log(e);
    }
};
connectDB();


//run app
app.listen(serverConfig.port, () => {
    console.log('server is listening on port ' + serverConfig.port);
    app.get('/home', (req, res, next) => {
        res.send('hello');
    });
})




