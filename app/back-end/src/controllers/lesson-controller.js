
const CoursesLessonDAO = require('../services/dao/courses-lesson-dao');
const LessonDAO = require('../services/dao/lesson-dao');
const ProfileDAO = require('../services/dao/profile-dao');
var mailer = require('../services/email-service');
const Response = require('../utils/response');
const AccountController = require('./account-controller');


class LessonController{
	constructor(){}

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
		let accCtrl = new AccountController();
		let account = await accCtrl.getAccountFromToken(token);

		// check can not visible?
		if (lesson.visible == 0){ // private
			if (account == null || courseid == null)
				return Response.response(res, Response.ResponseCode.INFO, "Cannot visible");
			let learns = await LessonDAO.getInstance().select({
				email: account.email,
				courses_id: courseid
			});
			if (learns.length <= 0)
				return Response.response(res, Response.ResponseCode.INFO, "Cannot visible");
			let csls = await CoursesLessonDAO.select({courses_id: courseid, lesson_id: lesson.knowledge_id});
			if (csls.length <= 0)
				return Response.response(res, Response.ResponseCode.INFO, "Cannot visible");
		} else if (lesson.visible == 1){ // default
			// check follows:
			// ...
			// check registered
			if (account == null || courseid == null){
				return Response.response(res, Response.ResponseCode.INFO, "Cannot visible");
			}
			let learns = await LessonDAO.getInstance().select({
				email: account.email,
				courses_id: courseid
			});
			if (learns.length <= 0)
				return Response.response(res, Response.ResponseCode.INFO, "Cannot visible");
			let csls = await CoursesLessonDAO.select({courses_id: courseid, lesson_id: lesson.knowledge_id});
			if (csls.length <= 0)
				return Response.response(res, Response.ResponseCode.INFO, "Cannot visible");
		} 

		// can visible:
		let owner = await ProfileDAO.getInstance().getById(lesson.owner_email);
		lesson.owner = owner;

		// get score

		// get numcmt

		// check ismark

		// get categories


		return Response.response(res, Response.ResponseCode.OK, "Success", lesson);
	}
}


module.exports = LessonController;