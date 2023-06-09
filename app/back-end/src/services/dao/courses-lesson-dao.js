const { Transform } = require("class-transformer");
const SQLUtils = require("../../utils/sql-utils");
const CoursesLesson = require("../../models/courses-lesson");
const Transformer = require("../../utils/class-transformer");




class CoursesLessonDAO{
    static instance = null;
    static getInstance() {
        if (this.instance == null) this.instance = new CoursesLessonDAO();
        return this.instance;
    }
    constructor(){
        this.conn = global.connection;
    }


    async insert(csls){
        try {
           let values = [csls.courses_id, csls.lesson_id, csls.offset];
           let sql = "insert into courses_lesson value (?, ?, ?)";
           let [res] = await this.conn.query(sql, values);
           return res;
        } catch(e){
            console.log(e);
            return null;
        }
    }

    async select(wheres, keys, pagination){
        try{
            let whereObj = SQLUtils.getWheres(wheres);
            let sql = `select ${SQLUtils.getKeys(keys)} from courses_lesson
                        ${wheres != null ? "where " + whereObj.sql : ""}
                        ${SQLUtils.getPagination(pagination)};`;
            let [res] = await this.conn.query(sql, whereObj.values);
            return Transformer.getInstance().jsonToInstance(CoursesLesson, res);
        } catch(e){
            console.log(e);
            return null;
        }
    }

    async update(csls, wheres){
        try{
            let setObj = SQLUtils.getSets(csls);
            let whereObj = SQLUtils.getWheres(wheres)
            let sql = `update courses_lesson set ${setObj.sql} where ${whereObj.sql};`;
            let [res] = await this.conn.query(sql, [...setObj.values, ...whereObj.values]);
            return res;
        } catch(e){
            console.log(e);
            return null;
        }
    }

    async delete(wheres){
        try {
            let whereObj = SQLUtils.getWheres(wheres)
            let sql = `delete from courses_lesson where ${whereObj.sql};`;
            let [res] = await this.conn.query(sql, whereObj.values);
            return res;
        } catch(e){
            console.log(e);
            return null;
        }
    }

    async getByAccountLesson(email, lesson_id){
        try{
            let sql = `select * from courses_lesson 
                       join learn on courses_lesson.courses_id=learn.courses_id
                       where email=? and lesson_id=?;`;
            let [res] = await this.conn.query(sql, [email, lesson_id]);
            return res;
        } catch(e){
            console.log(e);
            return null;
        }
    }
}

module.exports = CoursesLessonDAO;


