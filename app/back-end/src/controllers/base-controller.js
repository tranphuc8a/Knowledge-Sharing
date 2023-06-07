const Response = require("../utils/response");


class BaseController{
    constructor(){}
    updateMiddleWare(req, res, next){
        this.req = req;
        this.res = res;
        this.next = next;
    }
    async getPagination(req, res, next){
        let { offset, length } = req.body;
        if (offset && length) req.pagination = {
            offset: offset,
            length: length
        };
        next();
    }
    response(responseCode = Response.ResponseCode.SERVER_ERROR, message = null, data = null, detail = null){
        Response.response(this.res, responseCode, message, data, detail);
    }
    success(message = "Success", data = null, detail = null){
        Response.success(this.res, message, data, detail);
    }
    info(message = "Info", data = null, detail = null){
        Response.info(this.res, message, data, detail);
    }
    badRequest(message = "Bad Request", data = null, detail = null){
        Response.badRequest(this.res, message, data, detail);
    }
    fileNotFound(message = "File Not Found", data = null, detail = null){
        Response.fileNotFound(this.res, message, data, detail);
    }
    serverError(message = "Error on Server", data = null, detail = null){
        Response.serverError(this.res, message, data, detail);
    }
}

module.exports = BaseController;
