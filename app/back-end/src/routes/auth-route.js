const apiUrlConfig = require('../configs/api-url-config')
const AuthController = require('../controllers/auth-controller')

class AuthRoute {
    constructor(app) {
        this.app = app;
        this.authcontroller = new AuthController();
    }

    route() {
        // for testing
        this.app.post('/api/auth/test', (req, res, next) => {
            this.authcontroller.test(req, res, next);
        });
        // login
        this.app.post(apiUrlConfig.auth.login, (req, res, next) => {
            this.authcontroller.login(req, res, next);
        });
        // validate
        this.app.post(apiUrlConfig.auth.validateToken,
            this.authcontroller.checkToken,
            this.authcontroller.validateToken);
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
            this.authcontroller.checkToken,
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