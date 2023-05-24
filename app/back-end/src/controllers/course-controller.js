
const Learn = require('../models/learn');
const CoursesDAO = require('../services/dao/courses-dao');
const LearnDAO = require('../services/dao/learn-dao');
const RequestDAO = require('../services/dao/request.dao');
const DateTime = require('../utils/datetime');
var Res = require('../utils/response')

class CourseController{
	constructor(){}

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
		let learns = await LearnDAO.select({email: account.email, courses_id: course.knowledge_id});
		if (learns.length > 0) {
			return Res.response(res, Res.ResponseCode.INFO, "You are already in this course")
		}

		// add register
		let result = await LearnDAO.insert(new Learn({
			email: account.email,
			courses_id: courseid,
			time: DateTime.now()
		}));

		if (result == null){
			return Res.response(Res.ResponseCode.SERVER_ERROR, "Register failed");
		}
		return Res.response(res, Res.ResponseCode.OK, course, "Register success");

	}

	// post api/courses/pay/:courseid
	async payCourse(req, res, next){
		let {account, course} = req;

		// check user is full courses:
		// ...
		// check course is exist, fee and available
		if (course.isfree != '0' && course.isfree != 0){
			return Res.response(res, Res.ResponseCode.INFO, "This courses is free");
		}
		// check user is in course:
		let learns = await LearnDAO.select({email: account.email, courses_id: course.knowledge_id});
		if (learns.length > 0) {
			return Res.response(res, Res.ResponseCode.INFO, "You are already in this course")
		}

		// check money:
		let money = Number(req.params.money);
		if (money < course.fee){
			return Res.response(res, Res.ResponseCode.INFO, "Not enough money")
		}

		// add register
		let result = await LearnDAO.insert(new Learn({
			email: account.email,
			courses_id: courseid,
			time: DateTime.now()
		}));

		if (result == null){
			return Res.response(Res.ResponseCode.SERVER_ERROR, "Register failed");
		}
		return Res.response(res, Res.ResponseCode.OK, course, "Register success");

	}

	
}

module.exports = CourseController;
