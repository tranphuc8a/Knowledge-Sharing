const Follow = require("../../models/follow");
const Transformer = require("../../utils/class-transformer");
const SQLUtils = require("../../utils/sql-utils");


class FollowDAO {
    static instance = null;
    static getInstance() {
        if (this.instance == null) this.instance = new FollowDAO();
        return this.instance;
    }
    constructor() {
        this.conn = global.connection;
    }

    async insert(follow) {
        try {
            let value = [follow.following, follow.followed, follow.time];
            let query = `INSERT into follow(following, followed, time) value (?, ?, ?);`;
            let [res] = await global.connection.query(query, value);
            return res;
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    async select(wheres, keys, pagination) {
        try {
            let { sql, values } = SQLUtils.getWheres(wheres);
            sql = `SELECT ${SQLUtils.getKeys(keys)} from follow ${sql != null ?
                "WHERE " + sql : ""} ${SQLUtils.getPagination(pagination)};`;
            let [res] = await global.connection.query(sql, values);
            return Transformer.getInstance().jsonToInstance(Follow, res);
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    async delete(wheres) {
        try {
            let { sql, values } = SQLUtils.getWheres(wheres);
            sql = `delete from follow where ${sql};`;
            let [res] = await this.conn.query(sql, values);
            return res;
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    async getNumFollowers(email) {
        try {
            sql = `SELECT COUNT(followed) FROM follow WHERE following = ${email}`;
        } catch (error) {
            console.log(e);
            return null;
        }
    }
}

module.exports = FollowDAO;