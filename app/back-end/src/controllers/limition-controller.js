
var Res = require('../utils/response');
const BaseController = require('./base-controller');

class LimitionController extends BaseController{
	constructor(){
		super();
	}
	async checkLimitLevelZero(req, res, next){
		try {
			this.updateMiddleWare(req, res, next);
			let account = req.account;
			if (account.warning == '0') 
				return next();
			return this.info("You are limited this functional");
		} catch(e){
			console.log(e);
			this.serverError(e);
		}
	}
	async checkLimitLevelOne(req, res, next){
		try {
			this.updateMiddleWare(req, res, next);
			let account = req.account;
			if (account.warning == '0' || account.warning == '1') 
				return next();
			return this.info("You are limited this functional");
		} catch(e){
			console.log(e);
			this.serverError(e);
		}
	}
	async checkLimitLevelTwo(req, res, next){
		try {
			this.updateMiddleWare(req, res, next);
			let account = req.account;
			if (account.warning == '0' || account.warning == '1' || account.warning == '2') 
				return next();
			return this.info("You are limited this functional");
		} catch(e){
			console.log(e);
			this.serverError(e);
		}
	}
	async checkLimitLevelThree(req, res, next){
		try {
			this.updateMiddleWare(req, res, next);
			let account = req.account;
			if (account.warning == '0' || account.warning == '1' || account.warning == '2' || account.warning == '3') 
				return next();
			return this.info("You are limited this functional");
		} catch(e){
			console.log(e);
			this.serverError(e);
		}
	}
}

module.exports = LimitionController;
