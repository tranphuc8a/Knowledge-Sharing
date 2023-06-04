const AuthRoute = require('./auth-route');
const LessonRoute = require('./lesson-route');
const CourseRoute = require('./course-route');
const ProfileRoute = require('./profile-route');

class Route {
    constructor(app) {
        this.app = app;
        this.authRoute = new AuthRoute(app);
        this.lessonRoute = new LessonRoute(app);
        this.courseRoute = new CourseRoute(app);
        this.profileRoute = new ProfileRoute(app);
    }

    route() {
        this.authRoute.route();
        this.lessonRoute.route();
        this.courseRoute.route();
        this.profileRoute.route();
    }
}

module.exports = Route;