const Learn = require("../models/learn");
const CoursesDAO = require("../services/dao/courses-dao");
const LearnDAO = require("../services/dao/learn-dao");
const RequestDAO = require("../services/dao/request-dao");
const DateTime = require("../utils/datetime");
const Response = require("../utils/response");


class RequestController{
    constructor(){}

// middle ware:
    async checkRequestExisted(req, res, next){
        let request = await RequestDAO.getInstance().getById(req.params.requestid);
        if (request == null){
            return Response.response(res, Response.ResponseCode.BAD_REQUEST, "Request is not existed");
        }
        req.request = request;
        next();
    }

    // post api/courses/request/:courseid
	async request(req, res, next){
		let {account, course} = req;
		// check user is full courses:
		// ...
		// check user is in course:
		let learns = await LearnDAO.select({email: account.email, courses_id: course.knowledge_id});
		if (learns.length > 0) {
			return Res.response(res, Res.ResponseCode.INFO, null, "You are already in this course")
		}
		// check requested:
		let requests = await RequestDAO.select({
			leaner_email: account.email,
			courses_id: course.knowledge_id,
			type: 'request'
		});
		let result = null;
		if (requests.length > 0) {
			result = await RequestDAO.delete({
				learner_email: account.email,
				courses_id: course.knowledge_id,
				type: 'request'
			});
			if (result == null){
				return Res.response(Res.ResponseCode.SERVER_ERROR, null, "Unrequest failed");
			}
			return Res.response(res, Res.ResponseCode.OK, course, "Unrequest success");
		} else { 
			result = await RequestDAO.insert({
                owner_email: course.owner_email,
				learner_email: account.email,
				courses_id: course.knowledge_id,
				type: 'request',
                time: DateTime.now()
			});
			if (result == null){
				return Res.response(Res.ResponseCode.SERVER_ERROR, null, "Request failed");
			}
			return Res.response(res, Res.ResponseCode.OK, course, "Request success");
		}
	}

    // delete api/courses/request/:requestid
    async confirmRequest(req, res, next){
        let {account, request} = req;
        let type = Number(req.params.type);
        if (request.type != 'request'){
            return Response.response(res, Response.ResponseCode.BAD_REQUEST, "This is invite")
        }
        if (request.owner_email != account.email){
            return Response.response(res, Response.ResponseCode.BAD_REQUEST, "You are not owner")
        }

        let rs = await RequestDAO.delete(request);
        if (type == 0){ // reject request    
            return Response.response(res, Response.ResponseCode.OK, "You rejected this request")
        } else if (type == 1){ // accept request
            let course = await CoursesDAO.getById(request.courses_id);
            if (course == null)
                return Response.response(res, Response.ResponseCode.SERVER_ERROR, "Course is not existed");
            // add register
            let result = await LearnDAO.insert(new Learn({
                email: request.leaner_email,
                courses_id: course.knowledge_id,
                time: DateTime.now()
            }));
            return Response.response(res, Response.ResponseCode.OK, "User was added to course");
        }
        return Response.response(res, Response.ResponseCode.BAD_REQUEST, "type is not valid");
    }

    // post api/courses/invite/:courseid
    async invite(req, res, next){
		let {account, course, user} = req;
		// check user is full courses:
		// ...
		// check user is in course:
		let learns = await LearnDAO.select({email: user.email, courses_id: course.knowledge_id});
		if (learns.length > 0) {
			return Res.response(res, Res.ResponseCode.INFO, null, "User are already in your course")
		}
		// check requested:
		let requests = await RequestDAO.select({
			leaner_email: user.email,
			owner_email: account.email,
            courses_id: course.knowledge_id,
			type: 'invite'
		});
		let result = null;
		if (requests.length > 0) {
			result = await RequestDAO.delete({
				learner_email: user.email,
				courses_id: course.knowledge_id,
                owner_email: account.email,
				type: 'invite'
			});
			if (result == null){
				return Res.response(Res.ResponseCode.SERVER_ERROR, null, "Uninvite failed");
			}
			return Res.response(res, Res.ResponseCode.OK, course, "Uninvite success");
		} else { 
			result = await RequestDAO.insert({
                owner_email: account.email,
				learner_email: user.email,
				courses_id: course.knowledge_id,
				type: 'invite',
                time: DateTime.now()
			});
			if (result == null){
				return Res.response(Res.ResponseCode.SERVER_ERROR, null, "Invite failed");
			}
			return Res.response(res, Res.ResponseCode.OK, course, "Invite success");
		}
	}

    // delete api/courses/invite/:requestid
    async confirmInvite(req, res, next){
        let {account, request} = req;
        let type = Number(req.params.type);
        if (request.type != 'invite'){
            return Response.response(res, Response.ResponseCode.BAD_REQUEST, "This is not an invite")
        }
        if (request.leaner_email != account.email){
            return Response.response(res, Response.ResponseCode.BAD_REQUEST, "You are not owner of this invite")
        }

        let rs = await RequestDAO.delete(request);
        if (type == 0){ // reject invite    
            return Response.response(res, Response.ResponseCode.OK, "You rejected this invite")
        } else if (type == 1){ // accept invitie
            let course = await CoursesDAO.getById(request.courses_id);
            if (course == null)
                return Response.response(res, Response.ResponseCode.SERVER_ERROR, "Course is not existed");
            // add register
            let result = await LearnDAO.insert(new Learn({
                email: account.email,
                courses_id: course.knowledge_id,
                time: DateTime.now()
            }));
            return Response.response(res, Response.ResponseCode.OK, "You was added to this course");
        }
        return Response.response(res, Response.ResponseCode.BAD_REQUEST, "type is not valid");
    }

	// get api/courses/request/:coursesid*
	async getListRequest(req, res, next){
		let {account} = req;
		let {coursesid, offset, length} = req.params;
		let pagination = null;
		if (offset && length){
			pagination = {
				offset: offset, length: length
			}
		}

		if (coursesid == null){ // get list requesting
			let requests = await RequestDAO.getInstance().getDetailRequest({
				leaner_email: account.email
			}, ["id", "email", "name", "avatar", "courses_id", "thumbnail", "title", "request.time"], 
			pagination);
			return Response.response(res, Response.ResponseCode.OK, "Success", requests);
		} else { // get list requested of course
			let requests = await RequestDAO.getInstance().getDetailRequest({
				courses_id: coursesid
			}, ["id", "email", "name", "avatar", "courses_id", "thumbnail", "title", "request.time"], 
			pagination);
			return Response.response(res, Response.ResponseCode.OK, "Success", requests);
		}
	}

	// get api/courses/invite/:coursesid*
	async getListInvite(req, res, next){
		let {account} = req;
		let {coursesid, offset, length} = req.params;
		let pagination = null;
		if (offset && length){
			pagination = {
				offset: offset, length: length
			}
		}

		if (coursesid == null){ // get list invited
			let requests = await RequestDAO.getInstance().getDetailInvite({
				leaner_email: account.email
			}, ["id", "email", "name", "avatar", "courses_id", "thumbnail", "title", "request.time"], 
			pagination);
			return Response.response(res, Response.ResponseCode.OK, "Success", requests);
		} else { // get list requesting of a course
			let requests = await RequestDAO.getInstance().getDetailInvite({
				courses_id: coursesid
			}, ["id", "email", "name", "avatar", "courses_id", "thumbnail", "title", "request.time"], 
			pagination);
			return Response.response(res, Response.ResponseCode.OK, "Success", requests);
		}
	}
}

module.exports = RequestController;