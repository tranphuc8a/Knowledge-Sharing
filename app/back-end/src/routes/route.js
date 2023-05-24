const AuthRoute = require('./auth-route');
const LessonRoute = require('./lesson-route');
const CourseRoute = require('./course-route')

class Route {
    constructor(app) {
        this.app = app;
        this.authRoute = new AuthRoute(app);
        this.lessonRoute = new LessonRoute(app);
        this.courseRoute = new CourseRoute(app);
    }

    route() {
        this.authRoute.route();
        this.lessonRoute.route();
        this.courseRoute.route();
    }
}

module.exports = Route;