

class Learn{
	constructor(learn){
		if (learn == null) return;
		this.email = learn.email;
		this.courses_id = learn.courses_id;
		this.time = learn.time;
	}
}

module.exports = Learn;
