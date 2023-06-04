
const Learn = require('../models/learn');
const CoursesDAO = require('../services/dao/courses-dao');
const LearnDAO = require('../services/dao/learn-dao');
const RequestDAO = require('../services/dao/request-dao');
const DateTime = require('../utils/datetime');
const Response = require('../utils/response');
var Res = require('../utils/response')

class CourseController{
	constructor(){}

	async checkAccountInCourse(account, course){
		if (account == null || course == null) return false;
		let learns = await LearnDAO.getInstance().select({
			email: account.email,
			courses_id: course.knowledge_id
		});
		return learns.length >= 1;
	}
	async checkLessonInCourse(lesson, course){
		if (lesson == null || course == null) return false;
		let csls = await CoursesLessonDAO.getInstance().select({
			courses_id: course.knowledge_id,
			lesson_id: lesson.knowledge_id
		});
		return csls.lengh > 0;
	}
// middle-ware:
	async checkCourseExisted(req, res, next){
		let { courseid } = req.params;
		let course = await CoursesDAO.getInstance().getById(courseid);
		if(course == null){
			return Res.response(res, Res.ResponseCode.INFO, "This courses is not exist");
		}
		req.course = course;
		next();
	}
	async checkCourseNotExisted(req, res, next){
		let { courseid } = req.params;
		let course = await CoursesDAO.getInstance().getById(courseid);
		if(course != null){
			return Res.response(res, Res.ResponseCode.INFO, "This courses is exist");
		}
		next();
	}


// endware:

	// post api/courses/register/:courseid
	// header: token
	async freeCourseRegister(req, res, next){
		let {account, course} = req;

		// check user register full course:
		// ...
		// check course is free and available slots:
		if (course.isfree != '1' && course.isfree != 1){
			return Res.response(res, Res.ResponseCode.INFO, "This courses is not free");
		}
		//...
		// check user is in course:
		let learns = await LearnDAO.getInstance().select({email: account.email, courses_id: course.knowledge_id});
		if (learns && learns.length > 0) {
			return Res.response(res, Res.ResponseCode.INFO, "You are already in this course")
		}

		// add register
		let result = await LearnDAO.getInstance().insert(new Learn({
			email: account.email,
			courses_id: course.knowledge_id,
			time: DateTime.now()
		}));

		if (result == null){
			return Res.response(res, Res.ResponseCode.SERVER_ERROR, "Register failed");
		}
		return Res.response(res, Res.ResponseCode.OK, "Register success", course);

	}

	// post api/courses/pay/:courseid
	// header: token, password
	// body: money 
	async payCourse(req, res, next){
		let {account, course} = req;
		let {password, money} = req.body;
		money = Number(money);
		if (!money && money !== 0 || money < 0) return Response.response(res, Response.ResponseCode.BAD_REQUEST, "Money is in valid");
		if (!password || password != account.password)
			return Response.response(res, Response.ResponseCode.BAD_REQUEST, "Wrong password");

		// check user is full courses:
		// ...
		// check course is exist, fee and available
		if (course.isfree != '0' && course.isfree != 0){
			return Res.response(res, Res.ResponseCode.INFO, "This courses is free");
		}
		// check user is in course:
		let learns = await LearnDAO.getInstance().select({email: account.email, courses_id: course.knowledge_id});
		if (learns.length > 0) {
			return Res.response(res, Res.ResponseCode.INFO, "You are already in this course")
		}

		// check money:
		if (money < course.fee){
			return Res.response(res, Res.ResponseCode.INFO, "Not enough money")
		}

		// add register
		let result = await LearnDAO.getInstance().insert(new Learn({
			email: account.email,
			courses_id: course.knowledge_id,
			time: DateTime.now()
		}));

		if (result == null){
			return Res.response(res, Res.ResponseCode.SERVER_ERROR, "Register failed");
		}
		return Res.response(res, Res.ResponseCode.OK, "Register success", course);

	}
	

	// delete api/courses/register/:courseid
	// header: token
	async leaveCourse(req, res, next){
		let {account, course} = req;
		// check user is in course:
		let learns = await LearnDAO.getInstance().select({email: account.email, courses_id: course.knowledge_id});
		if (!learns || learns.length <= 0) {
			return Res.response(res, Res.ResponseCode.INFO, "You are not in this course")
		}

		let rs = await LearnDAO.getInstance().delete({
			email: account.email,
			courses_id: course.knowledge_id
		});
		if (!rs) return Res.response(res, Res.ResponseCode.SERVER_ERROR, "Failed");
		return Res.response(res, Res.ResponseCode.OK, "Leave course success", course);
	}
}

module.exports = CourseController;
