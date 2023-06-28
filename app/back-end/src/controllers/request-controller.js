const Learn = require("../models/learn");
const Request = require("../models/request");
const CoursesDAO = require("../services/dao/courses-dao");
const LearnDAO = require("../services/dao/learn-dao");
const RequestDAO = require("../services/dao/request-dao");
const DateTime = require("../utils/datetime");
const Response = require("../utils/response");
const BaseController = require("./base-controller");


class RequestController extends BaseController{
    constructor(){
		super();
	}

// middle ware:
    async checkRequestExisted(req, res, next){
		try{
			this.updateMiddleWare(req, res, next)
			let request = await RequestDAO.getInstance().getById(req.params.requestid);
			if (request == null)
				return this.badRequest("Request is not existed");
			req.request = request;
			next();
		} catch(e){
			console.log(e);
			return this.serverError(e);
		}
    }

    // post api/courses/request/:courseid
	// header: token
	async request(req, res, next){
		try {
			this.updateMiddleWare(req, res, next)
			let {account, course} = req;
			// check user is full courses:
			// ...
			// check user is in course:
			let learns = await LearnDAO.getInstance().select({email: account.email, courses_id: course.knowledge_id});
			if (learns.length > 0) {
				return this.info("You are already in this course")
			}
			// check requested:
			let requests = await RequestDAO.getInstance().select({
				learner_email: account.email,
				courses_id: course.knowledge_id,
				type: 'request'
			});
			let result = null;

			if (requests && requests.length > 0) { // unrquest
				result = await RequestDAO.getInstance().delete({
					learner_email: account.email,
					courses_id: course.knowledge_id,
					type: 'request'
				});
				if (result == null) return this.serverError("Unrequest failed");
				return this.success("Unrequest success", course);
			} else {  // add request
				let request = new Request({
					owner_email: course.owner_email,
					learner_email: account.email,
					courses_id: course.knowledge_id,
					type: 'request',
					time: DateTime.now()
				});
				
				result = await RequestDAO.getInstance().insert(request);
				if (result == null) return this.serverError("Request failed");
				return this.success("Request success", result);
			}
		} catch(e){
			console.log(e);
			return this.serverError(e);
		}
	}

    // delete api/courses/request/:requestid
	// header: token
	// body: type (0/1)
    async confirmRequest(req, res, next){
		try {
			this.updateMiddleWare(req, res, next)
			let {account, request} = req;
			let type = Number(req.body.type);
			if (type != 0 && type != 1)
				return this.badRequest("Type is not valid");
			if (request.type != 'request')
				return this.badRequest("This is invite")
			if (request.owner_email != account.email)
				return this.badRequest("You are not owner")

			let rs = await RequestDAO.getInstance().delete(request);
			if (type == 0){ // reject request    
				return this.success("You rejected this request")
			} else if (type == 1){ // accept request
				let course = await CoursesDAO.getInstance().getById(request.courses_id);
				if (course == null)
					return this.serverError("Course is not existed");
				// add register
				let result = await LearnDAO.getInstance().insert(new Learn({
					email: request.learner_email,
					courses_id: course.knowledge_id,
					time: DateTime.now()
				}));
				if (result == null) return this.serverError("Failed");
				return this.success("User was added to course");
			}
			return this.serverError("Pass if else");
		} catch(e){
			console.log(e);
			return this.serverError(e);
		}
    }

    // post api/courses/invite/:courseid
	// header: token
    async invite(req, res, next){
		try {
			this.updateMiddleWare(req, res, next)
			let {account, course, user} = req;
			// check user is full courses:
			// ...
			// check user is in course:
			let learns = await LearnDAO.getInstance().select({email: user.email, courses_id: course.knowledge_id});
			if (learns.length > 0) 
				return this.info("User are already in your course");

			// check requested:
			let requests = await RequestDAO.getInstance().select({
				learner_email: user.email,
				owner_email: account.email,
				courses_id: course.knowledge_id,
				type: 'invite'
			});
			let result = null;
			if (requests && requests.length > 0) { // delete invite
				result = await RequestDAO.getInstance().delete({
					learner_email: user.email,
					courses_id: course.knowledge_id,
					owner_email: account.email,
					type: 'invite'
				});
				if (result == null)	return this.serverError("Uninvite failed");
				return this.success("Uninvite success", course);
			} else { 	// invite
				result = await RequestDAO.getInstance().insert({
					owner_email: account.email,
					learner_email: user.email,
					courses_id: course.knowledge_id,
					type: 'invite',
					time: DateTime.now()
				});
				if (result == null) return this.serverError("Invite failed");
				return this.success("Invite success", result);
			}
		} catch(e){
			console.log(e);
			return this.serverError(e);
		}
	}

    // delete api/courses/invite/:requestid
	// header: token
	// body: type (0/1)
    async confirmInvite(req, res, next){
		try {
			this.updateMiddleWare(req, res, next)
			let {account, request} = req;
			let type = Number(req.body.type);
			if (type != 0 && type != 1)
				return this.badRequest("type is not valid");
			if (request.type != 'invite')
				return this.badRequest("This is not an invite")
			if (request.learner_email != account.email)
				return this.badRequest("You are not owner of this invite")

			let rs = await RequestDAO.getInstance().delete(request);
			if (type == 0){ // reject invite    
				return this.success("You rejected this invite")
			} else if (type == 1){ // accept invitie
				let course = await CoursesDAO.getInstance().getById(request.courses_id);
				if (course == null)
					return this.serverError("Course is not existed");
				// add register
				let result = await LearnDAO.getInstance().insert(new Learn({
					email: account.email,
					courses_id: course.knowledge_id,
					time: DateTime.now()
				}));
				return this.success("You was added to this course");
			}
			return this.badRequest("type is not valid");
		} catch(e){
			console.log(e);
			return this.serverError(e);
		}
    }

	// get api/courses/request?courseid*=
	// header: token
	/**
		body: offset*, length*
	 */
	async getListRequest(req, res, next){
		try{
			this.updateMiddleWare(req, res, next)
			let {account} = req;
			let {courseid} = req.query;
			let {offset, length} = req.body;
			let pagination = null;
			if (offset && length){
				pagination = {
					offset: offset, length: length
				}
			}

			if (courseid == null){ // get list requesting
				let requests = await RequestDAO.getInstance().selectDetailRequest({
					learner_email: account.email
				}, ["request.id as id", "email", "name", "avatar", "courses_id", "thumbnail", "title", "type", "request.time as time"], 
				pagination);
				return this.success("Success", requests);
			} else { // get list requested of course
				// check course exist and account is owner of course
				let course = await CoursesDAO.getInstance().getById(courseid);
				if (course == null) return this.badRequest("Course is not exist");
				if (course.owner_email != account.email)
					return this.badRequest("Not permission");

				let requests = await RequestDAO.getInstance().selectDetailRequest({
					courses_id: courseid
				}, ["request.id as id", "email", "name", "avatar", "courses_id", "thumbnail", "title", "type", "request.time as time"], 
				pagination);

				if (requests == null) return this.serverError();
				return this.success("Success", requests);
			}
		} catch(e){
			console.log(e);
			return this.serverError(e);
		}
	}

	// get api/courses/invite?courseid*=
	// header: token
	// body: offet*, length*
	async getListInvite(req, res, next){
		try{	
			this.updateMiddleWare(req, res, next)
			let {account} = req;
			let {courseid} = req.query;
			let {offset, length} = req.body;
			let pagination = null;
			if (offset && length){
				pagination = {
					offset: offset, length: length
				}
			}

			if (courseid == null){ // get list invited
				let requests = await RequestDAO.getInstance().selectDetailInvite({
					learner_email: account.email
				}, ["request.id as id", "email", "name", "avatar", "courses_id", "thumbnail", "type", "title", "request.time as time"], 
				pagination);
				return this.success("Success", requests);
			} else { // get list inviting of a course
				// check course exist and account is owner of course
				let course = await CoursesDAO.getInstance().getById(courseid);
				if (course == null) return this.badRequest("Course is not exist");
				if (course.owner_email != account.email)
					return this.badRequest("Not permission");
					
				let requests = await RequestDAO.getInstance().selectDetailInvite({
					courses_id: courseid
				}, ["request.id as id", "email", "name", "avatar", "courses_id", "thumbnail", "type", "title", "request.time as time"], 
				pagination);
				if (requests == null) return this.serverError();
				return this.success("Success", requests);
			}
		} catch(e){
			console.log(e);
			return this.serverError(e);
		}
	}
}

module.exports = RequestController;