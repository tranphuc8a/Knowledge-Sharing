
const AccountDAO = require('../services/dao/account-dao');
const LoginDAO = require('../services/dao/login-dao');
var Res = require('../utils/response')

class AccountController {
	constructor(){}

	async getAccountFromToken(token){
		if (token == null) return null;
		let logins = await LoginDAO.getInstance().select({
			token: token
		});
		if (logins.length <= 0) return null;
		let login = logins[0];
		let account = await AccountDAO.getInstance().getById(login.email);
		return account;
	}

	// middle ware:
	async checkUser(req, res, next){
		let account = req.account;
		if (account.role == 'user') next();
		else {
			return Res.response(res, Res.ResponseCode.INFO, null, "You are not user");
		}
	}
	async checkAdmin(req, res, next){
		let account = req.account;
		if (account.role == 'admin') next();
		else {
			return Res.response(res, Res.ResponseCode.INFO, null, "You are not admin");
		}
	}
	async checkAccountExisted(req, res, next){
		let email = req.params.email;
		let user = await AccountDAO.getById(email);
		if (user == null) return Res.response(res, Res.ResponseCode.BAD_REQUEST, "email is not existed")
		req.user = user;
		next();
	}
}

module.exports = AccountController;