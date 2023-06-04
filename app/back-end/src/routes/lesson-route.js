
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
			this.lsnCtrl.checkLessonExisted.bind(this.lsnCtrl),
			this.lsnCtrl.getLessonDetail.bind(this.lsnCtrl))

		// get list lesson
		this.app.get(this.lessonUrl.list,
			this.authCtrl.checkToken.bind(this.authCtrl),
			this.lsnCtrl.getListLesson.bind(this.lsnCtrl)
			)
	} 
}


module.exports = LessonRoute;

