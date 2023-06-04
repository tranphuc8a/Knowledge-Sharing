class Response {

    static ResponseCode = {
        INFO: 100,
        OK: 200,
        BAD_REQUEST: 400,
        FILE_NOT_FOUND: 404,
        SERVER_ERROR: 500
    }

    static response(res, code, message = null, data = null, detail = null) {
        let responseData = {
            "code": code,
            "message": message
        };
        if (message != null) responseData.message = message;
        if (data != null) responseData.data = data;
        if (detail != null) responseData.detail = detail;
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json(responseData);
    }

    static success(res, message = null, data = null, detail = null){
        return Response.response(res, Response.ResponseCode.OK, message, data, detail);
    }

    static info(res, message = null, data = null, detail = null){
        return Response.response(res, Response.ResponseCode.INFO, message, data, detail);
    }

    static badRequest(res, message = null, data = null, detail = null){
        return Response.response(res, Response.ResponseCode.BAD_REQUEST, message, data, detail);
    }

    static fileNotFound(res, message = null, data = null, detail = null){
        return Response.response(res, Response.ResponseCode.FILE_NOT_FOUND, message, data, detail);
    }

    static serverError(res, message = null, data = null, detail = null){
        return Response.response(res, Response.ResponseCode.SERVER_ERROR, message, data, detail);
    }
}

module.exports = Response;