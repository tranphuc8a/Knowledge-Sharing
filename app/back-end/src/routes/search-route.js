const url = require('../configs/api-url-config');
const AuthController = require('../controllers/auth-controller');
const SearchController = require('../controllers/search-controller');

class SearchRoute {
    constructor(app) {
        this.app = app;
        this.searchUrl = url.search;
        this.authController = new AuthController();
        this.searchController = new SearchController();
    }

    route() {
        // search account
        this.app.get(this.searchUrl.account,
            this.authController.checkOptionalApi.bind(this.authController),
            this.searchController.searchAccount.bind(this.searchController));

        // search courses
        this.app.get(this.searchUrl.courses,
            this.authController.checkOptionalApi.bind(this.authController),
            this.searchController.searchCourses.bind(this.searchController));

        // search lesson
        this.app.get(this.searchUrl.lesson,
            this.authController.checkOptionalApi.bind(this.authController),
            this.searchController.searchLesson.bind(this.searchController));
    }
}

module.exports = SearchRoute;