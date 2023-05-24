

class Knowledge{
	constructor(knowledge){
		if (knowledge == null) return;
		this.id = knowledge.id;
		this.owner_email = knowledge.owner_email;
		this.title = knowledge.title;
		this.update_at = knowledge.update_at;
		this.create_at = knowledge.create_at;
		this.thumbnail = knowledge.thumbnail;
		this.learning_time = knowledge.learning_time;
	}
}

module.exports = Knowledge;
