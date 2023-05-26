const Login = require("../../models/login");
const Transformer = require("../../utils/class-transformer");
const SQLUtils = require("../../utils/sql-utils");


class LoginDAO {
    static instance = null;

    static getInstance() {
        if (this.instance == null) {
            this.instance = new LoginDAO();
        }
        return this.instance
    }

    async insert(login) {
        try {
            let value = [login.email, login.token, login.refresh_token, login.time];
            let query = `INSERT into login(email, token, refresh_token, time) value (?, ?, ?, ?);`;
            let [res] = await global.connection.query(query, value);
            login.id = res.insertId;

            return Transformer.getInstance().jsonToInstance(Login, login);
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    // get by id (keys is optional)
    async getById(id, keys) {
        try {
            // check id null
            if (id == null) return null;

            // create query keys
            let queryKeys;
            if (keys == null) {
                queryKeys = '*';
            } else {
                queryKeys = keys.map(key => `${key}`).join(', ');
            }

            let query = `SELECT ${queryKeys} from login where id = '${id}'`;

            // query
            let [login] = await global.connection.query(query);

            return Transformer.getInstance().jsonToInstance(Login, login[0]);

        } catch (error) {
            return null;
        }
    }

    // select
    async select(wheres, keys, pagination) {
        try {
            let { sql, values } = SQLUtils.getWheres(wheres);
            sql = `SELECT ${SQLUtils.getKeys(keys)} from login ${sql != null ?
                "WHERE " + sql : ""} ${SQLUtils.getPagination(pagination)};`;
            
            let [res] = await global.connection.query(sql, values);

            return Transformer.getInstance().jsonToInstance(Login, res);

        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async update(login, wheres) {
        try {
            let loginObj = SQLUtils.getSets(login);
            let wheresObj = SQLUtils.getWheres(wheres);

            let sql = `UPDATE login set ${loginObj.sql} where ${wheresObj.sql}`;
            let [res] = await global.connection.query(sql, [...loginObj.values, ...wheresObj.values]);

            return res;

        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async delete(wheres) {
        try {
            let whereObj = SQLUtils.getWheres(wheres);
            let sql = `DELETE from login where ${whereObj.sql};`;
            let [res] = await global.connection.query(sql, whereObj.values);
            return res;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
}

module.exports = LoginDAO;
