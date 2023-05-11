const apiUrlConfig = require('../configs/api-url-config')
const AuthController = require('../controllers/auth-controller')

class AuthRoute {
    constructor(app) {
        this.app = app;
        this.authcontroller = new AuthController();
    }

    route() {
        this.app.get(apiUrlConfig.auth.login, (req, res, next) => {
            this.authcontroller.login(req, res, next);
        });

        this.app.get(apiUrlConfig.auth.accounts, (req, res, next) => {
            this.authcontroller.getListAccount(req, res, next);
        })
    }

}

module.exports = AuthRoute;