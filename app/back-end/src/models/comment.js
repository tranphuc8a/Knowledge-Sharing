
class Comment{
    constructor(comment){
        if (comment == null) return;
        this.id = comment.id;
        this.email = comment.email;
        this.knowledge_id = comment.knowledge_id;
        this.content = comment.content;
        this.time = comment.time;
    }
}

module.exports = Comment;
