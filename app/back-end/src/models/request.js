
class Request{
    constructor(request){
        if (request == null) return;
        this.id = request.id;
        this.owner_email = request.owner_email;
        this.learner_email = request.learner_email;
        this.courses_id = request.courses_id;
        this.type = request.type;
        this.time = request.time;
    }
}

module.exports = Request;