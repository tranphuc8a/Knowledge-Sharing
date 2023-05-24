const Knowledge = require("./knowledge");

class Courses extends Knowledge{
    constructor(courses){
        super(courses);
        if (courses == null) return;
        this.knowledge_id = courses.knowledge_id;
        this.description = courses.description;
        this.isfree = courses.isfree;
        this.fee = courses.fee;
    }
}

module.exports = Courses;
