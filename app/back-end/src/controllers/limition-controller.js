
var Res = require('../utils/response')

class LimitionController{
	constructor(){}
	async checkLimitLevelZero(req, res, next){
		let account = req.account;
		if (account.warning == '0') next();
		else {
			return Res.response(res, Res.ResponseCode.INFO, null, "You are limited this functional");
		}
	}
	async checkLimitLevelOne(req, res, next){
		let account = req.account;
		if (account.warning == '0' || account.warning == '1') next();
		else {
			return Res.response(res, Res.ResponseCode.INFO, null, "You are limited this functional");
		}
	}
	async checkLimitLevelTwo(req, res, next){
		let account = req.account;
		if (account.warning == '0' || account.warning == '1' || account.warning == '2') next();
		else {
			return Res.response(res, Res.ResponseCode.INFO, null, "You are limited this functional");
		}
	}
	async checkLimitLevelThree(req, res, next){
		let account = req.account;
		if (account.warning == '0' || account.warning == '1' || account.warning == '2' || account.warning == '3') next();
		else {
			return Res.response(res, Res.ResponseCode.INFO, null, "You are limited this functional");
		}
	}
}

module.exports = LimitionController;
