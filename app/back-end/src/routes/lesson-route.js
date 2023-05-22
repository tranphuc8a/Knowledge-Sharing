
require AuthController = require('../controllers/auth-controller');

class LessonRoute{
	constructor(app){
		this.app = app;
		this.authcontroller = new AuthController();
	}

	async route(){
		this.app.get('/api/lesson/', this.authcontroller.login , function(req, res, next){
			res.send("call api lesson");
		});
	}
}


