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
        // this.checkToken(req, res, next);
        this.logoutAll(req, res, next);
    }

    // Post api/auth/login
    // body: email, password
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

    // Post api/auth/validateToken
    // headers.authorization: token
    // body: email
    async validateToken(req, res, next) {
        if (req.account.email != req.body.email) {
            return Response.response(res, Response.ResponseCode.BAD_REQUEST, "Wrong email");
        }
        Response.response(res, Response.ResponseCode.OK, "Success", req.decoded, "Token hợp lệ");
    }

    // Post api/auth/refreshToken
    // headers.authorization: refreshtoken
    // body: email
    async refreshToken(req, res, next) {
        let refreshToken = req.headers.authorization;

        // check null
        if (!refreshToken) {
            return Response.response(res, Response.ResponseCode.BAD_REQUEST, "RefreshToken null", null, "Không nhận được RefreshToken");
        }

        try {
            // verify refreshToken
            const decoded = jwt.verify(refreshToken, secretConfig.refreshTokenKey);

            // check alive refreshToken but canceled => check login table
            let login = await LoginDAO.getInstance().select({ refresh_token: refreshToken });

            if (login == null || login[0] == null || login[0].email != req.body.email) {
                return Response.response(res, Response.ResponseCode.BAD_REQUEST, "Invalid Refreshtoken");
            }

            // create token
            let token = this.createAccessToken(req.body.email);

            // update token to db
            let update = await LoginDAO.getInstance().update({ token: token }, { refresh_token: refreshToken });
            if (update == null) {
                return Response.response(res, Response.ResponseCode.SERVER_ERROR, "Server error");
            }

            // response
            Response.response(res, Response.ResponseCode.OK, "Success", token, "Thành công");

        } catch (error) {
            // expired time
            if (error instanceof jwt.TokenExpiredError) {
                // delete expired refreshToken
                let res = await LoginDAO.getInstance().delete({ refresh_token: refreshToken });
                return Response.response(res, Response.ResponseCode.BAD_REQUEST, "Expired token", refreshToken, "RefreshToken đã hết hạn");
            }
            // other case of getting token failed
            console.log(error);
            return Response.response(res, Response.ResponseCode.BAD_REQUEST, "Invalid token", refreshToken, "RefreshToken không chính xác");
        }
    }

    // Post api/auth/logout
    // headers.authorization: token
    async logout(req, res, next) {
        try {
            // delete from login table
            let del = await LoginDAO.getInstance().delete({ token: req.headers.authorization });

            if (del == null || del.affectedRows == 0) {
                return Response.response(res, Response.ResponseCode.BAD_REQUEST, "Invalid token");
            }

            // response
            Response.response(res, Response.ResponseCode.OK, "Success", null, "Logout thành công");

        } catch (error) {
            console.log(error);
            return Response.response(res, Response.ResponseCode.SERVER_ERROR, "Server error");
        }
    }

    // Post api/auth/logoutAll
    // headers.authorization: token
    async logoutAll(req, res, next) {
        try {
            // get login from token
            let login = await LoginDAO.getInstance().select({ token: req.headers.authorization });

            if (login == null || login[0] == null) {
                return Response.response(res, Response.ResponseCode.BAD_REQUEST, "Invalid token");
            }

            // delete all logins of this email
            let del = await LoginDAO.getInstance().delete({ email: login[0].email });

            if (del == null || del.affectedRows == 0) {
                return Response.response(res, Response.ResponseCode.SERVER_ERROR, "Server error");
            }

            // response
            Response.response(res, Response.ResponseCode.OK, "Success", null, "Logout thành công");

        } catch (error) {
            console.log(error);
            return Response.response(res, Response.ResponseCode.SERVER_ERROR, "Server error");
        }
    }


    /* 
    middle ware
    */

    // check token
    // headers.authorization: token
    async checkToken(req, res, next) {
        // get from header
        const token = req.headers.authorization;

        // check null
        if (!token) {
            return Response.response(res, Response.ResponseCode.BAD_REQUEST, "Token null", null, "Không nhận được token");
        }

        try {
            // verify token
            const decoded = jwt.verify(token, secretConfig.accessTokenKey);

            // check alive token but canceled => check login table
            let login = await LoginDAO.getInstance().select({ token: token });

            if (login == null || login[0] == null) {
                return Response.response(res, Response.ResponseCode.BAD_REQUEST, "Invalid token", token, "Token không chính xác");
            }

            // add account to req for using in next
            req.account = await AccountDAO.getInstance().getById(decoded.email);
            if (req.account == null) {
                return Response.response(res, Response.ResponseCode.SERVER_ERROR, "Server error");
            }

            // go next
            next();
        } catch (error) {
            // expired time
            if (error instanceof jwt.TokenExpiredError) {
                return Response.response(res, Response.ResponseCode.BAD_REQUEST, "Expired token", token, "Token đã hết hạn");
            }
            // other case of getting token failed
            console.log(error);
            return Response.response(res, Response.ResponseCode.BAD_REQUEST, "Invalid token", token, "Token không chính xác");
        }
    }

    // check password
    async checkPassword(req, res, next) {
        let { email, password } = req.body;

        let account = await AccountDAO.getInstance().select({ email: email, password: password });

        if (account == null || account[0].email == null || account[0].password == null) {
            return Response.response(res, Response.ResponseCode.BAD_REQUEST, "Wrong password", password, "Mật khẩu không chính xác");
        }

        next();
    }


    /*
    inner function
    */

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