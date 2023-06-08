const Follow = require("../models/follow");
const CoursesDAO = require("../services/dao/courses-dao");
const FollowDAO = require("../services/dao/follow-dao");
const LessonDAO = require("../services/dao/lesson-dao");
const ProfileDAO = require("../services/dao/profile-dao");
const Response = require("../utils/response");


class ProfileController {
    constructor() { }

    // update profile
    // Put api/profile
    // authorization: token
    /* 
    body: 
        name*
        avatar*
        dob*
        phone*
        gender*
        address*
        job*
        socialLink*
        description*
        visible* (visible: 0-private, 1-default, 2-public)
    */
    async updateProfile(req, res, next) {
        let profile = { ...req.body }
        try {
            // check empty body
            if (Object.keys(profile).length == 0) {
                return Response.response(res, Response.ResponseCode.BAD_REQUEST, "Empty body data");
            }

            // update to profile table
            let update = await ProfileDAO.getInstance().update(profile, { email: req.account.email });

            if (update == null) {
                return Response.response(res, Response.ResponseCode.SERVER_ERROR, "Server error");
            }

            if (update.affectedRows == 0) {
                return Response.response(res, Response.ResponseCode.BAD_REQUEST, "Nothing change from request");
            }

            // get profile for response
            let newProfile = await ProfileDAO.getInstance().select({ email: req.account.email });
            if (newProfile == null || newProfile.length == 0) {
                return Response.response(res, Response.ResponseCode.SERVER_ERROR, "Server error");
            }

            // response
            Response.response(res, Response.ResponseCode.OK, "Success", newProfile[0], "Cập nhật profile thành công");
        } catch (error) {
            console.log(error);
            return Response.response(res, Response.ResponseCode.SERVER_ERROR, "Server error");
        }
    }

    // Get api/profile/:email
    // authorization: token*
    async getProfile(req, res, next) {
        let { email } = req.params;
        try {
            // get profile from email
            let profile = await ProfileDAO.getInstance().select({ email: email });
            if (profile == null || profile.length == 0) {
                throw new Error('Can not get profile');
            }
            profile = profile[0];

            // get number followers and following
            let numFollowers, numFollowing = 0;
            let numFollowersPromise = FollowDAO.getInstance().getNumFollowers(email)
                .then(num => {
                    numFollowers = num;
                });
            let numFollowingPromise = FollowDAO.getInstance().getNumFollowing(email)
                .then(num => {
                    numFollowing = num;
                });

            // get number Lesson and Courses
            let numLesson, numCourses = 0;
            let numCoursesPromise = CoursesDAO.getInstance().getNumCourses(email)
                .then(num => {
                    numCourses = num;
                });
            let numLessonPromise = LessonDAO.getInstance().getNumLesson(email)
                .then(num => {
                    numLesson = num;
                });

            // await for promise
            await Promise.all([numFollowersPromise, numFollowingPromise, numCoursesPromise, numLessonPromise]);

            // check: get relation and relevant profile in instance of default (public) or following or myself
            let relation = Follow.Type.UNKNOWN;
            if (req.account != null) {
                relation = await FollowDAO.getInstance().getRelation(req.account.email, email);
            }

            if (relation == Follow.Type.FOLLOWING || relation == Follow.Type.BOTH) {
                // get follow profile
                profile = this.getFollowProfile(profile);
            } else if (relation != Follow.Type.MYSELF) {
                // get public profile (unknown or followed)
                profile = this.getPublicProfile(profile);
            } else {
                // get my profile ==> get full info
            }

            profile.numCourses = numCourses;
            profile.numLesson = numLesson;
            profile.numFollowers = numFollowers;
            profile.numFollowing = numFollowing;

            Response.response(res, Response.ResponseCode.OK, "Success", profile, "Get profile thành công");
        } catch (error) {
            console.log(error);
            return Response.response(res, Response.ResponseCode.SERVER_ERROR, "Server error");
        }
    }


    // for get public profile
    getPublicProfile(profile) {
        let visible = profile.visible;
        let visibleProfile = {
            email: profile.email,
            name: profile.name,
            avatar: profile.avatar
        };
        for (let i = 0; i < visible.length; i++) {
            if (visible[i] == 2) {
                switch (i) {
                    case 3:
                        visibleProfile.dob = profile.dob;
                        break;
                    case 4:
                        visibleProfile.phone = profile.phone;
                        break;
                    case 5:
                        visibleProfile.gender = profile.gender;
                        break;
                    case 6:
                        visibleProfile.address = profile.address;
                        break;
                    case 7:
                        visibleProfile.job = profile.job;
                        break;
                    case 8:
                        visibleProfile.social_link = profile.social_link;
                        break;
                    case 9:
                        visibleProfile.description = profile.description;
                        break;
                }
            }
        }

        return visibleProfile;
    }

    // for get default & public profile
    getFollowProfile(profile) {
        let visible = profile.visible;
        let visibleProfile = {
            email: profile.email,
            name: profile.name,
            avatar: profile.avatar
        };
        for (let i = 0; i < visible.length; i++) {
            if (visible[i] >= 1) {
                switch (i) {
                    case 3:
                        visibleProfile.dob = profile.dob;
                        break;
                    case 4:
                        visibleProfile.phone = profile.phone;
                        break;
                    case 5:
                        visibleProfile.gender = profile.gender;
                        break;
                    case 6:
                        visibleProfile.address = profile.address;
                        break;
                    case 7:
                        visibleProfile.job = profile.job;
                        break;
                    case 8:
                        visibleProfile.social_link = profile.social_link;
                        break;
                    case 9:
                        visibleProfile.description = profile.description;
                        break;
                }
            }
        }

        return visibleProfile;
    }
}

module.exports = ProfileController;