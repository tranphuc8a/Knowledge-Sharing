
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
		if (lessons == null) return;
		let promises = [];
		lessons.forEach(lesson => {	
			// calculate ismark, nummark, numcmt

			// calculate categories:
			promises.push(async function(){
				lesson.categories = await CategoriesDAO.getInstance().getCategories(lesson.knowledge_id);
			});
		});
		await Promise.all(promises.map(f => f()));
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

	async checkAccessible(account, lesson){
		if (lesson == null) return false;
		if (lesson.visible == 2) return true;  // public
		if (account == null) return false;
		if (lesson.owner_email == account.email) return true; // owner of lesson
		let owner = await AccountDAO.getInstance().getById(lesson.owner_email);
		if (lesson.visible == 1){ // default
			// check follow:
			let isFollowing = await this.accCtrl.checkAccountFollowAccount(account, owner);
			if (isFollowing) return true;

			// check register in same courses
			let csls = await CoursesLessonDAO.getInstance().getByAccountLesson(account.email, lesson.knowledge_id);
			return csls && (csls.length > 0);
		}
		if (lesson.visible == 0){ // private
			// check register in same courses
			let csls = await CoursesLessonDAO.getInstance().getByAccountLesson(account.email, lesson.knowledge_id);
			return csls && (csls.length > 0);
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
	// get api/lesson/detail/:lessonid
	// headers: token*
	async getLessonDetail(req, res, next){
		let { lesson } = req;
		let token = req.headers.authorization;
		let account = await this.accCtrl.getAccountFromToken(token);

		// check visible
		let isVisible = await this.checkAccessible(account, lesson);
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
		let {email, courseid} = req.query;
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
				if (lesson.owner_email == account.email) return true; // owner
				if (lesson.visible == 2) return true;		// public
				if (lesson.visible == 1) return isFollow;	// default
				return false;								// private
			})
			if (account.email != owner.email)
				lessons.forEach(lesson => {
					lesson.visible = null;
				});
			return Response.response(res, Response.ResponseCode.OK, "Success", lessons);
		} 
		if (courseid){ // get list lesson of courseid (only owner and register)
			let course = await CoursesDAO.getInstance().getById(courseid);
			if (!course) return Response.response(res, Response.ResponseCode.BAD_REQUEST, "Course is not existed");
			let isLessonInCourse = await this.crsCtrl.checkAccountInCourse(account, course);
			if (!isLessonInCourse && account.email != course.owner_email) 
				return Response.response(res, Response.ResponseCode.BAD_REQUEST, "You need registered");
			let lessons = await LessonDAO.getInstance().selectDetail({
				courses_id: courseid
			}, ["lesson.*, knowledge.*"], pagination);
			await this.updateInforListLesson(lessons);
			if (account.email != course.owner_email)
				lessons.forEach(lesson => {
					lesson.visible = null;
				});
			return Response.response(res, Response.ResponseCode.OK, "Success", lessons);
		}
		return Response.response(res, Response.ResponseCode.BAD_REQUEST, "Params are not invalid");
	}
}


module.exports = LessonController;