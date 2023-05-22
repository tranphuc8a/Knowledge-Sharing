
var AuthController = require('../controllers/auth-controller');
var LessonController = require('../controllers/lesson-controller');

let content = `121341543`;

class LessonRoute{
	constructor(app){
		this.app = app;
		this.authcontroller = new AuthController();
		this.lessonController = new LessonController();
	}

	async route(){
		this.app.get('/api/lesson/', 
			this.authcontroller.login,
			this.lessonController.getListLesson
		);
	} 
}


module.exports = LessonRoute;

