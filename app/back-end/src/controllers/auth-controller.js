const AccountDAO = require("../services/dao/account-dao");
const jwt = require("jsonwebtoken");
const Response = require("../utils/response");
const secretConfig = require("../configs/secret-config");
const LoginDAO = require("../services/dao/login-dao");
const DateTime = require("../utils/datetime");
const mailer = require("../services/email-service");
const randomGenerator = require("../utils/random-generator");
const CodeDAO = require("../services/dao/code-dao");
const Code = require("../models/code");
const ProfileDAO = require("../services/dao/profile-dao");

class AuthController {
    constructor() {

    }

    // just for test
    async test(req, res, next) {
        // this.checkToken(req, res, next);
        req.account = {
            email: 'manacoto123@gmail.com',
            password: '12345678',
            role: 'user',
            warning: '0'
        }
        this.changePassword(req, res, next);
    }

    // Post api/auth/login
    // body: email, password
    async login(req, res, next) {
        const { email, password } = req.body;

        try {
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
            let mLogin = await LoginDAO.getInstance().insert({ email: email, token: accessToken, refresh_token: refreshToken, time: DateTime.now() });
            if (mLogin == null) {
                Response.response(res, Response.ResponseCode.SERVER_ERROR, "Server error", req.body, "Lỗi khi lưu accessToken & refreshToken");
                return;
            }

            // remove password and add token & refresh token to the response for user
            delete account.password;
            account.token = accessToken;
            account.refresh_token = refreshToken;

            Response.response(res, Response.ResponseCode.OK, "Success", account, "Thành công");
        } catch (error) {
            console.log(error);
            Response.response(res, Response.ResponseCode.SERVER_ERROR, "Server error");
        }

    }

    // Post api/auth/validateToken
    // headers.authorization: token
    // body: email
    async validateToken(req, res, next) {
        try {
            if (req.account.email != req.body.email) {
                return Response.response(res, Response.ResponseCode.BAD_REQUEST, "Wrong email");
            }
            Response.response(res, Response.ResponseCode.OK, "Success", req.decoded, "Token hợp lệ");
        } catch (error) {
            console.log(error);
            Response.response(res, Response.ResponseCode.SERVER_ERROR, "Server error");
        }
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

    // Post api/auth/getRegisterCode
    // body: email
    async getRegisterCode(req, res, next) {
        let email = req.body.email;
        let code = randomGenerator.generateRandomCode();
        try {
            // insert into code table
            let insert = await CodeDAO.getInstance().insert({ email: email, code: code, type: Code.TypeCode.REGISTER, time: DateTime.now() });
            if (insert == null) {
                return Response.response(res, Response.ResponseCode.SERVER_ERROR, "Server error");
            }

            // send email by nodemailer
            let sentMail = mailer.send({
                from: 'bksnet20222@gmail.com',
                to: email,
                subject: 'Xác thực đăng ký tài khoản Knowledge Sharing',
                html: `
                    <p style="font-size:20px;">
                        Mã code để đăng ký tài khoàn của bạn là: 
                        <b style="color: #a81b11; font-size:30px; margin-left: 10px;">
                            ${code}
                        </b>
                        <br>
                        <div style="font-size:15px;">
                            Nếu không phải bạn, vui lòng bỏ qua email này!
                        </div>
                    </p>
                `
            });

            // response
            Response.response(res, Response.ResponseCode.OK, "Success", null, "Đã gửi mã code tới email");

        } catch (error) {
            console.log(error);
            return Response.response(res, Response.ResponseCode.SERVER_ERROR, "Server error");
        }
    }

    // Post api/auth/register
    // body: email, password, code
    async register(req, res, next) {
        let { email, password, code } = req.body;

        try {
            // check password
            if (password.length < 8) {
                return Response.response(res, Response.ResponseCode.BAD_REQUEST, "Password has less than 8 characters");
            }

            // check code
            let checkCodePromise = CodeDAO.getInstance().select({ code: code, email: email })
                .then(checkCode => {
                    // check valid for code
                    if (checkCode == null || checkCode[0] == null || checkCode[0].type != Code.TypeCode.REGISTER) {
                        throw new Error('Invalid code or wrong email');
                    }
                    // check time expired for code (5 minutes)
                    let durationMinutes = DateTime.durationMinutes(DateTime.now(), checkCode[0].time);
                    if (durationMinutes > 5) {
                        throw new Error('Expired code');
                    }
                });

            // check existed email
            let checkEmailPromise = AccountDAO.getInstance().select({ email: email })
                .then(exist => {
                    if (exist != null && exist[0] != null) {
                        throw new Error('Existed account');
                    }
                });

            // run 2 check promises parallel
            try {
                await Promise.all([checkCodePromise, checkEmailPromise]);
            } catch (error) {
                return Response.response(res, Response.ResponseCode.BAD_REQUEST, error.message);
            }

            // add account into account table
            let account = await AccountDAO.getInstance().insert({ email: email, password: password, role: 'user', warning: '0', time: DateTime.now() });
            if (account == null) {
                return Response.response(res, Response.ResponseCode.SERVER_ERROR, "Server error");
            }

            // add defautl profile
            let profile = await ProfileDAO.getInstance().insert({ name: 'Default', email: email, gender: 'other', visible: '2222222222' });
            if (profile == null) {
                return Response.response(res, Response.ResponseCode.SERVER_ERROR, "Server error");
            }

            // response
            Response.response(res, Response.ResponseCode.OK, "Success", null, "Đăng ký tài khoản thành công");

        } catch (error) {
            console.log(error);
            return Response.response(res, Response.ResponseCode.SERVER_ERROR, "Server error");
        }
    }


    // Post api/auth/changePassword
    // authorization: token
    // body: oldPassword, newPassword
    async changePassword(req, res, next) {
        let { oldPassword, newPassword } = req.body;

        try {
            // check new password
            if (newPassword == oldPassword) {
                return Response.response(res, Response.ResponseCode.BAD_REQUEST, "New password is the same with old password");
            }
            if (newPassword.length < 8) {
                return Response.response(res, Response.ResponseCode.BAD_REQUEST, "New password has less than 8 characters");
            }

            // check password
            if (req.account.password != oldPassword) {
                return Response.response(res, Response.ResponseCode.BAD_REQUEST, "Wrong password");
            }

            // update new password in account table
            let updateAccountPromise = AccountDAO.getInstance().update({ password: newPassword }, { email: req.account.email })
                .then(account => {
                    if (account == null) {
                        throw new Error('Server error');
                    }
                });

            // delete login sessins in login table
            let deleteLoginPromise = LoginDAO.getInstance().delete({ email: req.account.email })
                .then(del => {
                    if (del == null) {
                        throw new Error('Server error');
                    }
                });

            // execute 2 promise parallel
            await Promise.all([updateAccountPromise, deleteLoginPromise]);

            // re-login for user
            req.body.password = newPassword;
            // create token & refresh token
            let accessToken = this.createAccessToken(req.account.email);
            let refreshToken = this.createRefreshToken(req.account.email);
            // save token & refresh token to login table
            let mLogin = await LoginDAO.getInstance().insert({ email: req.account.email, token: accessToken, refresh_token: refreshToken, time: DateTime.now() });
            if (mLogin == null) {
                Response.response(res, Response.ResponseCode.SERVER_ERROR, "Server error", req.body, "Lỗi khi lưu accessToken & refreshToken");
                return;
            }
            // remove password and add token & refresh token to the response for user
            delete req.account.password;
            req.account.token = accessToken;
            req.account.refresh_token = refreshToken;

            // response
            Response.response(res, Response.ResponseCode.OK, "Success", req.account, "Đổi mật khẩu thành công");

        } catch (error) {
            console.log(error);
            return Response.response(res, Response.ResponseCode.SERVER_ERROR, "Server error");
        }
    }

    // Post api/auth/getForgotPasswordCode
    // body: email
    async getForgotPasswordCode(req, res, next) {
        let email = req.body.email;
        let code = randomGenerator.generateRandomCode();

        try {
            // insert into code table
            let insert = await CodeDAO.getInstance().insert({ email: email, code: code, type: Code.TypeCode.FORGOT_PASSWORD, time: DateTime.now() });
            if (insert == null) {
                return Response.response(res, Response.ResponseCode.SERVER_ERROR, "Server error");
            }

            // send email by nodemailer
            let sentMail = mailer.send({
                from: 'bksnet20222@gmail.com',
                to: email,
                subject: 'Quên mật khẩu tài khoản Knowledge Sharing?',
                html: `
                    <p style="font-size:20px;">
                        Mã code sửa lại mật khẩu của bạn là: 
                        <b style="color: #a81b11; font-size:30px; margin-left: 10px;">
                            ${code}
                        </b>
                        <br>
                        <div style="font-size:15px;">
                            Nếu không phải bạn, vui lòng bỏ qua email này!
                        </div>
                    </p>
                `
            });

            // response
            Response.response(res, Response.ResponseCode.OK, "Success", null, "Đã gửi mã code tới email");

        } catch (error) {
            console.log(error);
            return Response.response(res, Response.ResponseCode.SERVER_ERROR, "Server error");
        }
    }

    // Post api/auth/forgotPassword
    // body: code, email, newPassword
    async forgotPassword(req, res, next) {
        let { code, email, newPassword } = req.body;

        try {
            // check new password
            if (newPassword.length < 8) {
                return Response.response(res, Response.ResponseCode.BAD_REQUEST, "New password has less than 8 characters");
            }

            // check code
            let checkCodePromise = CodeDAO.getInstance().select({ code: code, email: email, type: Code.TypeCode.FORGOT_PASSWORD })
                .then(checkCode => {
                    // check valid for code
                    if (checkCode == null || checkCode[0] == null) {
                        throw new Error('Invalid code or wrong email');
                    }
                    // check time expired for code
                    let durationMinutes = DateTime.durationMinutes(DateTime.now(), checkCode[0].time);
                    if (durationMinutes > 5) {
                        throw new Error('Expired code');
                    }
                });

            // check email
            let checkEmailPromise = AccountDAO.getInstance().select({ email: email })
                .then(exist => {
                    // check existed email
                    if (exist == null || exist[0] == null) {
                        throw new Error('Unexisted account');
                    }
                });

            try {
                await Promise.all([checkCodePromise, checkEmailPromise]);
            } catch (error) {
                return Response.response(res, Response.ResponseCode.BAD_REQUEST, error.message);
            }

            // update newPassword into account table
            let updateAccountPromise = AccountDAO.getInstance().update({ password: newPassword }, { email: email })
                .then(account => {
                    if (account == null) {
                        return Response.response(res, Response.ResponseCode.SERVER_ERROR, "Server error");
                    }
                });

            // delete login session in login table
            let deleteLoginPromise = LoginDAO.getInstance().delete({ email: email })
                .then(del => {
                    if (del == null) {
                        return Response.response(res, Response.ResponseCode.SERVER_ERROR, "Server error");
                    }
                });

            await Promise.all([updateAccountPromise, deleteLoginPromise]);

            // response
            Response.response(res, Response.ResponseCode.OK, "Success", null, "Đổi mật khẩu thành công");

        } catch (error) {
            console.log(error);
            return Response.response(res, Response.ResponseCode.SERVER_ERROR, "Server error");
        }
    }

    // Post api/auth/cancelAccount
    // authorization: token
    // body: password
    async cancelAccount(req, res, next) {
        let password = req.body.password;
        try {
            // check password
            if (req.account.password != password) {
                return Response.response(res, Response.ResponseCode.BAD_REQUEST, "Wrong password");
            }

            // delete login session
            let del = await LoginDAO.getInstance().delete({ email: email });
            if (del == null) {
                return Response.response(res, Response.ResponseCode.SERVER_ERROR, "Server error");
            }

            // delete account in account table
            let accountDel = await AccountDAO.getInstance().delete({ email: req.account.email });
            if (accountDel == null) {
                return Response.response(res, Response.ResponseCode.SERVER_ERROR, "Server error");
            }

            // delete other information related to cancel account
            // todo: cần phải xác định và phân tích rõ nghiệp vụ này

            // response
            Response.response(res, Response.ResponseCode.OK, "Success", null, "Huỷ tài khoản thành công");

        } catch (error) {
            console.log(error);
            return Response.response(res, Response.ResponseCode.SERVER_ERROR, "Server error");
        }
    }

    /* 
    middle ware
    */

    // check for api having optinal token
    async checkOptionalApi(req, res, next) {
        // if don't have token
        if (req.headers == null || req.headers.authorization == null) {
            return next();
        }

        // get from header
        const token = req.headers.authorization;

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
            return next();
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
            return next();
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

        try {
            let account = await AccountDAO.getInstance().select({ email: email, password: password });

            if (account == null || account[0].email == null || account[0].password == null) {
                return Response.response(res, Response.ResponseCode.BAD_REQUEST, "Wrong password", password, "Mật khẩu không chính xác");
            }

            return next();
        } catch (error) {
            console.log(error);
            return Response.response(res, Response.ResponseCode.SERVER_ERROR, "Server error");
        }
    }


    /*
    inner function
    */

    // create access token
    createAccessToken(email) {
        let accessToken = jwt.sign({ email: email }, secretConfig.accessTokenKey, { expiresIn: '10d' }); // 10 minutes for access token
        return accessToken;
    }

    // create refresh token
    createRefreshToken(email) {
        let refreshToken = jwt.sign({ email: email }, secretConfig.refreshTokenKey, { expiresIn: '7d' }); // 7 days for refresh token
        return refreshToken;
    }

}

module.exports = AuthController;