
var url = require('../configs/api-url-config');
var CourseController = require('../controllers/course-controller');
var AuthController = require('../controllers/auth-controller');
var LimitionController = require('../controllers/limition-controller')
var AccountController = require('../controllers/account-controller');
const RequestController = require('../controllers/request-controller');

class CourseRoute {
	constructor(app){
		this.app = app;
		this.courseUrl = url.course;
		this.authCtrl = new AuthController();
		this.crsCtrl = new CourseController();
		this.limitCtrl = new LimitionController();
		this.accCtrl = new AccountController();
		this.reqCtrl = new RequestController();
	}
	route(){
		// free courses register
		this.app.post(this.courseUrl.register, 
			this.authCtrl.checkToken.bind(this.authCtrl),
			this.accCtrl.checkUser.bind(this.accCtrl),
			this.limitCtrl.checkLimitLevelOne.bind(this.limitCtrl),
			this.crsCtrl.checkCourseExisted.bind(this.crsCtrl),
			this.crsCtrl.freeCourseRegister.bind(this.crsCtrl));

		// courses paying
		this.app.post(this.courseUrl.pay,
			this.authCtrl.checkToken.bind(this.authCtrl),
			this.accCtrl.checkUser.bind(this.accCtrl),
			this.limitCtrl.checkLimitLevelOne.bind(this.limitCtrl),
			this.crsCtrl.checkCourseExisted.bind(this.crsCtrl),
			this.crsCtrl.payCourse.bind(this.crsCtrl)
		);

		// courses request
		this.app.post(this.courseUrl.request,
			this.authCtrl.checkToken.bind(this.authCtrl),
			this.accCtrl.checkUser.bind(this.accCtrl),
			this.limitCtrl.checkLimitLevelOne.bind(this.limitCtrl),
			this.crsCtrl.checkCourseExisted.bind(this.crsCtrl),
			this.reqCtrl.request.bind(this.reqCtrl))
		
		// course cancel register (leave course)	
		this.app.delete(this.courseUrl.register,
			this.authCtrl.checkToken.bind(this.authCtrl),
			this.accCtrl.checkUser.bind(this.accCtrl),
			this.limitCtrl.checkLimitLevelOne.bind(this.limitCtrl),
			this.crsCtrl.checkCourseExisted.bind(this.crsCtrl),
			this.crsCtrl.leaveCourse.bind(this.crsCtrl))

		// courses accept/deny request
		this.app.delete(this.courseUrl.confirmRequest,
			this.authCtrl.checkToken.bind(this.authCtrl),
			this.accCtrl.checkUser.bind(this.accCtrl),
			this.limitCtrl.checkLimitLevelZero.bind(this.limitCtrl),
			this.reqCtrl.checkRequestExisted.bind(this.reqCtrl),
			this.reqCtrl.confirmRequest.bind(this.reqCtrl)
			)

		// courses invite
		this.app.post(this.courseUrl.invite,
			this.authCtrl.checkToken.bind(this.authCtrl),
			this.accCtrl.checkUser.bind(this.accCtrl),
			this.limitCtrl.checkLimitLevelZero.bind(this.limitCtrl),
			this.accCtrl.checkAccountExisted.bind(this.accCtrl),
			this.crsCtrl.checkCourseExisted.bind(this.crsCtrl),
			this.reqCtrl.invite.bind(this.reqCtrl)
			)
		
		// courses accept/deny invite
		this.app.delete(this.courseUrl.confirmInvite,
			this.authCtrl.checkToken.bind(this.authCtrl),
			this.accCtrl.checkUser.bind(this.accCtrl),
			this.limitCtrl.checkLimitLevelZero.bind(this.limitCtrl),
			this.reqCtrl.checkRequestExisted.bind(this.reqCtrl),
			this.reqCtrl.confirmInvite.bind(this.reqCtrl)
			)
		
		// get list request
		this.app.get(this.courseUrl.listRequest,
			this.authCtrl.checkToken.bind(this.authCtrl),
			this.accCtrl.checkUser.bind(this.accCtrl),
			this.limitCtrl.checkLimitLevelOne.bind(this.limitCtrl),
			this.reqCtrl.getListRequest.bind(this.reqCtrl))
		
		// get list invite
		this.app.get(this.courseUrl.listInvite,
			this.authCtrl.checkToken.bind(this.authCtrl),
			this.accCtrl.checkUser.bind(this.accCtrl),
			this.limitCtrl.checkLimitLevelOne.bind(this.limitCtrl),
			this.reqCtrl.getListInvite.bind(this.reqCtrl)
			)
		
		// create course
		this.app.post(this.courseUrl.create,
			this.authCtrl.checkToken.bind(this.authCtrl),
			this.accCtrl.checkUser.bind(this.accCtrl),
			this.limitCtrl.checkLimitLevelZero.bind(this.limitCtrl),
			this.crsCtrl.addCourse.bind(this.crsCtrl))

		// update course
		this.app.patch(this.courseUrl.update,
			this.authCtrl.checkToken.bind(this.authCtrl),
			this.accCtrl.checkUser.bind(this.accCtrl),
			this.limitCtrl.checkLimitLevelZero.bind(this.limitCtrl),
			this.crsCtrl.checkCourseExisted.bind(this.crsCtrl),
			this.crsCtrl.updateCourse.bind(this.crsCtrl)
			)
		

		// delete course
		this.app.delete(this.courseUrl.update,
			this.authCtrl.checkToken.bind(this.authCtrl),
			this.accCtrl.checkUser.bind(this.accCtrl),
			this.limitCtrl.checkLimitLevelZero.bind(this.limitCtrl),
			this.crsCtrl.checkCourseExisted.bind(this.crsCtrl),
			this.crsCtrl.deleteCourse.bind(this.crsCtrl))

		// get list course
		this.app.get(this.courseUrl.list,
			this.authCtrl.checkOptionalApi.bind(this.authCtrl),
			this.crsCtrl.getPagination.bind(this.crsCtrl),
			this.crsCtrl.getList.bind(this.crsCtrl));
		
		// get list registered courses
		this.app.get(this.courseUrl.listRegistered,
			this.authCtrl.checkToken.bind(this.authCtrl),
			this.accCtrl.checkUser.bind(this.accCtrl),
			this.limitCtrl.checkLimitLevelOne.bind(this.limitCtrl),
			this.crsCtrl.getPagination.bind(this.crsCtrl),
			this.crsCtrl.getListRegistered.bind(this.crsCtrl));
		
		// get courses detail
		this.app.get(this.courseUrl.detail,
			this.authCtrl.checkOptionalApi.bind(this.authCtrl),
			this.crsCtrl.getDetail.bind(this.crsCtrl))

		// get list member
		this.app.get(this.courseUrl.member,
			this.authCtrl.checkOptionalApi.bind(this.authCtrl),
			this.crsCtrl.checkCourseExisted.bind(this.crsCtrl),
			this.crsCtrl.getPagination.bind(this.crsCtrl),
			this.crsCtrl.getListMember.bind(this.crsCtrl))
	}
}

module.exports = CourseRoute;
