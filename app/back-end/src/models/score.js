

class Score{
    constructor(score){
        if (score == null) return;
        this.email = score.email;
        this.knowledge_id = score.knowledge_id;
        this.score = score.score;
        this.time = score.time;
    }
}

module.exports = Score;

