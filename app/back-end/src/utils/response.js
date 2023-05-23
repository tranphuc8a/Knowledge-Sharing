class Response {

    static ResponseCode = {
        INFO: 100,
        OK: 200,
        BAD_REQUEST: 400,
        FILE_NOT_FOUND: 404,
        sERVER_ERROR: 500
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
}

module.exports = { Response };