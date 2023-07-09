const CategoriesDAO = require("../services/dao/categories-dao");
const CoursesDAO = require("../services/dao/courses-dao");
const FollowDAO = require("../services/dao/follow-dao");
const LessonDAO = require("../services/dao/lesson-dao");
const ProfileDAO = require("../services/dao/profile-dao");
const Response = require("../utils/response");
const CourseController = require("./course-controller");
const KnowledgeController = require("./knowledge-controller");


class SearchController {
    constructor() {

    }

    // get api/search/account/:key?offset*=&length*=
    /*
    [(email, name, avatar, numfollowers, numcourses, numlesson, relation)]
    */
    async searchAccount(req, res, next) {
        let { key } = req.params;
        let listRes = [];
        let myEmail = null;
        let offset = req.query.offset || 0;
        let length = req.query.length || 10;
        let pagination = {
            offset: offset,
            length: length
        }
        if (req.account != null)
            myEmail = req.account.email;
        try {
            // check key
            if (key == null) {
                return Response.response(res, Response.ResponseCode.BAD_REQUEST, "Bad request", null, "Empty key");
            }

            if (key == '*') {
                key = '.';
            }

            // get list profile with email or name like key
            let listProfile = await ProfileDAO.getInstance().search(key, null, pagination);

            // get email, name, avatar, numfollowers, numcourses, numlesson, relation
            for (let profile of listProfile) {
                let { email, name, avatar } = profile;
                let numFollowers, numFollowing, numCourses, numLesson = 0;
                let relation = null;

                let relationPromise = null;
                // get relation
                if (myEmail != null) {
                    relationPromise = FollowDAO.getInstance().getRelation(myEmail, email)
                        .then(rel => {
                            if (rel == null) throw new Error('Error from get relation');
                            relation = rel;
                        });
                }

                // get number followers and following
                let numFollowersPromise = FollowDAO.getInstance().getNumFollowers(email)
                    .then(numFol => {
                        if (numFol == null) throw new Error('Error from get number followers');
                        numFollowers = numFol;
                    });
                let numFollowingPromise = FollowDAO.getInstance().getNumFollowing(email)
                    .then(num => {
                        numFollowing = num;
                    });

                // get number Lesson and Courses
                let numCoursesPromise = CoursesDAO.getInstance().getNumCourses(email)
                    .then(num => {
                        numCourses = num;
                    });
                let numLessonPromise = LessonDAO.getInstance().getNumLesson(email)
                    .then(num => {
                        numLesson = num;
                    });

                // execute all promise
                if (myEmail == null) {
                    await Promise.all([numFollowersPromise, numFollowingPromise, numCoursesPromise, numLessonPromise]);
                } else {
                    await Promise.all([relationPromise, numFollowersPromise, numFollowingPromise, numCoursesPromise, numLessonPromise]);
                }

                // add to result
                listRes.push({ email: email, avatar: avatar, name: name, numFollowers: numFollowers, numFollowing: numFollowing, numCourses: numCourses, numLesson: numLesson });
            }

            Response.response(res, Response.ResponseCode.OK, "Success", listRes, "Search account thành công");

        } catch (error) {
            console.log(error);
            Response.response(res, Response.ResponseCode.SERVER_ERROR, "Server error");
        }
    }

    isSubset(subset, superset) {
        return subset.every(item => superset.includes(item));
    }

    //get api/search/courses?key*=&categories*=&offset*=&length*=
    // token*
    async searchCourses(req, res, next) {
        let key = req.query.key || null;
        let categories = req.query.categories || null;
        let offset = req.query.offset || 0;
        let length = req.query.length || 10;
        let account = req.account;
        let pagination = {
            offset: offset,
            length: length
        }

        let listRes = [];
        try {
            if (categories != null)
                categories = categories.split(",");
            listRes = await CoursesDAO.getInstance().search(key, categories, null, pagination);

            if (account != null) {
                let knowledgeController = new KnowledgeController();
                let coursesController = new CourseController();
                await Promise.all([knowledgeController.updateInforListKnowledge(account, listRes),
                coursesController.updateInforListCourses(account, listRes)]);
            }

            Response.response(res, Response.ResponseCode.OK, "Success", listRes, "Search courses thành công");

        } catch (error) {
            console.log(error);
            Response.response(res, Response.ResponseCode.SERVER_ERROR, "Server error");
        }
    }

    //get api/search/lesson?key*=&categories*=&offset*=&length*=
    // token*
    async searchLesson(req, res, next) {
        let key = req.query.key || null;
        let categories = req.query.categories || null;
        let offset = req.query.offset || 0;
        let length = req.query.length || 10;
        let account = req.account;
        let pagination = {
            offset: offset,
            length: length
        }

        let listRes = [];
        try {
            if (categories != null)
                categories = categories.split(",");
            listRes = await LessonDAO.getInstance().search(key, categories, null, pagination);

            if (account != null) {
                let knowledgeController = new KnowledgeController();
                await Promise.all([knowledgeController.updateInforListKnowledge(account, listRes)]);
            }

            Response.response(res, Response.ResponseCode.OK, "Success", listRes, "Search lesson thành công");

        } catch (error) {
            console.log(error);
            Response.response(res, Response.ResponseCode.SERVER_ERROR, "Server error");
        }
    }

}

module.exports = SearchController;