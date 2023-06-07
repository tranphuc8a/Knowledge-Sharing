
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
const KnowledgeController = require('./knowledge-controller');
const Lesson = require('../models/lesson');
const CoursesLesson = require('../models/courses-lesson');
const CommentDAO = require('../services/dao/comment-dao');
const Score = require('../models/score');
const ScoreDAO = require('../services/dao/score-dao');


class LessonController extends BaseController{
	constructor(){
		super();
		this.crsCtrl = new CourseController();
		this.accCtrl = new AccountController();
		this.knCtrl = new KnowledgeController();
	}

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
		await this.knCtrl.updateInforListKnowledge(account, lessons);
		return this.success("Success", lessons);
	}

	async getListLessonOfUser(account, user){
		if (account.email == user.email) return await this.getListLessonOfMyself(account);
		
		let lessons = await LessonDAO.getInstance().selectDetail({
			owner_email: user.email
		}, null, this.pagination);
		if (lessons == null) return this.serverError();
		
		// update infor for list Lesson:
		await this.knCtrl.updateInforListKnowledge(account, lessons);
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
		await this.knCtrl.updateInforListKnowledge(account, lessons);
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
		let { account, lesson } = req;
		let token = req.headers.authorization;

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

	// post api/lesson
	// header: token
	// body: title, thumbnail*, categories, learning_time, content, visible
	async addLesson(req, res, next){
		this.updateMiddleWare(req, res, next);
		let {account} = req;
		let lesson = new Lesson(req.body);
		// check params:
		if (!lesson.title || !lesson.categories || !lesson.learning_time || !lesson.content || !lesson.visible)
			return this.badRequest("Params are not invalid");
		lesson.owner_email = account.owner_email;

		// insert:
		let rs = await LessonDAO.getInstance().insert(lesson);
		if (!rs) return this.serverError();
		return this.success("Success", rs);
	}

	// post api/courses/lesson/:courseid/:lessonid
	// header: token
	// body: offset
	async addLessonToCourse(req, res, next){
		this.updateMiddleWare(req, res, next);
		let {account, course, lesson} = req;
		let {offset} = req.body;
		// check permission:
		if (account.email != course.owner_email || account.email != lesson.owner_email)
			return this.info("Not permission");

		if (!(offset && offset >= 0)) return this.badRequest("Offset is invalid");

		// add lesson to course:
		let csls = {
			offset: offset,
			courses_id: course.knowledge_id,
			lesson_id: lesson.knowledge_id
		}
		let rs = await CoursesLessonDAO.getInstance().insert(csls);
		if (!rs) return this.serverError();
		return this.success("Success", csls);
	}

	// delete api/courses/lesson/:courseid/:lessonid
	// header: token
	async deleteLessonFromCourse(req, res, next){
		this.updateMiddleWare(req, res, next);
		let {account, course, lesson} = req;

		// check permission:
		if (account.email != course.owner_email || account.email != lesson.owner_email)
			return this.info("Not permission");

		// delete lesson from course:
		let rs = await CoursesLessonDAO.getInstance().delete({
			courses_id: course.knowledge_id,
			lesson_id: lesson.knowledge_id
		});
		if (!rs) return this.serverError();
		return this.success();
	}

	// patch api/courses/lesson/:courseid/:lessonid
	// header: token
	// body: offset
	async updateLessonInCourse(req, res, next){
		this.updateMiddleWare(req, res, next);
		let {account, course, lesson} = req;
		let {offset} = req.body;
		// check permission:
		if (account.email != course.owner_email || account.email != lesson.owner_email)
			return this.info("Not permission");

		if (!(offset && offset >= 0)) return this.badRequest("Offset is invalid");

		// update lesson in course:
		let rs = await CoursesLessonDAO.getInstance().update({
			offset: offset
		}, {
			courses_id: course.knowledge_id,
			lesson_id: lesson.knowledge_id
		});
		if (!rs) return this.serverError();
		return this.success();
	}

	// patch api/lesson/:lessonid
	// header: token
	// body: title*, thumbnail*, categories*, learning_time*, content*, visible*
	async updateLesson(req, res, next){
		this.updateMiddleWare(req, res, next);
		let {account, lesson} = req;
		let newLesson = new Lesson(req.body);
		// check permission:
		if (account.email != lesson.owner_email) return this.info("No permission");

		// update new Info
		lesson.title = newLesson.title ? newLesson.title : lesson.title;
		lesson.thumbnail = newLesson.thumbnail ? newLesson.thumbnail : lesson.thumbnail;
		lesson.categories = newLesson.categories ? newLesson.categories : lesson.categories;
		lesson.learning_time = newLesson.learning_time ? newLesson.learning_time : lesson.learning_time;
		lesson.content = newLesson.content ? newLesson.content : lesson.content;
		lesson.visible = newLesson.visible ? newLesson.visible : lesson.visible;
		
		// fix update categories
		let rs = await LessonDAO.getInstance().update({
			title: lesson.title, thumbnail: lesson.thumbnail, categories: lesson.categories,
			learning_time: lesson.learning_time, content: lesson.content, visible: lesson.visible
		});

		if (!rs) return this.serverError();
		return this.success("Success", lesson);
	}

	// delete api/lesson/:lessonid
	// header: token
	async deleteLesson(req, res, next){
		this.updateMiddleWare(req, res, next);
		let {account, lesson} = req;

		// check permission:
		if (account.email != lesson.owner_email) return this.info("No permission");

		// delete lesson: Comment, Mark, Score, CourseLesson, Lesson
		let rs1 = CommentDAO.getInstance().delete({knowledge_id: lesson.knowledge_id});
		let rs2 = MarkDAO.getInstance().delete({knowledge_id: lesson.knowledge_id});
		let rs3 = ScoreDAO.getInstance().delete({knowledge_id: lesson.knowledge_id});
		let rs4 = CoursesLessonDAO.getInstance().delete({lesson_id: lesson.knowledge_id});
		await Promise.all([rs1, rs2, rs3, rs4]);
		let rs = await LessonDAO.getInstance().delete({knowledge_id: lesson.knowledge_id});

		if (! (rs && rs1 && rs2 && rs3 && rs4)) return this.serverError("Delete lesson failed");
		return this.success("Success", lesson);
	}

	
}


module.exports = LessonController;
