
var Res = require('../utils/response')

class AccountController {
	constructor(){}

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
}

module.exports = AccountController;