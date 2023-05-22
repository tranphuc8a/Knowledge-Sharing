/*
	to send an email:
	1. get email object: email = require('path to email-service')
	2. send email by set each infor:
		email.setFrom(from).setTo(to).setSubject(subject).setText(text).send()
	3. send email by pass params:
		email.send({
			from: '',
			to: '',
			subject: '',
			text: ''
		})

*/

const nodemailer = require('nodemailer');

const emailConfig = {
    user: 'bksnet20222@gmail.com',
    pass: 'zzvnpfbmwbcabfxd'
};

class EmailService {
    static instance = null;
    static getInstance() {
        if (this.instance == null) this.instance = new EmailService();
        return this.instance;
    }

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: emailConfig
        });
        this.mailOptions = {};
    }
    setFrom(from) {
        this.mailOptions.from = from;
        return this;
    }
    setTo(to) {
        this.mailOptions.to = to;
        return this;
    }
    setSubject(subject) {
        this.mailOptions.subject = subject;
        return this;
    }
    setText(text) {
        this.mailOptions.text = text;
        return this;
    }
    setHTML(html){
        this.mailOptions.html = html;
        return this;
    }
    setCC(emails){ // array of string email
        this.mailOptions.cc = emails;
        return this;
    }
    setBCC(emails){ // arrays of string email
        this.mailOptions.bcc = emails;
        return this;
    }

    send(mailOptions) {
    	if (mailOptions != null) {
    		this.mailOptions.from = mailOptions.from ?? this.mailOptions.from;
    		this.mailOptions.to = mailOptions.to ?? this.mailOptions.to;
    		this.mailOptions.subject = mailOptions.subject ?? this.mailOptions.subject;
    		this.mailOptions.text = mailOptions.text ?? this.mailOptions.text;
            this.mailOptions.html = mailOptions.html ?? this.mailOptions.html;
            this.mailOptions.cc = mailOptions.cc ?? this.mailOptions.cc;
            this.mailOptions.bcc = mailOptions.bcc ?? this.mailOptions.bcc;
    	}
        this.transporter.sendMail(this.mailOptions, function(error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }
}

module.exports = EmailService.getInstance();