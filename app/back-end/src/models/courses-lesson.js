
class CoursesLesson{
    constructor(csls){
        if (csls == null) return;
        this.courses_id = csls.id;
        this.lesson_id = csls.id;
        this.offset = csls.offset;
    }
}

module.exports = CoursesLesson;
