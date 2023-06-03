
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
			this.authCtrl.checkToken,
			this.accCtrl.checkUser,
			this.limitCtrl.checkLimitLevelOne,
			this.crsCtrl.checkCourseExisted,
			this.crsCtrl.freeCourseRegister);

		// courses paying
		this.app.post(this.courseUrl.pay,
			this.authCtrl.checkToken,
			this.accCtrl.checkUser,
			this.limitCtrl.checkLimitLevelOne,
			this.crsCtrl.checkCourseExisted,
			this.crsCtrl.payCourse
		);

		// courses request
		this.app.post(this.courseUrl.request,
			this.authCtrl.checkToken,
			this.accCtrl.checkUser,
			this.limitCtrl.checkLimitLevelOne,
			this.crsCtrl.checkCourseExisted,
			this.reqCtrl.request)
		
		// course cancel register (leave course)	
		this.app.delete(this.courseUrl.register,
			this.authCtrl.checkToken,
			this.accCtrl.checkUser,
			this.limitCtrl.checkLimitLevelOne,
			this.crsCtrl.checkCourseExisted,
			this.crsCtrl.leaveCourse)

		// courses accept/deny request
		this.app.delete(this.courseUrl.confirmRequest,
			this.authCtrl.checkToken,
			this.accCtrl.checkUser,
			this.limitCtrl.checkLimitLevelZero,
			this.reqCtrl.checkRequestExisted,
			this.reqCtrl.confirmRequest
			)

		// courses invite
		this.app.post(this.courseUrl.invite,
			this.authCtrl.checkToken,
			this.accCtrl.checkUser,
			this.limitCtrl.checkLimitLevelZero,
			this.accCtrl.checkAccountExisted,
			this.crsCtrl.checkCourseExisted,
			this.reqCtrl.invite
			)
		
		// courses accept/deny invite
		this.app.delete(this.courseUrl.confirmInvite,
			this.authCtrl.checkToken,
			this.accCtrl.checkUser,
			this.limitCtrl.checkLimitLevelZero,
			this.reqCtrl.checkRequestExisted,
			this.reqCtrl.confirmInvite
			)
		
		// get list request
		this.app.get(this.courseUrl.request,
			this.authCtrl.checkToken,
			this.accCtrl.checkUser,
			this.limitCtrl.checkLimitLevelOne,
			this.reqCtrl.getListRequest)
		
		// get list invite
		this.app.get(this.courseUrl.listInvite,
			this.authCtrl.checkToken,
			this.accCtrl.checkUser,
			this.limitCtrl.checkLimitLevelOne,
			this.reqCtrl.getListInvite
			)
		
	}
}

module.exports = CourseRoute;
