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
            let sql = `SELECT COUNT(following) FROM follow WHERE followed = '${email}'`;
            let [num] = await this.conn.query(sql);
            return num[0]['COUNT(following)'];
        } catch (error) {
            console.log(error);
            return 0;
        }
    }

    async getNumFollowing(email) {
        try {
            let sql = `SELECT COUNT(followed) FROM follow WHERE following = '${email}'`;
            let [num] = await this.conn.query(sql);
            return num[0]['COUNT(followed)'];
        } catch (error) {
            console.log(error);
            return 0;
        }
    }

    // get relation
    async getRelation(objectiveEmail, email) {
        if (objectiveEmail == email)
            return Follow.Type.MYSELF;

        let following = false;
        let followed = false;

        // check following
        let followingPromise = this.select({ following: objectiveEmail, followed: email })
            .then(follow => {
                if (follow != null && follow.length > 0) {
                    following = true;
                }
            });

        // check followed
        let followedPromise = this.select({ following: email, followed: objectiveEmail })
            .then(follow => {
                if (follow != null && follow.length > 0) {
                    followed = true;
                }
            });;
            
        await Promise.all([followingPromise, followedPromise]);

        // return
        if (following && followed) return Follow.Type.BOTH;
        if (following) return Follow.Type.FOLLOWING;
        if (followed) return Follow.Type.FOLLOWED;
        return Follow.Type.UNKNOWN;
    }
}

module.exports = FollowDAO;