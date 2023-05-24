const AccountDAO = require("../services/dao/account-dao");
const jwt = require("jsonwebtoken");
const Response = require("../utils/response");
const secretConfig = require("../configs/secret-config");
const LoginDAO = require("../services/dao/login-dao");
const DateTime = require("../utils/datetime");

class AuthController {
    constructor() {

    }

    // just for test
    async test(req, res, next) {
        this.checkPassword(req, res, next);
    }

    // login
    async login(req, res, next) {
        const { email, password } = req.body;

        // check payload
        if (email == undefined || password == undefined) {
            Response.response(res, Response.ResponseCode.BAD_REQUEST, "Bad request", req.body, "Payload không hợp lệ");
            return;
        }

        // check having account
        let account = await AccountDAO.getInstance().getById(email);
        if (account == null) {
            Response.response(res, Response.ResponseCode.BAD_REQUEST, "Bad request", req.body, "Tài khoản không chính xác");
            return;
        }
        if (account.password != password) {
            Response.response(res, Response.ResponseCode.BAD_REQUEST, "Bad request", req.body, "Tài khoản hoặc mật khẩu không chính xác");
            return;
        }

        // create token & refresh token
        let accessToken = this.createAccessToken(email);
        let refreshToken = this.createRefreshToken(email);

        // save token & refresh token to login table
        let mLogin = LoginDAO.getInstance().insert({ email: email, token: accessToken, refresh_token: refreshToken, time: DateTime.now() });
        if (mLogin == null) {
            Response.response(res, Response.ResponseCode.SERVER_ERROR, "Server error", req.body, "Lỗi khi lưu accessToken & refreshToken");
            return;
        }

        // remove password and add token & refresh token to the reponse for user
        delete account.password;
        account.token = accessToken;
        account.refresh_token = refreshToken;

        Response.response(res, Response.ResponseCode.OK, "Success", account, "Thành công");
    }

    // validate token
    // <== call middleware checktoken before
    async validateToken(req, res, next) {
        Response.response(res, Response.ResponseCode.OK, "Success", req.decoded, "Token hợp lệ");
    }


    /* 
    middle ware
    */

    // check token - token will be got at authorization in header
    async checkToken(req, res, next) {
        // get from header
        const token = req.headers.authorization;

        // check null
        if (!token) {
            return Response.response(res, Response.ResponseCode.BAD_REQUEST, "Token null", token, "Không nhận được token");
        }

        try {
            // verify token
            const decoded = jwt.verify(token, secretConfig.accessTokenKey);

            // add info decoded infor into req for using in next, sample: { email: 'tieptd1@gmail.com', iat: 1684944374, exp: 1684944434 }
            req.decoded = decoded;

            // go next
            next();
        } catch (error) {
            // expired time
            if (error instanceof jwt.TokenExpiredError) {
                return Response.response(res, Response.ResponseCode.BAD_REQUEST, "Expired token", token, "Token đã hết hạn");
            }
            // other case of getting token failed
            return Response.response(res, Response.ResponseCode.BAD_REQUEST, "Invalid token", token, "Token không đúng");
        }
    }

    async checkPassword(req, res, next) {
        let { email, password } = req.body;

        let account = await AccountDAO.getInstance().select({ email: email, password: password });

        if (account == null || account[0].email == null || account[0].password == null) {
            return Response.response(res, Response.ResponseCode.BAD_REQUEST, "Wrong password", password, "Mật khẩu không chính xác");
        }

        next();
    }


    // inner function

    // create access token
    createAccessToken(email) {
        let accessToken = jwt.sign({ email: email }, secretConfig.accessTokenKey, { expiresIn: '10m' }); // 10 minutes for access token
        return accessToken;
    }

    // create refresh token
    createRefreshToken(email) {
        let refreshToken = jwt.sign({ email: email }, secretConfig.refreshTokenKey, { expiresIn: '7d' }); // 7 days for refresh token
        return refreshToken;
    }

}

module.exports = AuthController;