const Lesson = require("../../models/lesson");
const Transformer = require("../../utils/class-transformer");
const SQLUtils = require("../../utils/sql-utils");

class LessonDAO{
    static instance = null;
    static getInstance() {
        if (this.instance == null) this.instance = new LessonDAO();
        return this.instance;
    }
    constructor(){
        this.conn = global.connection;
    }


    async insert(lesson){
        try {
            let value = [lesson.owner_email, lesson.title, lesson.update_at, 
                         lesson.create_at, lesson.thumbnail, lesson.learning_time];
            let sql = `insert into knowledge(owner_email, title, update_at, create_at, thumbnail, learning_time) 
                        value (?, ?, ?, ?, ?, ?);`;
            let [res] = await this.conn.query(sql, value);
            lesson.knowledge_id = res[0].insertId;
            
            value = [lesson.knowledge_id, lesson.content, lesson.views, lesson.visible];
            sql = `insert into lesson value (?, ?, ?, ?);`;
            [res] = await this.conn.query(sql, value);

            return lesson;
        } catch(e){
            console.log(e);
            return null;
        }
    }

    async getById(id, keys){
        try {
            let sql = `select ${SQLUtils.getKeys(keys)} from lesson join knowledge on lessons.knowledge_id=knowledge.id where lesson.knowledge_id=?`;
            let [res] = await this.conn.query(sql, [id]);
            console.log(id);
            return Transformer.getInstance().jsonToInstance(Lesson, res[0]);
        } catch(e){
            console.log(e);
            return null;
        }
    }

    async select(wheres, keys, pagination){
        try{
            let {sql, values} = SQLUtils.getWheres(wheres);

            sql = `select ${SQLUtils.getKeys(keys)} from lesson join knowledge on lesson.knowledge_id=knowledge.id
                        ${wheres != null ? "WHERE " + sql : ""} ${SQLUtils.getPagination(pagination)};`;
            let [res] = await this.conn.query(sql, values);
            return Transformer.getInstance().jsonToInstance(Lesson, res);     
        } catch(e){
            console.log(e);
            return null;
        }
    }

    async update(lesson, wheres){
        try{
            let lessonObj = SQLUtils.getSets(lesson);
            let whereObj = SQLUtils.getWheres(wheres);

            sql = `update lesson join knowledge on lesson.knowledge_id=knowledge.id 
                   set ${lessonObj.sql} where ${whereObj.sql}`;
            let [res] = await this.conn.query(sql, [...lessonObj.values, ...whereObj.values]);
            return res;     
        } catch(e){
            console.log(e);
            return null;
        }
    }

    async delete(wheres){
        try {
            let whereObj = SQLUtils.getWheres(wheres);
            sql = `delete lesson, knowledge from lesson join knowledge on lesson.knowledge_id=knowledge.id 
                   where ${whereObj.sql}`;
            let [res] = await this.conn.query(sql, whereObj.values);
            return res;  
        } catch(e){
            console.log(e);
            return null;
        }
    }
}

module.exports = LessonDAO;