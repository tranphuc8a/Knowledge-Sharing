const Follow = require("../models/follow");
const FollowDAO = require("../services/dao/follow-dao");
const ProfileDAO = require("../services/dao/profile-dao");
const DateTime = require("../utils/datetime");
const Response = require("../utils/response");


class FollowController {
    constructor() { }

    // middle ware

    // check if follow is existed
    async checkExistedFollow(req, res, next) {
        try {
            let exist = await FollowDAO.getInstance().select({ following: req.account.email, followed: req.body.followedEmail });
            if (exist != null && exist.length > 0) {
                return Response.response(res, Response.ResponseCode.BAD_REQUEST, "Existed follow");
            }
            return next();
        } catch (error) {
            console.log(error);
            Response.response(res, Response.ResponseCode.SERVER_ERROR, "Server error");
        }
    }

    // check if follow is unExisted
    async checkUnexistedFollow(req, res, next) {
        try {
            let exist = await FollowDAO.getInstance().select({ following: req.account.email, followed: req.body.followedEmail });
            if (exist == null || exist.length == 0) {
                return Response.response(res, Response.ResponseCode.BAD_REQUEST, "Unexisted follow");
            }
            req.follow = exist[0];
            return next();
        } catch (error) {
            console.log(error);
            Response.response(res, Response.ResponseCode.SERVER_ERROR, "Server error");
        }

    }

    // end point

    // Post api/follow
    // authorization: token
    // body: followedEmail
    async addFollow(req, res, next) {
        let { followedEmail } = req.body;

        try {
            // add follow into follow table
            let insert = await FollowDAO.getInstance().insert({ following: req.account.email, followed: followedEmail, time: DateTime.now() });
            if (insert == null) {
                return Response.response(res, Response.ResponseCode.BAD_REQUEST, "Un-existed user");
            }

            // response
            Response.response(res, Response.ResponseCode.OK, "Success", null, "Follow thành công");
        } catch (error) {
            console.log(error);
            Response.response(res, Response.ResponseCode.SERVER_ERROR, "Server error");
        }

    }

    // Delete api/follow
    // authorization: token
    // body: followedEmail
    async deleteFollow(req, res, next) {
        try {
            // delete in follow table
            let del = await FollowDAO.getInstance().delete({ following: req.account.email, followed: req.body.followedEmail });
            if (del == null) {
                return Response.response(res, Response.ResponseCode.SERVER_ERROR, "Server error");
            }

            // response
            Response.response(res, Response.ResponseCode.OK, "Success", null, "Unfollow thành công");
        } catch (error) {
            console.log(error);
            Response.response(res, Response.ResponseCode.SERVER_ERROR, "Server error");
        }

    }

    // Get api/follow/:email/:index?myEmail=,offset*=,length*=
    // note: index = 0: get followers, = 1: get following
    async getFollow(req, res, next) {
        try {
            let { email, index } = req.params;
            let offset = req.query.offset || 0;
            let length = req.query.length || 10;
            let myEmail = req.query.myEmail;
            let pagination = {
                offset: offset,
                length: length
            }
            let listRes = [];
            let listEmail = [];

            // get list email
            if (index == 0) {
                // get list follower
                listEmail = await FollowDAO.getInstance().select({ following: email }, ['followed'], pagination);
                listEmail = listEmail.map(follow => follow.followed);
            } else {
                // get list following
                listEmail = await FollowDAO.getInstance().select({ followed: email }, ['following'], pagination);
                listEmail = listEmail.map(follow => follow.following);
            }

            // get other fields from email
            for (let email of listEmail) {
                let relation, numFollowers, profile = null;

                let relationPromise = null;
                // get relation
                if (myEmail != null) {
                    relationPromise = FollowDAO.getInstance().getRelation(myEmail, email)
                        .then(rel => {
                            if (rel == null) throw new Error('Error from get relation');
                            relation = rel;
                        });
                }

                // get number followers
                let numFollowersPromise = FollowDAO.getInstance().getNumFollowers(email)
                    .then(numFol => {
                        if (numFol == null) throw new Error('Error from get number followers');
                        numFollowers = numFol;
                    });
                // get profile
                let profilePromise = ProfileDAO.getInstance().select({ email: email })
                    .then(prof => {
                        if (prof == null || prof[0] == null) throw new Error('Error from get profile');
                        profile = prof[0];
                    });

                try {
                    if (relationPromise != null)
                        await Promise.all([relationPromise, numFollowersPromise, profilePromise]);
                    else
                        await Promise.all([numFollowersPromise, profilePromise]);
                } catch (error) {
                    console.log(error);
                    return Response.response(res, Response.ResponseCode.SERVER_ERROR, "Server error");
                }

                // push to result
                listRes.push({ email: email, name: profile.name, avatar: profile.avatar, followers: numFollowers, relation: relation });
            }

            Response.response(res, Response.ResponseCode.OK, "success", listRes, "Get list follow thành công");
        } catch (error) {
            console.log(error);
            Response.response(res, Response.ResponseCode.SERVER_ERROR, "Server error");
        }

    }


}

module.exports = FollowController;