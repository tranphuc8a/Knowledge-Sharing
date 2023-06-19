const apiUrlConfig = require("../configs/api-url-config");
const AccountController = require("../controllers/account-controller");
const AdminController = require("../controllers/admin-controller");
const AuthController = require("../controllers/auth-controller");
const LimitionController = require("../controllers/limition-controller");


class AdminRoute{
    constructor(app){
        this.app = app;
        this.url = apiUrlConfig.admin;
        this.authCtrl = new AuthController();
        this.accCtrl = new AccountController();
        this.lmtCtrl = new LimitionController();
        this.adminCtrl = new AdminController();
    }
    route(){

        // limit account
        this.app.patch(this.url.limit,
            this.authCtrl.checkToken.bind(this.authCtrl),
            this.accCtrl.checkAdmin.bind(this.accCtrl),
            this.lmtCtrl.checkLimitLevelZero.bind(this.lmtCtrl),
            this.adminCtrl.checkAccountExisted.bind(this.adminCtrl),
            this.adminCtrl.limitAccount.bind(this.adminCtrl));

        // get list account
        this.app.get(this.url.listAccount,
            this.authCtrl.checkToken.bind(this.authCtrl),
            this.accCtrl.checkAdmin.bind(this.accCtrl),
            this.lmtCtrl.checkLimitLevelZero.bind(this.lmtCtrl),
            this.adminCtrl.getPagination.bind(this.adminCtrl),
            this.adminCtrl.getListAccount.bind(this.adminCtrl)
            )

        // delete account
        // this.app.delete(this.url.deleteAccount,
        //     this.authCtrl.checkToken.bind(this.authCtrl),
        //     this.accCtrl.checkAdmin.bind(this.accCtrl),
        //     this.lmtCtrl.checkLimitLevelZero.bind(this.lmtCtrl),
        //     this.adminCtrl.checkAccountExisted.bind(this.adminCtrl),
        //     this.adminCtrl.deleteAccount.bind(this.adminCtrl));

        // delete course
        this.app.delete(this.url.deleteCourse,
            this.authCtrl.checkToken.bind(this.authCtrl),
            this.accCtrl.checkAdmin.bind(this.accCtrl),
            this.lmtCtrl.checkLimitLevelZero.bind(this.lmtCtrl),
            this.adminCtrl.checkCourseExisted.bind(this.adminCtrl),
            this.adminCtrl.deleteCourse.bind(this.adminCtrl));

        // delete lesson
        this.app.delete(this.url.deleteLesson,
            this.authCtrl.checkToken.bind(this.authCtrl),
            this.accCtrl.checkAdmin.bind(this.accCtrl),
            this.lmtCtrl.checkLimitLevelZero.bind(this.lmtCtrl),
            this.adminCtrl.checkLessonExisted.bind(this.adminCtrl),
            this.adminCtrl.deleteLesson.bind(this.adminCtrl));
        
        // add admin
        this.app.post(this.url.addAdmin,
            this.authCtrl.checkToken.bind(this.authCtrl),
            this.accCtrl.checkAdmin.bind(this.accCtrl),
            this.lmtCtrl.checkLimitLevelZero.bind(this.lmtCtrl),
            this.adminCtrl.addAdmin.bind(this.adminCtrl))
    }
}

module.exports = AdminRoute;
