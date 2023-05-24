
const Follow = require('../models/follow');
const AccountDAO = require('../services/dao/account-dao');
const CategoriesDAO = require('../services/dao/categories-dao');
const CoursesDAO = require('../services/dao/courses-dao');
const CoursesLessonDAO = require('../services/dao/courses-lesson-dao');
const FollowDAO = require('../services/dao/follow-dao');
const LearnDAO = require('../services/dao/learn-dao');
const LessonDAO = require('../services/dao/lesson-dao');
const ProfileDAO = require('../services/dao/profile-dao');
var mailer = require('../services/email-service');
const Response = require('../utils/response');
const AccountController = require('./account-controller');
const CourseController = require('./course-controller');


class LessonController{
	constructor(){
		this.crsCtrl = new CourseController();
		this.accCtrl = new AccountController();
	}

	async checkLessonInCourse(lesson, course){
		if (lesson == null || course == null) return false;
		let csls = await CoursesLessonDAO.select({
			courses_id: course.knowledge_id,
			lesson_id: lesson.knowledge_id
		});
		return csls.lengh > 0;
	}
	
	async checkVisible(account, lesson, course){ // check account can access lesson
		if (lesson == null) return false;
		if (lesson.visible == 2) return true;  // public
		let owner = await AccountDAO.getById(lesson.owner_email);
		if (lesson.visible == 1){ // default
			// check follow:
			let isFollowing = await this.accCtrl.checkAccountFollowAccount(account, owner);
			if (isFollowing) return true;

			// check register in course
			let isAccountInCourse = await this.crsCtrl.checkAccountInCourse(account, course);
			let isLessonInCourse = await this.checkLessonInCourse(lesson, course);
			return isAccountInCourse && isLessonInCourse;
		}
		if (lesson.visible == 0){ // private
			// check register in course
			let isAccountInCourse = await this.crsCtrl.checkAccountInCourse(account, course);
			let isLessonInCourse = await this.checkLessonInCourse(lesson, course);
			return isAccountInCourse && isLessonInCourse;
		}
		return false;
	}
// middle-ware:
	async checkLessonExisted(req, res, next){
		let { lessonid } = req.params;
		let lesson = await LessonDAO.getInstance().getById(lessonid);
		if(lesson == null){
			return Response.response(res, Response.ResponseCode.INFO, "This lesson is not exist");
		}
		req.lesson = lesson;
		next();
	}
	
// end-ware
	// get api/lesson/detail/:lessonid/:courseid
	async getLessonDetail(req, res, next){
		let { lesson } = req;
		let { token, courseid } = req.params;
		let account = await this.accCtrl.getAccountFromToken(token);
		let course = courseid ? await CoursesDAO.getInstance().getById(courseid) : null;

		// check visible
		let isVisible = await this.checkVisible(account, lesson, course);
		if (!isVisible) return Response.response(res, Response.ResponseCode.BAD_REQUEST, "Can not visible");

		// can visible:
		// get owner
		let owner = await ProfileDAO.getInstance().getById(lesson.owner_email);
		lesson.owner = owner;

		// get score:

		// get numcmt:

		// check ismark:

		// get categories:
		lesson.categories = await CategoriesDAO.getInstance().getCategories(lesson.knowledge_id);


		return Response.response(res, Response.ResponseCode.OK, "Success", lesson);
	}
}


module.exports = LessonController;