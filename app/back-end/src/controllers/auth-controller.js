const AccountDAO = require("../services/dao/account-dao");
const jwt = require("jsonwebtoken");

class AuthController {
    constructor() {

    }

    async login(req, res, next) {
        const { email, password } = req.body;

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