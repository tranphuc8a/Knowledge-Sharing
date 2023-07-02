
const Courses = require('../models/courses');
const Learn = require('../models/learn');
const Payment = require('../models/payment');
const AccountDAO = require('../services/dao/account-dao');
const CategoriesDAO = require('../services/dao/categories-dao');
const CommentDAO = require('../services/dao/comment-dao');
const CoursesDAO = require('../services/dao/courses-dao');
const CoursesLessonDAO = require('../services/dao/courses-lesson-dao');
const LearnDAO = require('../services/dao/learn-dao');
const LessonDAO = require('../services/dao/lesson-dao');
const MarkDAO = require('../services/dao/mark-dao');
const PaymentDAO = require('../services/dao/payment-dao');
const RequestDAO = require('../services/dao/request-dao');
const ScoreDAO = require('../services/dao/score-dao');
const DateTime = require('../utils/datetime');
const Response = require('../utils/response');
var Res = require('../utils/response');
const BaseController = require('./base-controller');
const KnowledgeController = require('./knowledge-controller');

class CourseController extends BaseController{
	constructor(){
		super();
		this.knCtrl = new KnowledgeController();
	}

	async checkAccountInCourse(account, course){
		try {
			if (account == null || course == null) return false;
			let learns = await LearnDAO.getInstance().select({
				email: account.email,
				courses_id: course.knowledge_id
			});
			return learns.length >= 1;
		} catch(e){
			throw e;
		}
	}
	async checkLessonInCourse(lesson, course){
		try {
			if (lesson == null || course == null) return false;
			let csls = await CoursesLessonDAO.getInstance().select({
				courses_id: course.knowledge_id,
				lesson_id: lesson.knowledge_id
			});
			return csls.lengh > 0;
		} catch (e){
			throw e;
		}
	}
// middle-ware:
	async checkCourseExisted(req, res, next){
		try {
			this.updateMiddleWare(req, res, next);
			let { courseid } = req.params;
			let course = await CoursesDAO.getInstance().getById(courseid);
			if(course == null)
				return this.info("This courses is not exist");
			req.course = course;
			next();
		} catch(e){
			console.log(e);
			return this.serverError(e);
		}
	}
	async checkCourseNotExisted(req, res, next){
		try {
			this.updateMiddleWare(req, res, next);
			let { courseid } = req.params;
			let course = await CoursesDAO.getInstance().getById(courseid);
			if(course != null)
				return this.info("This courses is exist");
			next();
		} catch(e){
			console.log(e);
			return this.serverError(e);
		}
	}


// endware:

	// post api/courses/register/:courseid
	// header: token
	async freeCourseRegister(req, res, next){
		try{
			this.updateMiddleWare(req, res, next);
			let {account, course} = req;

			// check user register full course:
			// temporal not limition, resolve later

			// check course is free and available slots:
			if (course.isfree != '1' && course.isfree != 1)
				return this.info("This courses is not free");

			// not limit number learner per class

			// check user is in course:
			let learns = await LearnDAO.getInstance().select({email: account.email, courses_id: course.knowledge_id});
			if (learns && learns.length > 0) 
				return this.info("You are already in this course");

			// add register
			let result = await LearnDAO.getInstance().insert(new Learn({
				email: account.email,
				courses_id: course.knowledge_id,
				time: DateTime.now()
			}));

			if (result == null) return this.serverError("Register failed");
			return this.success("Register Success", course);
		} catch(e){
			console.log(e);
			return this.serverError(e);
		}
	}

	// post api/courses/pay/:courseid
	// header: token, password
	// body: money 
	async payCourse(req, res, next){
		try {

			this.updateMiddleWare(req, res, next);
			let {account, course} = req;
			let {password, money} = req.body;
			money = Number(money);
			if (!money && money !== 0 || money < 0) return this.badRequest("Money is in valid");
			if (!password || password != account.password)
				return this.badRequest("Wrong password");

			// check user is full courses:
			// temporal not limition, resolve later

			// check course is exist, fee and available
			if (course.isfree != '0' && course.isfree != 0){
				return this.badRequest("This courses is free");
			}
			// check user is in course:
			let learns = await LearnDAO.getInstance().select({email: account.email, courses_id: course.knowledge_id});
			if (learns.length > 0) return this.info("You are already in this course")

			// check money:
			if (money < course.fee) return this.badRequest("Not enough money");

			PaymentDAO.getInstance().insert(new Payment({
				email: account.email,
				courses_id: course.knowledge_id,
				money: money,
				time: DateTime.now()
			}))

			// add register
			let result = await LearnDAO.getInstance().insert(new Learn({
				email: account.email,
				courses_id: course.knowledge_id,
				time: DateTime.now()
			}));

			if (result == null) return this.badRequest("Register failed");
			return this.success("Register success", course);
		} catch (e){
			console.log(e);
			return this.serverError(e);
		}
	}
	

	// delete api/courses/register/:courseid
	// header: token
	async leaveCourse(req, res, next){
		try{
			this.updateMiddleWare(req, res, next);
			let {account, course} = req;
			// check user is in course:
			let learns = await LearnDAO.getInstance().select({email: account.email, courses_id: course.knowledge_id});
			if (!learns || learns.length <= 0) return this.info("You are not in this course");

			let rs = await LearnDAO.getInstance().delete({
				email: account.email,
				courses_id: course.knowledge_id
			});
			
			if (!rs) return this.serverError();
			return this.success("Leave course success", course);
		} catch (e){
			console.log(e);
			return this.serverError(e);
		}
	}

	// post api/courses/
	// header: token
	// body: title, thumbnail*, learning_time, description, isfree, fee, categories
	async addCourse(req, res, next){
		try{

			this.updateMiddleWare(req, res, next);
			let {account} = req;
			let course = new Courses(req.body);
			// validate params:
			if (!course.title || !course.learning_time || !course.description || !course.isfree || !course.categories)
				return this.badRequest("Lack of params");
			if (course.isfree == 0 && !course.fee) return this.badRequest("Lack of params");
			if (course.fee && !(course.fee >= 0)) return this.badRequest("Fee is not valid");
			course.fee = course.fee || 0;

			course.owner_email = account.email;
			course.create_at = DateTime.now();
			let cloner = require('lodash');
			let course_clone = cloner.clone(course);
			delete course_clone.categories;
			
			// check user is full of course (temporal not limit)
			let rs1 = await CoursesDAO.getInstance().insert(course_clone);
			course.id = course.knowledge_id = rs1.knowledge_id;
			let rs2 = await CategoriesDAO.getInstance().insert(course);

			
			if (!rs1 || !rs2) return this.serverError();
			return this.success("Success", course);
		} catch(e){
			console.log(e);
			return this.serverError(e);
		}
	}


	// patch api/courses/:courseid
	// header: token
	// params: courseid
	// body: title*, thumbnail*, learning_time*, description*, fee*, categories*
	async updateCourse(req, res, next){
		try {
			this.updateMiddleWare(req, res, next);
			let {account, course} = req;
			
			// check owner of course
			if (account.email != course.owner_email)
				return this.info("Not permission");

			let newCourse = new Courses(req.body);
			// check cannot update fee for free courses:
			if (course.isfree != 0 && newCourse.fee != null)
				return this.badRequest("Cannot change fee for free course");
			

			course.title = newCourse.title ?? course.title;
			course.thumbnail = newCourse.thumbnail ?? course.thumbnail;
			course.learning_time = newCourse.learning_time ?? course.learning_time;
			course.description = newCourse.description ?? course.description;
			course.fee = newCourse.fee ?? course.fee;
			course.categories = newCourse.categories ?? course.categories;
			course.update_at = DateTime.now();

			let rs1 = await CategoriesDAO.getInstance().delete({
				knowledge_id: course.knowledge_id
			});
			let rs2 = await CategoriesDAO.getInstance().insert(course);
			
			let rs = await CoursesDAO.getInstance().update({
				title: course.title, thumbnail: course.thumbnail, learning_time: course.learning_time,
				description: course.description, fee: course.fee, update_at: course.update_at
			}, {
				knowledge_id: course.knowledge_id
			});
			if (!rs) return this.serverError();
			return this.success("Update course success", course);
		} catch (e){
			console.log(e);
			return this.serverError(e);
		}
	}


	// delete /api/courses/:courseid
	// header: token
	async deleteCourse(req, res, next){
		try{

			this.updateMiddleWare(req, res, next);
			let {account, course} = req;

			// check account is owner
			if (account.email != course.owner_email) return this.info("Not permission");

			if (course.isfree == 0){
				// check course is not free and num learner > 0
				let learns = await LearnDAO.getInstance().select({
					courses_id: course.knowledge_id
				});

				if (learns && learns.length > 0) 
					return this.info("Cannot remove not empty and not free course");
			}

			// delete course: Payment, Learn, CourseLesson, Request, Comment, Mark, Score, Courses, Categories
			let rs1 = PaymentDAO.getInstance().delete({courses_id: course.knowledge_id});
			let rs2 = LearnDAO.getInstance().delete({courses_id: course.knowledge_id});
			let rs3 = CoursesLessonDAO.getInstance().delete({courses_id: course.knowledge_id});
			let rs4 = RequestDAO.getInstance().delete({courses_id: course.knowledge_id});
			let rs5 = CommentDAO.getInstance().delete({knowledge_id: course.knowledge_id});
			let rs6 = MarkDAO.getInstance().delete({knowledge_id: course.knowledge_id});
			let rs7 = ScoreDAO.getInstance().delete({knowledge_id: course.knowledge_id});
			let rs8 = CategoriesDAO.getInstance().delete({knowledge_id: course.knowledge_id});
			// ...
			[rs1, rs2, rs3, rs4, rs5, rs6, rs7] =
				await Promise.all([rs1, rs2, rs3, rs4, rs5, rs6, rs7]);
			let rs = await CoursesDAO.getInstance().delete({knowledge_id: course.knowledge_id});

			if (!rs || !rs1 || !rs2 || !rs3 || !rs4 || !rs5 || !rs6 || !rs7 || !rs8) 
				return this.serverError("Delete course falied");
			return this.success("Xóa bài học thành công");
		} catch (e){
			console.log(e);
			return this.serverError(e);
		}
	}

	// get api/courses/list?email=
	// header: token*
	// body: offset*, length*
	async getList(req, res, next){
		try{
			this.updateMiddleWare(req, res, next);
			let {account, pagination} = req;
			let {email} = req.query;
			let courses = null;
			
			if (email != null){
				let account = await AccountDAO.getInstance().getById(email);
				if (!account) return this.badRequest("User is not exist");
				// get list course of user email
				courses = await CoursesDAO.getInstance().selectDetail({
					owner_email: email
				}, ["courses.*"], pagination);
				// update categories, ismark, relevant
				await Promise.all([
					this.knCtrl.updateInforListKnowledge(account, courses),
					this.updateInforListCourses(account, courses)
				])
			} else {
				// get list course of myself
				if (!account) return this.badRequest("Lack of token or email");
				courses = await CoursesDAO.getInstance().selectDetail({
					owner_email: account.email
				}, ["courses.*"], pagination);
				// update categories and mark
				await this.knCtrl.updateInforListKnowledge(account, courses);
				// update relevant:
				courses.forEach(course => { course.relevant = 4; }); // owner
			}

			if (courses == null) return this.serverError();
			return this.success("Success", {
				length: courses.lengh,
				data: courses
			});		
		} catch (e){
			console.log(e);
			return this.serverError(e);
		}
	}

	async updateInforListCourses(account, courses){
		try {
			// update relevant for list courses
			if (account == null || courses == null) return;
			let [ listRequesting, listInvited, listLearn ] = [
				RequestDAO.getInstance().select({
					learner_email: account.email,
					type: 'request'
				}),
				RequestDAO.getInstance().select({
					learner_email: account.email,
					type: 'invite'
				}),
				LearnDAO.getInstance().select({
					email: account.email
				})
			];
			[ listRequesting, listInvited, listLearn ] = 
				await Promise.all([listRequesting, listInvited, listLearn]);
			if (listRequesting && listRequesting.length > 0) 
				listRequesting = listRequesting.map(request => request.courses_id);
			else listRequesting = [];
			if (listInvited && listInvited.length > 0)
				listInvited = listInvited.map(invite => invite.courses_id);
			else listInvited = [];
			if (listLearn && listLearn.length > 0)
				listLearn = listLearn.map(learn => learn.courses_id);
			else listLearn = [];
			
			courses.forEach(course => {
				course.relevant = 0;   // not relevant
				if (course.owner_email == account.email) {
					course.relevant = 4; // owner
					return;
				};
				if (listRequesting.includes(course.knowledge_id)){
					course.relevant = 1; // requesting
					return;
				}
				if (listInvited.includes(course.knowledge_id)){
					course.relevant = 2; // invited
					return;
				}
				if (listLearn.includes(course.knowledge_id)){
					course.relevant = 3; // registered
					return;
				}
			});
		} catch (e){
			console.log(e);
			return null;
		}
	}

	// get api/courses/list-registered
	// header: token
	// body: offset*, length*
	async getListRegistered(req, res, next){
		try{
			this.updateMiddleWare(req, res, next);
			let {account, pagination} = req;

			let courses = await CoursesDAO.getInstance().selectDetailJoinLearn({
				"learn.email": account.email
			}, ["courses.*"], pagination);

			if (!courses) return this.serverError();

			await this.knCtrl.updateInforListKnowledge(account, courses);
			courses.forEach(course => {
				course.relevant = 3; 
			});
			
			return this.success("Success", courses);

		} catch (e){
			console.log(e);
			return this.serverError(e);
		}
	}

	// get api/courses/detail/:courseid
	async getDetail(req, res, next){
		try {
			this.updateMiddleWare(req, res, next);
			let {account} = req;
			let {courseid} = req.params;
			if (!courseid) return this.badRequest("Lack of courseid");

			let courses = await CoursesDAO.getInstance().selectDetail({
				"courses.knowledge_id": courseid
			}, ["courses.*"], null);


			if (courses == null || courses.length <= 0) return this.badRequest("Course is not exist");
			
			// update infor for courses
			await Promise.all([
				this.knCtrl.updateInforListKnowledge(account, courses),
				this.updateInforListCourses(account, courses)
			]);

			let course = courses[0];
			if (account && (course.relevant == 1 || course.relevant == 2)){
				let request = await RequestDAO.getInstance().select({
					"learner_email" : account.email,
					"courses_id": course.knowledge_id,
					"type": course.relevant == 1 ? "request" : "invite"
				});
				if (request && request.length > 0) course.requestid = request[0].id;
			}
			// get list lesson:
			let lessons = await LessonDAO.getInstance().selectDetailJoinCourses({
				"courses_lesson.courses_id": course.knowledge_id
			}, ["lesson.*", "courses_lesson.offset"], null);
			course.listLesson = lessons ? lessons : [];

			return this.success("Success", course);
		} catch (e){
			console.log(e);
			return this.serverError(e);
		}
	}

	// get api/courses/members/:courseid
	// header: token*
	async getListMember(req, res, next){
		try{
			this.updateMiddleWare(req, res, next);
			let {account, course, pagination} = req;

			// get list member:
			let listMember = await LearnDAO.getInstance().selectDetail({
				"learn.courses_id": course.knowledge_id
			}, ["learn.email", "profile.name", "profile.avatar", "learn.time"], pagination);
		
			if (!listMember) return this.serverError();
			return this.success("Success", {
				length: listMember.length,
				data: listMember
			})
		} catch (e){
			console.log(e);
			return this.serverError(e);
		}
	}
}

module.exports = CourseController;
