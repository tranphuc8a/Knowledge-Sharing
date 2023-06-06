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
            if (newProfile == null) {
                return Response.response(res, Response.ResponseCode.SERVER_ERROR, "Server error");
            }

            // response
            Response.response(res, Response.ResponseCode.OK, "Success", newProfile, "Cập nhật profile thành công");
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
            
            // check: public/follow/myself

            Response.response(res, Response.ResponseCode.OK, "Success", null, "Get profile thành công");
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