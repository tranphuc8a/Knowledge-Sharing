

class Mark{
    constructor(mark){
        if (mark == null) return;
        this.email = mark.email;
        this.knowledge_id = mark.knowledge_id;
        this.time = mark.time;  
    }
}

module.exports = Mark;
