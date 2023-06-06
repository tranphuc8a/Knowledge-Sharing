const url = require('../configs/api-url-config');
const AuthController = require('../controllers/auth-controller');
const FollowController = require('../controllers/follow-controller');

class FollowRoute {
    constructor(app) {
        this.app = app;
        this.followUrl = url.follow;
        this.authController = new AuthController();
        this.followController = new FollowController();
    }

    route() {
        // add follow
        this.app.post(this.followUrl.crud,
            this.authController.checkToken,
            this.followController.checkExistedFollow.bind(this.followController),
            this.followController.addFollow.bind(this.followController));
        // delete follow
        this.app.delete(this.followUrl.crud,
            this.authController.checkToken,
            this.followController.checkUnexistedFollow.bind(this.followController),
            this.followController.deleteFollow.bind(this.followController));
        // get follow
        this.app.get(this.followUrl.get,
            this.followController.getFollow.bind(this.followController));
    }
}

module.exports = FollowRoute;