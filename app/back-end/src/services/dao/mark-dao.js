const Mark = require("../../models/mark");
const Transformer = require("../../utils/class-transformer");
const SQLUtils = require("../../utils/sql-utils");



class MarkDAO {
    static instance = null;

    static getInstance() {
        if (this.instance == null) {
            this.instance = new MarkDAO();
        }
        return this.instance
    }

    async insert(mark) {
        try {
            let value = [mark.email, mark.knowledge_id, mark.time];
            let query = `INSERT into mark(email, knowledge_id, time) value (?, ?, ?);`;
            let [res] = await global.connection.query(query, value);

            return res;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    // select
    async select(wheres, keys, pagination) {
        try {
            let { sql, values } = SQLUtils.getWheres(wheres);
            sql = `SELECT ${SQLUtils.getKeys(keys)} from mark ${sql != null ?
                "WHERE " + sql : ""} ${SQLUtils.getPagination(pagination)};`;
            let [res] = await global.connection.query(sql, values);

            return Transformer.getInstance().jsonToInstance(Mark, res);

        } catch (error) {
            console.log(error);
            return null;
        }
    }
    async selectDetail(wheres, keys, pagination){
        try {
            let { sql, values } = SQLUtils.getWheres(wheres);
            sql = `SELECT ${SQLUtils.getKeys(keys)} from mark
                    join profile on mark.email = profile.email
                    join knowledge on mark.knowledge_id = knowledge.id
                    left join lesson on knowledge.id = lesson.knowledge_id
                    left join courses on knowledge.id = courses.knowledge_id
                    ${sql != null ? "WHERE " + sql : ""} 
                    ${SQLUtils.getPagination(pagination)};`;
            let [res] = await global.connection.query(sql, values);
            return res;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async update(mark, wheres) {
        try {
            let markObj = SQLUtils.getSets(mark);
            let wheresObj = SQLUtils.getWheres(wheres);

            let sql = `UPDATE mark set ${markObj.sql} where ${wheresObj.sql}`;
            let [res] = await global.connection.query(sql, [...markObj.values, ...wheresObj.values]);

            return res;

        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async delete(wheres) {
        try {
            let whereObj = SQLUtils.getWheres(wheres);
            let sql = `DELETE from mark where ${whereObj.sql};`;
            let [res] = await global.connection.query(sql, whereObj.values);
            return res;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
}

module.exports = MarkDAO;
