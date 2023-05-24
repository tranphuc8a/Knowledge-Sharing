const AccountDAO = require("../services/dao/account-dao");
const jwt = require("jsonwebtoken");
const Response = require("../utils/response");
const secretConfig = require("../configs/secret-config");
const LoginDAO = require("../services/dao/login-dao");

class AuthController {
    constructor() {

    }

    // middle ware


    // end ware

    // just for test
    async test(req, res, next) {
        let result = await LoginDAO.getInstance().getById(5);
        Response.response(res, Response.ResponseCode.OK, "Success", result, "Thành công");
    }

    // login api
    async login(req, res, next) {
        const { email, password } = req.body;

        // check payload
        if (email == undefined || password == undefined) {
            Response.response(res, Response.ResponseCode.BAD_REQUEST, "Bad request", req.body, "Payload không hợp lệ");
            return;
        }

        // check account
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

        Response.response(res, Response.ResponseCode.OK, "Success", account, "Thành công");
    }


    // create access token
    createAccessToken(email) {
        let accessToken = jwt.sign({ email: email }, secretConfig.accessTokenKey, { expiresIn: '1m' });
        return accessToken;
    }

    // create refresh token
    createRefreshToken(email) {
        let refreshToken = jwt.sign({ email: email }, secretConfig.refreshTokenKey, { expiresIn: '1m' });
        return refreshToken;
    }

    // verify access token
    verifyAccessToken(token) {
        jwt.verify(token, secretConfig.accessTokenKey, function (err, decoded) {
            console.log('err: ' + err + 'decoded: ' + decoded.email);
        });
    }

    // verify refresh token
    verifyRefreshToken(token) {
        jwt.verify(token, secretConfig.refreshTokenKey, function (err, decoded) {
            console.log('err: ' + err + 'decoded: ' + decoded.email);
        });
    }

    async checkToken(req, res, next){
        console.log("Checked token");
        req.account = {
            warning: 0,
            role: 'user'
        };
        next();
    }

    async checkPassword(req, res, next){
        let { password } = req.params;
        console.log("Check password: " + password);
        next();
    }

}

module.exports = AuthController;