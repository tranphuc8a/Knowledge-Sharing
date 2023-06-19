
var AuthController = require('../controllers/auth-controller');
var LessonController = require('../controllers/lesson-controller');
var ApiUrl = require('../configs/api-url-config');
const AccountController = require('../controllers/account-controller');
const LimitionController = require('../controllers/limition-controller');
const CourseController = require('../controllers/course-controller');

class LessonRoute{
	constructor(app){
		this.app = app;
		this.authCtrl = new AuthController();
		this.lsnCtrl = new LessonController();
		this.lessonUrl = ApiUrl.lesson;
		this.accCtrl = new AccountController();
		this.lmtCtrl = new LimitionController();
		this.crsCtrl = new CourseController();
	}

	async route(){
		// get lesson detail
		this.app.get(this.lessonUrl.detail,
			this.authCtrl.checkOptionalApi.bind(this.authCtrl),
			this.lsnCtrl.checkLessonExisted.bind(this.lsnCtrl),
			this.lsnCtrl.getLessonDetail.bind(this.lsnCtrl))

		// get list lesson
		this.app.get(this.lessonUrl.list,
			this.authCtrl.checkToken.bind(this.authCtrl),
			this.accCtrl.checkUser.bind(this.accCtrl),
			this.lmtCtrl.checkLimitLevelTwo.bind(this.lmtCtrl),
			this.lsnCtrl.getListLesson.bind(this.lsnCtrl)
			)

		// add Lesson
		this.app.post(this.lessonUrl.create,
			this.authCtrl.checkToken.bind(this.authCtrl),
			this.accCtrl.checkUser.bind(this.accCtrl),
			this.lmtCtrl.checkLimitLevelZero.bind(this.lmtCtrl),
			this.lsnCtrl.addLesson.bind(this.lsnCtrl))
		
		// add lesson to course
		this.app.post(this.lessonUrl.course,
			this.authCtrl.checkToken.bind(this.authCtrl),
			this.accCtrl.checkUser.bind(this.accCtrl),
			this.lmtCtrl.checkLimitLevelZero.bind(this.lmtCtrl),
			this.crsCtrl.checkCourseExisted.bind(this.crsCtrl),
			this.lsnCtrl.checkLessonExisted.bind(this.lsnCtrl),
			this.lsnCtrl.addLessonToCourse.bind(this.lsnCtrl))
		
		// delete lesson from course
		this.app.delete(this.lessonUrl.course,
			this.authCtrl.checkToken.bind(this.authCtrl),
			this.accCtrl.checkUser.bind(this.accCtrl),
			this.lmtCtrl.checkLimitLevelZero.bind(this.lmtCtrl),
			this.crsCtrl.checkCourseExisted.bind(this.crsCtrl),
			this.lsnCtrl.checkLessonExisted.bind(this.lsnCtrl),
			this.lsnCtrl.deleteLessonFromCourse.bind(this.lsnCtrl))

		// update lesson in course
		this.app.patch(this.lessonUrl.course,
			this.authCtrl.checkToken.bind(this.authCtrl),
			this.accCtrl.checkUser.bind(this.accCtrl),
			this.lmtCtrl.checkLimitLevelZero.bind(this.lmtCtrl),
			this.crsCtrl.checkCourseExisted.bind(this.crsCtrl),
			this.lsnCtrl.checkLessonExisted.bind(this.lsnCtrl),
			this.lsnCtrl.updateLessonInCourse.bind(this.lsnCtrl))

		// update lesson
		this.app.patch(this.lessonUrl.update,
			this.authCtrl.checkToken.bind(this.authCtrl),
			this.accCtrl.checkUser.bind(this.accCtrl),
			this.lmtCtrl.checkLimitLevelZero.bind(this.lmtCtrl),
			this.lsnCtrl.checkLessonExisted.bind(this.lsnCtrl),
			this.lsnCtrl.updateLesson.bind(this.lsnCtrl))
		
		// delete lesson
		this.app.delete(this.lessonUrl.update,
			this.authCtrl.checkToken.bind(this.authCtrl),
			this.accCtrl.checkUser.bind(this.accCtrl),
			this.lmtCtrl.checkLimitLevelZero.bind(this.lmtCtrl),
			this.lsnCtrl.checkLessonExisted.bind(this.lsnCtrl),
			this.lsnCtrl.deleteLesson.bind(this.lsnCtrl))
	} 
}


module.exports = LessonRoute;

