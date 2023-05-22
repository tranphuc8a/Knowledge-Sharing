const AccountDAO = require("../services/accountDAO");

class AuthController {
    constructor() {

    }

    async login(req, res, next) {
        // res.send('login successfully');
        next();
    }

    async getListAccount(req, res, next) {
        let listAccount = await AccountDAO.getInstance().getListAccount();
        res.json(listAccount);
    }
}

module.exports = AuthController;