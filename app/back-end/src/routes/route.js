const AuthRoute = require('./auth-route')

class Route {
    constructor(app) {
        this.app = app;
        this.authRoute = new AuthRoute(app);
    }

    route() {
        this.authRoute.route();
    }
}

module.exports = Route;