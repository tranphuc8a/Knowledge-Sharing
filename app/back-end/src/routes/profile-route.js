const url = require('../configs/api-url-config');
const AuthController = require('../controllers/auth-controller');
const ProfileController = require('../controllers/profile-controller');

class ProfileRoute {
    constructor(app) {
        this.app = app;
        this.profileUrl = url.profile;
        this.authController = new AuthController();
        this.profileController = new ProfileController();
    }

    route() {
        // update profile
        this.app.put(this.profileUrl.update,
            this.authController.checkToken.bind(this.authController),
            this.profileController.updateProfile.bind(this.profileController));
        // get profile
        this.app.get(this.profileUrl.get,
            this.authController.checkOptionalApi.bind(this.authController),
            this.profileController.getProfile.bind(this.profileController));
    }
}

module.exports = ProfileRoute;