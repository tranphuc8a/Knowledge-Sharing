

class Learn{
	constructor(learn){
		if (learn == null) return;
		this.email = learn.email;
		this.courses_id = learn.course_id;
		this.time = learn.time;
	}
}

module.exports = Learn;
