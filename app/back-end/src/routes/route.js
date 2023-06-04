const AuthRoute = require('./auth-route');
const LessonRoute = require('./lesson-route');
const CourseRoute = require('./course-route');
const ProfileRoute = require('./profile-route');
const KnowledgeRoute = require('./knowledge-route');

class Route {
        constructor(app) {
                this.app = app;
                this.authRoute = new AuthRoute(app);
                this.lessonRoute = new LessonRoute(app);
                this.courseRoute = new CourseRoute(app);
                this.profileRoute = new ProfileRoute(app);
                this.knowledgeRoute = new KnowledgeRoute(app);
        }

        route() {
                this.authRoute.route();
                this.lessonRoute.route();
                this.courseRoute.route();
                this.profileRoute.route();
                this.knowledgeRoute.route();
        }
}

module.exports = Route;