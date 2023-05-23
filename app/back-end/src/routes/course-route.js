
var url = require('../configs/api-url-config');
var CourseController = require('../controllers/course-controller');
var AuthController = require('../controllers/auth-controller');
var LimitionController = require('../controllers/limition-controller')
var AccountController = require('../controllers/account-controller')

class CourseRoute {
	constructor(app){
		this.app = app;
		this.courseUrl = url.course;
		this.authCtrl = new AuthController();
		this.crsCtrl = new CourseController();
		this.limitCtrl = new LimitionController();
		this.accCtrl = new AccountController();
	}
	route(){
		console.log("route");
		this.app.post(this.courseUrl.register, 
			this.authCtrl.checkToken,
			this.accCtrl.checkUser,
			this.limitCtrl.checkLimitLevelZero,
			this.crsCtrl.freeCourseRegister
		);
	}
}

module.exports = CourseRoute;
