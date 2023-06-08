const Courses = require("../../models/courses");
const Transformer = require("../../utils/class-transformer");
const SQLUtils = require("../../utils/sql-utils");
const CategoriesDAO = require("./categories-dao");
const KnowledgeDAO = require("./knowledge-dao");

class CoursesDAO {
    static instance = null;
    static getInstance() {
        if (this.instance == null) this.instance = new CoursesDAO();
        return this.instance;
    }
    constructor() {
        this.conn = global.connection;
    }


    async insert(course) {
        try {
            let value = [course.owner_email, course.title, course.update_at,
            course.create_at, course.thumbnail, course.learning_time];
            let sql = `insert into knowledge(owner_email, title, update_at, create_at, thumbnail, learning_time) 
                        value (?, ?, ?, ?, ?, ?);`;
            let [res] = await this.conn.query(sql, value);
            course.knowledge_id = res.insertId;

            value = [course.knowledge_id, course.description, course.isfree, course.fee];
            sql = `insert into courses value (?, ?, ?, ?);`;
            [res] = await this.conn.query(sql, value);

            return course;
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    async getById(id, keys) {
        try {
            let sql = `select ${SQLUtils.getKeys(keys)} from courses join knowledge on courses.knowledge_id=knowledge.id where courses.knowledge_id=?`;
            let [res] = await this.conn.query(sql, [id]);
            return Transformer.getInstance().jsonToInstance(Courses, res[0]);
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    async select(wheres, keys, pagination) {
        try {
            let { sql, values } = SQLUtils.getWheres(wheres);

            sql = `select ${SQLUtils.getKeys(keys)} from courses join knowledge on courses.knowledge_id=knowledge.id
                        ${wheres != null ? "WHERE " + sql : ""} ${SQLUtils.getPagination(pagination)};`;
            let [res] = await this.conn.query(sql, values);
            return Transformer.getInstance().jsonToInstance(Courses, res);
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    async selectDetail(wheres, keys, pagination){
        try {
            let { sql, values } = SQLUtils.getWheres(wheres);

            sql = `select ${SQLUtils.getKeys(keys)} from 
                    (
                        SELECT table1.*, knowledge.*, profile.name,
                            table2.score, table3.nummark, table4.numlesson, table5.numlearner
                        FROM (
                            SELECT courses.*, count(comment.id) as numcmt FROM courses
                            left join comment on courses.knowledge_id = comment.knowledge_id
                            group by courses.knowledge_id
                        ) as table1 join (
                            SELECT courses.*, avg(score.score) - 1 as score
                            from courses 
                            left join score on courses.knowledge_id = score.knowledge_id 
                            GROUP by courses.knowledge_id
                        ) as table2 on table1.knowledge_id = table2.knowledge_id join (
                            SELECT courses.*, count(mark.email) as nummark
                            from courses 
                            left join mark on courses.knowledge_id = mark.knowledge_id 
                            GROUP by courses.knowledge_id
                        ) as table3 on table1.knowledge_id = table3.knowledge_id join (
                            SELECT courses.*, count(courses_lesson.lesson_id) as numlesson
                            from courses 
                            left join courses_lesson on courses.knowledge_id = courses_lesson.courses_id 
                            GROUP by courses.knowledge_id
                        ) as table4 on table1.knowledge_id = table4.knowledge_id join (
                            SELECT courses.*, count(learn.email) as numlearner
                            from courses 
                            left join learn on courses.knowledge_id = learn.courses_id 
                            GROUP by courses.knowledge_id
                        ) as table5 on table1.knowledge_id = table5.knowledge_id
                        join knowledge on table1.knowledge_id = knowledge.id
                        join profile on knowledge.owner_email = profile.email
                    ) as courses
                        ${wheres != null ? "WHERE " + sql : ""} 
                        ${SQLUtils.getPagination(pagination)};`;

            let [res] = await this.conn.query(sql, values);
            return res;
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    async selectDetailJoinLearn(wheres, keys, pagination){
        try {
            let { sql, values } = SQLUtils.getWheres(wheres);

            sql = `select ${SQLUtils.getKeys(keys)} from 
                    (
                        SELECT table1.*, knowledge.*, profile.name,
                            table2.score, table3.nummark, table4.numlesson, table5.numlearner
                        FROM (
                            SELECT courses.*, count(comment.id) as numcmt FROM courses
                            left join comment on courses.knowledge_id = comment.knowledge_id
                            group by courses.knowledge_id
                        ) as table1 join (
                            SELECT courses.*, avg(score.score) - 1 as score
                            from courses 
                            left join score on courses.knowledge_id = score.knowledge_id 
                            GROUP by courses.knowledge_id
                        ) as table2 on table1.knowledge_id = table2.knowledge_id join (
                            SELECT courses.*, count(mark.email) as nummark
                            from courses 
                            left join mark on courses.knowledge_id = mark.knowledge_id 
                            GROUP by courses.knowledge_id
                        ) as table3 on table1.knowledge_id = table3.knowledge_id join (
                            SELECT courses.*, count(courses_lesson.lesson_id) as numlesson
                            from courses 
                            left join courses_lesson on courses.knowledge_id = courses_lesson.courses_id 
                            GROUP by courses.knowledge_id
                        ) as table4 on table1.knowledge_id = table4.knowledge_id join (
                            SELECT courses.*, count(learn.email) as numlearner
                            from courses 
                            left join learn on courses.knowledge_id = learn.courses_id 
                            GROUP by courses.knowledge_id
                        ) as table5 on table1.knowledge_id = table5.knowledge_id
                        join knowledge on table1.knowledge_id = knowledge.id
                        join profile on knowledge.owner_email = profile.email
                    ) as courses
                    left join learn on courses.knowledge_id = learn.courses_id
                        ${wheres != null ? "WHERE " + sql : ""} 
                        ${SQLUtils.getPagination(pagination)};`;

            let [res] = await this.conn.query(sql, values);
            return res;
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    async update(course, wheres) {
        try {
            let courseObj = SQLUtils.getSets(course);
            let whereObj = SQLUtils.getWheres(wheres);

            let sql = `update courses join knowledge on courses.knowledge_id=knowledge.id 
                   set ${courseObj.sql} where ${whereObj.sql}`;
            let [res] = await this.conn.query(sql, [...courseObj.values, ...whereObj.values]);
            return res;
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    async delete(wheres) {
        try {
            let listId = await this.select(wheres, ["courses.knowledge_id"]);
            listId = listId.map(e => e.knowledge_id);

            let sql1 = `delete from courses where knowledge_id in (?)`;
            let sql2 = `delete from knowledge where id in (?)`;
            let [res1] = await this.conn.query(sql1, listId);
            let [res2] = await this.conn.query(sql2, listId);

            return res1 && res2;
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    async getNumCourses(email) {
        try {
            let sql = `SELECT COUNT(id) FROM knowledge join courses on knowledge.id = courses.knowledge_id WHERE owner_email = '${email}'`;
            let [num] = await this.conn.query(sql);
            return num[0]['COUNT(id)'];
        } catch (error) {
            console.log(error);
            return 0;
        }
    }
}

module.exports = CoursesDAO;