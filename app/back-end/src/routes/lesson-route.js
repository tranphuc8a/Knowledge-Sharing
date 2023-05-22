
var AuthController = require('../controllers/auth-controller');
var mailer = require('../services/email-service');

let content = `121341543`;

class LessonRoute{
	constructor(app){
		this.app = app;
		this.authcontroller = new AuthController();
	}

	async route(){
		this.app.get('/api/lesson/', this.authcontroller.login , function(req, res, next){
			mailer.send({
				from: 'Knowledge-Sharing system',
				to: 'nhungthisope123@gmail.com',
				subject: 'Email thông báo mã lấy lại mật khẩu',
				text: "<br> <br> <i>content </i>"
			});
			res.send("Send email success");

		});
	}
}


module.exports = LessonRoute;

