const Courses = require("../../models/courses");
const Transformer = require("../../utils/class-transformer");
const SQLUtils = require("../../utils/sql-utils");
const CategoriesDAO = require("./categories-dao");

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
            course.knowledge_id = res[0].insertId;

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
            let whereObj = SQLUtils.getWheres(wheres);
            let sql = `delete courses, knowledge from courses join knowledge on courses.knowledge_id=knowledge.id 
                   where ${whereObj.sql}`;
            let [res] = await this.conn.query(sql, whereObj.values);
            return res;
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