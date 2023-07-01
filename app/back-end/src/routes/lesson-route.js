
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
			this.authCtrl.checkOptionalApi.bind(new AuthController()),
			this.lsnCtrl.checkLessonExisted.bind(new LessonController()),
			this.lsnCtrl.getLessonDetail.bind(new LessonController()))

		// get list lesson
		this.app.get(this.lessonUrl.list,
			this.authCtrl.checkToken.bind(new AuthController()),
			this.accCtrl.checkUser.bind(new AccountController()),
			this.lmtCtrl.checkLimitLevelTwo.bind(new LimitionController()),
			this.lsnCtrl.getListLesson.bind(new LessonController())
			)

		// add Lesson
		this.app.post(this.lessonUrl.create,
			this.authCtrl.checkToken.bind(new AuthController()),
			this.accCtrl.checkUser.bind(new AccountController()),
			this.lmtCtrl.checkLimitLevelZero.bind(new LimitionController()),
			this.lsnCtrl.addLesson.bind(new LessonController()))
		
		// add lesson to course
		this.app.post(this.lessonUrl.course,
			this.authCtrl.checkToken.bind(new AuthController()),
			this.accCtrl.checkUser.bind(new AccountController()),
			this.lmtCtrl.checkLimitLevelZero.bind(new LimitionController()),
			this.crsCtrl.checkCourseExisted.bind(new CourseController()),
			this.lsnCtrl.checkLessonExisted.bind(new LessonController()),
			this.lsnCtrl.addLessonToCourse.bind(new LessonController()))
		
		// delete lesson from course
		this.app.delete(this.lessonUrl.course,
			this.authCtrl.checkToken.bind(new AuthController()),
			this.accCtrl.checkUser.bind(new AccountController()),
			this.lmtCtrl.checkLimitLevelZero.bind(new LimitionController()),
			this.crsCtrl.checkCourseExisted.bind(new CourseController()),
			this.lsnCtrl.checkLessonExisted.bind(new LessonController()),
			this.lsnCtrl.deleteLessonFromCourse.bind(new LessonController()))

		// update lesson in course
		this.app.patch(this.lessonUrl.course,
			this.authCtrl.checkToken.bind(new AuthController()),
			this.accCtrl.checkUser.bind(new AccountController()),
			this.lmtCtrl.checkLimitLevelZero.bind(new LimitionController()),
			this.crsCtrl.checkCourseExisted.bind(new CourseController()),
			this.lsnCtrl.checkLessonExisted.bind(new LessonController()),
			this.lsnCtrl.updateLessonInCourse.bind(new LessonController()))

		// update list-lesson in course
		this.app.patch(this.lessonUrl.courseList,
			this.authCtrl.checkToken.bind(new AuthController()),
			this.accCtrl.checkUser.bind(new AccountController()),
			this.lmtCtrl.checkLimitLevelZero.bind(new LimitionController()),
			this.crsCtrl.checkCourseExisted.bind(new CourseController()),
			this.lsnCtrl.updateListLessonInCourse.bind(new LessonController()))

		// update lesson
		this.app.patch(this.lessonUrl.update,
			this.authCtrl.checkToken.bind(new AuthController()),
			this.accCtrl.checkUser.bind(new AccountController()),
			this.lmtCtrl.checkLimitLevelZero.bind(new LimitionController()),
			this.lsnCtrl.checkLessonExisted.bind(new LessonController()),
			this.lsnCtrl.updateLesson.bind(new LessonController()))
		
		// delete lesson
		this.app.delete(this.lessonUrl.update,
			this.authCtrl.checkToken.bind(new AuthController()),
			this.accCtrl.checkUser.bind(new AccountController()),
			this.lmtCtrl.checkLimitLevelZero.bind(new LimitionController()),
			this.lsnCtrl.checkLessonExisted.bind(new LessonController()),
			this.lsnCtrl.deleteLesson.bind(new LessonController()))
	} 
}


module.exports = LessonRoute;

