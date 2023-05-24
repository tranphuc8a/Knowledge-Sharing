
var AuthController = require('../controllers/auth-controller');
var LessonController = require('../controllers/lesson-controller');
var ApiUrl = require('../configs/api-url-config');

class LessonRoute{
	constructor(app){
		this.app = app;
		this.authCtrl = new AuthController();
		this.lsnCtrl = new LessonController();
		this.lessonUrl = ApiUrl.lesson;
	}

	async route(){
		// get lesson detail
		this.app.get(this.lessonUrl.detail,
			this.lsnCtrl.checkLessonExisted,
			this.lsnCtrl.getLessonDetail)

		// get list lesson
		this.app.get(this.lessonUrl.list,
			this.authCtrl.checkToken,
			this.lsnCtrl.getListLesson
			)
	} 
}


module.exports = LessonRoute;

