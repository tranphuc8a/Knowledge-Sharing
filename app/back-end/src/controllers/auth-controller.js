const AccountDAO = require("../services/accountDAO");
const jwt = require("jsonwebtoken");

class AuthController {
    constructor() {

    }

    async login(req, res, next) {
        const { email, password } = req.body;

    }

}

module.exports = AuthController;