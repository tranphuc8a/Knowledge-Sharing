const Follow = require("../models/follow");
const FollowDAO = require("../services/dao/follow-dao");
const DateTime = require("../utils/datetime");
const Response = require("../utils/response");


class FollowController {
    constructor() { }

    // middle ware

    // check if follow is existed
    async checkExistedFollow(req, res, next) {
        let exist = await FollowDAO.getInstance().select({ following: req.account.email, followed: req.body.followedEmail });
        if (exist != null && exist.length > 0) {
            return Response.response(res, Response.ResponseCode.BAD_REQUEST, "Existed follow");
        }
        next();
    }

    // check if follow is unExisted
    async checkUnexistedFollow(req, res, next) {
        let exist = await FollowDAO.getInstance().select({ following: req.account.email, followed: req.body.followedEmail });
        if (exist == null || exist.length == 0) {
            return Response.response(res, Response.ResponseCode.BAD_REQUEST, "Existed follow");
        }
        req.follow = exist[0];
        next();
    }

    // end point

    // Post api/follow
    // authorization: token
    // body: followedEmail
    async addFollow(req, res, next) {
        let { followedEmail } = req.body;

        // add follow into follow table
        let insert = await FollowDAO.getInstance().insert({ following: req.account.email, followed: followedEmail, time: DateTime.now() });
        if (insert == null) {
            return Response.response(res, Response.ResponseCode.BAD_REQUEST, "Un-existed user");
        }

        // response
        Response.response(res, Response.ResponseCode.OK, "Success", null, "Follow thành công");
    }

    // Delete api/follow
    // authorization: token
    // body: followedEmail
    async deleteFollow(req, res, next) {
        // delete in follow table
        let del = await FollowDAO.getInstance().delete({ following: req.account.email, followed: req.body.followedEmail });
        if (del == null) {
            return Response.response(res, Response.ResponseCode.SERVER_ERROR, "Server error");
        }

        // response
        Response.response(res, Response.ResponseCode.OK, "Success", null, "Unfollow thành công");
    }

    // Get api/follow/:email/:index?offset*=,length*=
    // note: index = 0: get followers, = 1: get following
    async getFollow(req, res, next) {
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
        let listRelation = [];

        // get list email
        if (index == 0) {
            // get list follower
            listEmail = await FollowDAO.getInstance().select({ following: email }, ['followed'], pagination);
        } else {
            // get list following
            listEmail = await FollowDAO.getInstance().select({ followed: email }, ['following'], pagination);
        }

        // get relation
        if (myEmail != null) {
            listEmail.forEach(email => {
                
            });
        }

        // get followers


        // name, avatar
    }


    // inner function
    async getRelation(objectiveEmail, email) {
        let relation = Follow.Type.UNKNOWN;
        let following = false;
        let followed = false;

        // check following
        let followingPromise = FollowDAO.getInstance().select({ following: objectiveEmail, followed: email })
            .then(follow => {
                if (follow != null && follow.length > 0) {
                    following = true;
                }
            });

        // check followed
        let followedPromise = FollowDAO.getInstance().select({ following: email, followed: objectiveEmail })
            .then(follow => {
                if (follow != null && follow.length > 0) {
                    followed = true;
                }
            });;

        await Promise.all([followingPromise, followedPromise]);

        // return
        if (following && followed) return Follow.Type.BOTH;
        if (following) return Follow.Type.FOLLOWING;
        if (followed) return Follow.Type.FOLLOWED;
        return Follow.Type.UNKNOWN;
    }

}

module.exports = FollowController;