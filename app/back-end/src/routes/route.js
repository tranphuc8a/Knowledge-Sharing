const AuthRoute = require('./auth-route');
const LessonRoute = require('./lesson-route');
const CourseRoute = require('./course-route');
const ProfileRoute = require('./profile-route');
const KnowledgeRoute = require('./knowledge-route');
const FollowRoute = require('./follow-route');
const AdminRoute = require('./admin-route');

class Route {
        constructor(app) {
                this.app = app;
                this.authRoute = new AuthRoute(app);
                this.lessonRoute = new LessonRoute(app);
                this.courseRoute = new CourseRoute(app);
                this.profileRoute = new ProfileRoute(app);
                this.followRoute = new FollowRoute(app);
                this.knowledgeRoute = new KnowledgeRoute(app);
                this.adminRoute = new AdminRoute(app);
        }

        route() {
                this.authRoute.route();
                this.lessonRoute.route();
                this.courseRoute.route();
                this.profileRoute.route();
                this.followRoute.route();
                this.knowledgeRoute.route();
                this.adminRoute.route();
        }
}

module.exports = Route;