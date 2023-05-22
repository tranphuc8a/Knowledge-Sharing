const AuthRoute = require('./auth-route');
const LessonRoute = require('./lesson-route');

class Route {
    constructor(app) {
        this.app = app;
        this.authRoute = new AuthRoute(app);
        this.lessonRoute = new LessonRoute(app);
    }

    route() {
        this.authRoute.route();
        this.lessonRoute.route();
    }
}

module.exports = Route;