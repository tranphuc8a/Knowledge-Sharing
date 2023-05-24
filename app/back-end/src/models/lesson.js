const Knowledge = require("./knowledge");

class Lesson extends Knowledge{
    constructor(lesson){
        super(lesson);
        if (lesson == null) return;
        this.knowledge_id = lesson.knowledge_id;
        this.content = lesson.content;
        this.views = lesson.views;
        this.visible = lesson.visible;
    }
}

module.exports = Lesson;