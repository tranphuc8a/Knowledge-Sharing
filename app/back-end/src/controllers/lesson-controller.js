
const { promises } = require('nodemailer/lib/xoauth2');
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
	async updateInforListLesson(lessons){
		promises = [];
		lessons.forEach(lesson => {	
			// calculate ismark, nummark, numcmt

			// calculate categories:
			promises.push(async function(){
				lesson.categories = await CategoriesDAO.getInstance().getCategories(lesson.knowledge_id);
			});
		});
		await Promise.all(promises);
	}
	// async updateVisibleForListLesson(account, lessons){
	// 	promises = [];
	// 	lessons.forEach
	// }

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
		if (lesson.owner_email == account.email) return true; // owner of lesson
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
	// get api/lesson/detail/:lessonid/:courseid*
	// headers: token*
	async getLessonDetail(req, res, next){
		let { lesson } = req;
		let { courseid } = req.params;
		let { token } = req.headers;
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

	// get api/lesson/list?email*=email&courseid*=courseid
	/* headers: token
		body:
			offset* = 0
			length* = 10
	 */
	async getListLesson(req, res, next){
		let { account } = req;
		let pagination = req.body;
		let {email, courseid} = req.params;
		if (!pagination.offset || !pagination.lengh) pagination = null;

		if (email && courseid){
			return Response.response(res, Response.ResponseCode.BAD_REQUEST, "Params are not invalid");
		}
		if (!email && !courseid) { // get list lesson of myself
			let lessons = await LessonDAO.getInstance().select({
				owner_email: account.email
			}, null, pagination);
			await this.updateInforListLesson(lessons);
			return Response.response(res, Response.ResponseCode.OK, "Success", lessons);
		} 
		if (email){ // get list lesson of useremail
			let owner = await AccountDAO.getInstance().getById(email);
			if (!owner) return Response.response(res, Response.ResponseCode.BAD_REQUEST, "Email is not existed");
			let lessons = await LessonDAO.getInstance().select({
				owner_email: email
			}, null, pagination);
			await this.updateInforListLesson(lessons);
			// update visible:
			let isFollow = await this.accCtrl.checkAccountFollowAccount(account, owner);	
			lessons = lessons.filter(lesson=>{
				if (lesson.visible == 2) return true;		// public
				if (lesson.visible == 1) return isFollow;	// default
				return false;								// private
			})
			lessons.forEach(lesson=>{
				lesson.visible = null;
			});
			return Response.response(res, Response.ResponseCode.OK, "Success", lessons);
		} 
		if (courseid){ // get list lesson of courseid (only owner and register)
			let course = await CoursesDAO.getInstance().getById(courseid);
			if (!course) return Response.response(res, Response.ResponseCode.BAD_REQUEST, "Course is not existed");
			let isLessonInCourse = this.crsCtrl.checkAccountInCourse(account, course);
			if (!isLessonInCourse) return Response.response(res, Response.ResponseCode.BAD_REQUEST, "You need registered");
			let lessons = await LessonDAO.getInstance().select({
				courses_id: courseid
			}, null, pagination);
			await this.updateInforListLesson(lessons);
			lessons.forEach(lesson => {
				lesson.visible = null;
			});
			return Response.response(res, Response.ResponseCode.OK, "Successs", lessons);
		}
		return Response.response(res, Response.ResponseCode.BAD_REQUEST, "Params are not invalid");
	}
}


module.exports = LessonController;