const apiUrlConfig = require('../configs/api-url-config')
const AuthController = require('../controllers/auth-controller');
const LimitionController = require('../controllers/limition-controller');

class AuthRoute {
    constructor(app) {
        this.app = app;
        this.authcontroller = new AuthController();
        this.limitController = new LimitionController();
    }

    route() {
        // for testing
        this.app.post('/api/auth/test', (req, res, next) => {
            this.authcontroller.test(req, res, next);
        });
        // login
        this.app.post(apiUrlConfig.auth.login,
            this.authcontroller.login.bind(this.authcontroller));
        // validate
        this.app.post(apiUrlConfig.auth.validateToken,
            this.authcontroller.checkToken.bind(this.authcontroller),
            this.authcontroller.validateToken.bind(this.authcontroller));
        // refresh token
        this.app.post(apiUrlConfig.auth.refreshToken,
            this.authcontroller.refreshToken.bind(this.authcontroller))
        // logout
        this.app.post(apiUrlConfig.auth.logout,
            this.authcontroller.logout);
        // logoutAll
        this.app.post(apiUrlConfig.auth.logoutAll,
            this.authcontroller.logoutAll);
        // getRegisterCode
        this.app.post(apiUrlConfig.auth.getRegisterCode,
            this.authcontroller.getRegisterCode);
        // register
        this.app.post(apiUrlConfig.auth.register,
            this.authcontroller.register);
        // changePassword
        this.app.post(apiUrlConfig.auth.changePassword,
            this.authcontroller.checkToken.bind(this.authcontroller),
            this.limitController.checkLimitLevelOne.bind(this.limitController),
            this.authcontroller.changePassword.bind(this.authcontroller));
        // getForgotPassword code
        this.app.post(apiUrlConfig.auth.getForgotPasswordCode,
            this.authcontroller.getForgotPasswordCode);
        // forgotPassword
        this.app.post(apiUrlConfig.auth.forgotPassword,
            this.authcontroller.forgotPassword);
        // cancelAccount
        this.app.post(apiUrlConfig.auth.cancelAccount,
            this.authcontroller.cancelAccount);
    }

}

module.exports = AuthRoute;