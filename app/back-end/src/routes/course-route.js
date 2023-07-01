
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
			this.authCtrl.checkToken.bind(new AuthController()),
			this.accCtrl.checkUser.bind(new AccountController()),
			this.limitCtrl.checkLimitLevelOne.bind(new LimitionController()),
			this.crsCtrl.checkCourseExisted.bind(new CourseController()),
			this.crsCtrl.freeCourseRegister.bind(new CourseController()));

		// courses paying
		this.app.post(this.courseUrl.pay,
			this.authCtrl.checkToken.bind(new AuthController()),
			this.accCtrl.checkUser.bind(new AccountController()),
			this.limitCtrl.checkLimitLevelOne.bind(new LimitionController()),
			this.crsCtrl.checkCourseExisted.bind(new CourseController()),
			this.crsCtrl.payCourse.bind(new CourseController())
		);

		// courses request
		this.app.post(this.courseUrl.request,
			this.authCtrl.checkToken.bind(new AuthController()),
			this.accCtrl.checkUser.bind(new AccountController()),
			this.limitCtrl.checkLimitLevelOne.bind(new LimitionController()),
			this.crsCtrl.checkCourseExisted.bind(new CourseController()),
			this.reqCtrl.request.bind(new RequestController()))
		
		// course cancel register (leave course)	
		this.app.delete(this.courseUrl.register,
			this.authCtrl.checkToken.bind(new AuthController()),
			this.accCtrl.checkUser.bind(new AccountController()),
			this.limitCtrl.checkLimitLevelOne.bind(new LimitionController()),
			this.crsCtrl.checkCourseExisted.bind(new CourseController()),
			this.crsCtrl.leaveCourse.bind(new CourseController()))

		// courses accept/deny request
		this.app.delete(this.courseUrl.confirmRequest,
			this.authCtrl.checkToken.bind(new AuthController()),
			this.accCtrl.checkUser.bind(new AccountController()),
			this.limitCtrl.checkLimitLevelZero.bind(new LimitionController()),
			this.reqCtrl.checkRequestExisted.bind(new RequestController()),
			this.reqCtrl.confirmRequest.bind(new RequestController())
			)

		// courses invite
		this.app.post(this.courseUrl.invite,
			this.authCtrl.checkToken.bind(new AuthController()),
			this.accCtrl.checkUser.bind(new AccountController()),
			this.limitCtrl.checkLimitLevelZero.bind(new LimitionController()),
			this.accCtrl.checkAccountExisted.bind(new AccountController()),
			this.crsCtrl.checkCourseExisted.bind(new CourseController()),
			this.reqCtrl.invite.bind(new RequestController())
			)
		
		// courses accept/deny invite
		this.app.delete(this.courseUrl.confirmInvite,
			this.authCtrl.checkToken.bind(new AuthController()),
			this.accCtrl.checkUser.bind(new AccountController()),
			this.limitCtrl.checkLimitLevelZero.bind(new LimitionController()),
			this.reqCtrl.checkRequestExisted.bind(new RequestController()),
			this.reqCtrl.confirmInvite.bind(new RequestController())
			)
		
		// get list request
		this.app.get(this.courseUrl.listRequest,
			this.authCtrl.checkToken.bind(new AuthController()),
			this.accCtrl.checkUser.bind(new AccountController()),
			this.limitCtrl.checkLimitLevelOne.bind(new LimitionController()),
			this.reqCtrl.getListRequest.bind(new RequestController()))
		
		// get list invite
		this.app.get(this.courseUrl.listInvite,
			this.authCtrl.checkToken.bind(new AuthController()),
			this.accCtrl.checkUser.bind(new AccountController()),
			this.limitCtrl.checkLimitLevelOne.bind(new LimitionController()),
			this.reqCtrl.getListInvite.bind(new RequestController())
			)
		
		// create course
		this.app.post(this.courseUrl.create,
			this.authCtrl.checkToken.bind(new AuthController()),
			this.accCtrl.checkUser.bind(new AccountController()),
			this.limitCtrl.checkLimitLevelZero.bind(new LimitionController()),
			this.crsCtrl.addCourse.bind(new CourseController()))

		// update course
		this.app.patch(this.courseUrl.update,
			this.authCtrl.checkToken.bind(new AuthController()),
			this.accCtrl.checkUser.bind(new AccountController()),
			this.limitCtrl.checkLimitLevelZero.bind(new LimitionController()),
			this.crsCtrl.checkCourseExisted.bind(new CourseController()),
			this.crsCtrl.updateCourse.bind(new CourseController())
			)
		

		// delete course
		this.app.delete(this.courseUrl.update,
			this.authCtrl.checkToken.bind(new AuthController()),
			this.accCtrl.checkUser.bind(new AccountController()),
			this.limitCtrl.checkLimitLevelZero.bind(new LimitionController()),
			this.crsCtrl.checkCourseExisted.bind(new CourseController()),
			this.crsCtrl.deleteCourse.bind(new CourseController()))

		// get list course
		this.app.get(this.courseUrl.list,
			this.authCtrl.checkOptionalApi.bind(new AuthController()),
			this.crsCtrl.getPagination.bind(new CourseController()),
			this.crsCtrl.getList.bind(new CourseController()));
		
		// get list registered courses
		this.app.get(this.courseUrl.listRegistered,
			this.authCtrl.checkToken.bind(new AuthController()),
			this.accCtrl.checkUser.bind(new AccountController()),
			this.limitCtrl.checkLimitLevelOne.bind(new LimitionController()),
			this.crsCtrl.getPagination.bind(new CourseController()),
			this.crsCtrl.getListRegistered.bind(new CourseController()));
		
		// get courses detail
		this.app.get(this.courseUrl.detail,
			this.authCtrl.checkOptionalApi.bind(new AuthController()),
			this.crsCtrl.getDetail.bind(new CourseController()))

		// get list member
		this.app.get(this.courseUrl.member,
			this.authCtrl.checkOptionalApi.bind(new AuthController()),
			this.crsCtrl.checkCourseExisted.bind(new CourseController()),
			this.crsCtrl.getPagination.bind(new CourseController()),
			this.crsCtrl.getListMember.bind(new CourseController()))
	}
}

module.exports = CourseRoute;
