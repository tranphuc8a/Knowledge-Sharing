
const AccountDAO = require('../services/dao/account-dao');
const FollowDAO = require('../services/dao/follow-dao');
const LoginDAO = require('../services/dao/login-dao');
var Res = require('../utils/response');
const BaseController = require('./base-controller');

class AccountController extends BaseController {
	constructor(){super();}
	
	async checkAccountFollowAccount(followingAcc, followedAcc){
		if (followingAcc == null || followedAcc == null) return false;
		let follows = await FollowDAO.getInstance().select({
			following: followingAcc.email,
			followed: followedAcc.email
		});
		if (!follows) return false;
		return follows.length > 0;
	}
	
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
		this.updateMiddleWare(req, res, next);
		let account = req.account;
		if (account.role == 'user') return next();
		return this.info("You are not user");
	}
	async checkAdmin(req, res, next){
		this.updateMiddleWare(req, res, next);
		let account = req.account;
		if (account.role == 'admin') return next();
		return this.info("You are not admin");
	}
	async checkAccountExisted(req, res, next){
		this.updateMiddleWare(req, res, next);
		let email = req.params.email;
		let user = await AccountDAO.getInstance().getById(email);
		if (user == null) return this.badRequest("Email is not existed");
		req.user = user;
		next();
	}
}

module.exports = AccountController;