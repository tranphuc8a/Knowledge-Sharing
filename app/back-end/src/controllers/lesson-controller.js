
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
const BaseController = require('./base-controller');
const MarkDAO = require('../services/dao/mark-dao');


class LessonController extends BaseController{
	constructor(){
		super();
		this.crsCtrl = new CourseController();
		this.accCtrl = new AccountController();
	}
	async updateInforListLesson(account, lessons){
		if (lessons == null) return;
		let promises = [];
		lessons.forEach(lesson => {	
			// calculate categories:
			promises.push(async function(){
				lesson.categories = await CategoriesDAO.getInstance().getCategories(lesson.knowledge_id);
			});
		});
		await Promise.all(promises.map(f => f()));

		// update isMark
		if (account == null) return;
		let marks = await MarkDAO.getInstance().select({
			email: account.email
		});
		if (!marks) return;
		lessons.forEach(lesson=>{
			lesson.isMark = 0;
			if (marks.find(mark => mark.knowledge_id == lesson.knowledge_id) != null)
				lesson.isMark = 1;
		})
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
	
	async getListLessonOfMyself(account){
		let lessons = await LessonDAO.getInstance().selectDetail({
			owner_email: account.email
		}, null, this.pagination);
		if (lessons == null) return this.serverError();
		await this.updateInforListLesson(account, lessons);
		return this.success("Success", lessons);
	}

	async getListLessonOfUser(account, user){
		if (account.email == user.email) return await this.getListLessonOfMyself(account);
		
		let lessons = await LessonDAO.getInstance().selectDetail({
			owner_email: user.email
		}, null, this.pagination);
		if (lessons == null) return this.serverError();
		
		// update infor for list Lesson:
		await this.updateInforListLesson(account, lessons);
		// update visible:
		let isFollow = await this.accCtrl.checkAccountFollowAccount(account, user);	
		lessons = lessons.filter(lesson=>{
			if (lesson.visible == 2) return true;		// public, always true
			if (lesson.visible == 1) return isFollow;	// default, for following
			return false;								// private, always false
		});
		lessons.forEach(lesson => lesson.visible = null);				
		return this.success("Success", lessons);
	}

	async getListLessonOfCourse(account, course){
		// anybody can see list lesson of course
		// let isAccountInCourse = await this.crsCtrl.checkAccountInCourse(account, course);
		// if (!isAccountInCourse && account.email != course.owner_email) 
		// 	return this.badRequest("You need registered");
		let lessons = await LessonDAO.getInstance().selectDetailJoinCourses({
			courses_id: course.knowledge_id
		}, ["lesson.*"], this.pagination);
		if (lessons == null) return this.serverError();
		await this.updateInforListLesson(account, lessons);
		if (account.email != course.owner_email)
			lessons.forEach(lesson => {
				lesson.visible = null;
			});
		return this.success("Success", lessons);
	}

// middle-ware:
	async checkLessonExisted(req, res, next){
		this.updateMiddleWare(req, res, next);
		let { lessonid } = req.params;
		let lesson = await LessonDAO.getInstance().getById(lessonid);
		if(lesson == null) return this.badRequest("This lesson is not exist");
		req.lesson = lesson;
		next();
	}
	
// end-ware
	
	// get api/lesson/detail/:lessonid
	// headers: token*
	async getLessonDetail(req, res, next){
		this.updateMiddleWare(req, res, next);
		let { lesson } = req;
		let token = req.headers.authorization;
		let account = await this.accCtrl.getAccountFromToken(token);

		// check visible
		let isVisible = await this.checkAccessible(account, lesson);
		if (!isVisible) return this.badRequest("Can not visible");

		// can visible:
		let lessons = await LessonDAO.getInstance().selectDetail({
			knowledge_id: lesson.knowledge_id
		});
		if (!lessons || lessons.length <= 0) return this.serverError("Get detail is null");
		lesson = lessons[0];

		// get owner
		let owner = await LessonDAO.getInstance().getById(lesson.owner_email);
		lesson.owner = owner;

		// check ismark:
		lesson.isMark = 0;
		if (account){
			let mark = await MarkDAO.getInstance().select({
				email: account.email,
				knowledge_id: lesson.knowledge_id
			});
			if (mark && mark.length > 0) lesson.isMark = 1;
		}

		// get categories:
		lesson.categories = await CategoriesDAO.getInstance().getCategories(lesson.knowledge_id);

		return this.success("Success", lesson);
	}

	// get api/lesson/list?email*=email&courseid*=courseid
	/* headers: token
		body:
			offset* = 0
			length* = 10
	 */
	async getListLesson(req, res, next){
		this.updateMiddleWare(req, res, next);
		let { account } = req;
		let pagination = req.body;
		let {email, courseid} = req.query;
		if (!pagination.offset || !pagination.lengh) pagination = null;
		this.pagination = pagination;

		if (email && courseid) return this.badRequest("Params are not invalid");
		if (!email && !courseid) { // get list lesson of myself
			return await this.getListLessonOfMyself(account);
		} 
		if (email){ // get list lesson of useremail
			let owner = await AccountDAO.getInstance().getById(email);
			if (!owner) return this.badRequest("Email is not existed");
			return await this.getListLessonOfUser(account, owner);
		} 
		if (courseid){ // get list lesson of courseid
			let course = await CoursesDAO.getInstance().getById(courseid);
			if (course == null) return this.badRequest("Course is not existed");
			return await this.getListLessonOfCourse(account, course);
		}
		return this.badRequest("Params are not invalid");
	}
}


module.exports = LessonController;