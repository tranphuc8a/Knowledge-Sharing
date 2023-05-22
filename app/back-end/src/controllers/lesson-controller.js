
var mailer = require('../services/email-service');


class LessonController{
	constructor(){

	}

	async getListLesson(req, res, next){
		mailer.setFrom('"Knowledge-Sharing system" bksnet20222@gmail.com')
			.setTo('tranphuc8a@gmail.com')
			.setSubject('Email thông báo mã lấy lại mật khẩu')
			.setHTML('<h1>Chào bạn!</h1><p>Đây là nội dung email trong định dạng HTML.</p>')
			.send();

		res.send("Send email success");
	}
}


module.exports = LessonController;