const Lesson = require("../../models/lesson");
const Transformer = require("../../utils/class-transformer");
const SQLUtils = require("../../utils/sql-utils");

class LessonDAO {
    static instance = null;
    static getInstance() {
        if (this.instance == null) this.instance = new LessonDAO();
        return this.instance;
    }
    constructor() {
        this.conn = global.connection;
    }


    async insert(lesson) {
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
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    async getById(id, keys) {
        try {
            let sql = `select ${SQLUtils.getKeys(keys)} from lesson join knowledge on lesson.knowledge_id=knowledge.id where lesson.knowledge_id=?`;
            let [res] = await this.conn.query(sql, [id]);
            return Transformer.getInstance().jsonToInstance(Lesson, res[0]);
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    async select(wheres, keys, pagination) {
        try {
            let { sql, values } = SQLUtils.getWheres(wheres);

            sql = `select ${SQLUtils.getKeys(keys)} from lesson join knowledge on lesson.knowledge_id=knowledge.id
                        ${wheres != null ? "WHERE " + sql : ""} ${SQLUtils.getPagination(pagination)};`;
            let [res] = await this.conn.query(sql, values);
            return Transformer.getInstance().jsonToInstance(Lesson, res);
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    async selectJoinCourses(wheres, keys, pagination) {
        try {
            let { sql, values } = SQLUtils.getWheres(wheres);

            sql = `select ${SQLUtils.getKeys(keys)} from lesson 
                    join knowledge on lesson.knowledge_id=knowledge.id
                    left join courses_lesson on lesson.knowledge_id=courses_lesson.lesson_id
                    ${wheres != null ? "WHERE " + sql : ""} 
                    ${SQLUtils.getPagination(pagination)};`;
            let [res] = await this.conn.query(sql, values);
            return res;
        } catch (e) {
            console.log(e);
            return null;
        }
    }


    async selectDetail(wheres, keys, pagination) {
        try {
            let { sql, values } = SQLUtils.getWheres(wheres);

            sql = `select ${SQLUtils.getKeys(keys)} from 
                        (SELECT table1.*, table2.score, table3.nummark, knowledge.*, profile.name FROM (
                            SELECT lesson.*, count(comment.id) as numcmt FROM lesson
                            left join comment on lesson.knowledge_id = comment.knowledge_id
                            group by lesson.knowledge_id
                        ) as table1 join (
                            SELECT lesson.*, avg(score.score) - 1 as score
                            from lesson 
                            left join score on lesson.knowledge_id = score.knowledge_id 
                            GROUP by lesson.knowledge_id
                        ) as table2 on table1.knowledge_id = table2.knowledge_id join (
                            SELECT lesson.*, count(mark.email) as nummark
                            from lesson 
                            left join mark on lesson.knowledge_id = mark.knowledge_id 
                            GROUP by lesson.knowledge_id
                        ) as table3 on table1.knowledge_id = table3.knowledge_id
                        join knowledge on table1.knowledge_id = knowledge.id
                        join profile on knowledge.owner_email = profile.email) as lesson
                    ${wheres != null ? "WHERE " + sql : ""} 
                    ${SQLUtils.getPagination(pagination)};`;

            let [res] = await this.conn.query(sql, values);
            return res;
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    async selectDetailJoinCourses(wheres, keys, pagination) {
        try {
            let { sql, values } = SQLUtils.getWheres(wheres);

            sql = `select ${SQLUtils.getKeys(keys)} from 
                        (SELECT table1.*, table2.score, table3.nummark, knowledge.*, profile.name FROM (
                            SELECT lesson.*, count(comment.id) as numcmt FROM lesson
                            left join comment on lesson.knowledge_id = comment.knowledge_id
                            group by lesson.knowledge_id
                        ) as table1 join (
                            SELECT lesson.*, avg(score.score) - 1 as score
                            from lesson 
                            left join score on lesson.knowledge_id = score.knowledge_id 
                            GROUP by lesson.knowledge_id
                        ) as table2 on table1.knowledge_id = table2.knowledge_id join (
                            SELECT lesson.*, count(mark.email) as nummark
                            from lesson 
                            left join mark on lesson.knowledge_id = mark.knowledge_id 
                            GROUP by lesson.knowledge_id
                        ) as table3 on table1.knowledge_id = table3.knowledge_id
                        join knowledge on table1.knowledge_id = knowledge.id
                        join profile on knowledge.owner_email = profile.email) as lesson
                        left join courses_lesson on lesson.knowledge_id=courses_lesson.lesson_id
                    ${wheres != null ? "WHERE " + sql : ""} 
                    ${SQLUtils.getPagination(pagination)};`;
            let [res] = await this.conn.query(sql, values);
            return res;
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    async update(lesson, wheres) {
        try {
            let lessonObj = SQLUtils.getSets(lesson);
            let whereObj = SQLUtils.getWheres(wheres);

            sql = `update lesson join knowledge on lesson.knowledge_id=knowledge.id 
                   set ${lessonObj.sql} where ${whereObj.sql}`;
            let [res] = await this.conn.query(sql, [...lessonObj.values, ...whereObj.values]);
            return res;
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    async delete(wheres) {
        try {
            let whereObj = SQLUtils.getWheres(wheres);
            sql = `delete lesson, knowledge from lesson join knowledge on lesson.knowledge_id=knowledge.id 
                   where ${whereObj.sql}`;
            let [res] = await this.conn.query(sql, whereObj.values);
            return res;
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    async getNumLesson(email) {
        try {
            let sql = `SELECT COUNT(id) FROM knowledge join lesson on knowledge.id = lesson.knowledge_id WHERE owner_email = '${email}'`;
            let [num] = await this.conn.query(sql);
            return num[0]['COUNT(id)'];
        } catch (error) {
            console.log(error);
            return 0;
        }
    }
}

module.exports = LessonDAO;