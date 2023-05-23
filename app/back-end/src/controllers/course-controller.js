
const Learn = require('../models/learn');
const CoursesDAO = require('../services/dao/courses-dao');
const LearnDAO = require('../services/dao/learn-dao');
const DateTime = require('../utils/datetime');
var Res = require('../utils/response')

class CourseController{
	constructor(){}


// endware:

	// post api/courses/register/:courseid
	async freeCourseRegister(req, res, next){
		let {account} = req;
		let { courseid } = req.params;
		
		// check user register full course:

		// check course is free and available slots:
		let course = await CoursesDAO.getInstance().getById(courseid);
		if(course == null){
			return Res.response(res, Res.ResponseCode.INFO, null, "This courses is not exist");
		}
		if (course.isfree != '1' && course.isfree != 1){
			return Res.response(res, Res.ResponseCode.INFO, null, "This courses is not free");
		}

		let result = await LearnDAO.insert(new Learn({
			email: account.email,
			courses_id: courseid,
			time: DateTime.now()
		}));

		if (result == null){
			return Res.response(Res.ResponseCode.SERVER_ERROR, null, "Register failed");
		}
		return Res.response(res, Res.ResponseCode.OK, course, "Register success");

	}
}

module.exports = CourseController;
