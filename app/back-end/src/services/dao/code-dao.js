const Code = require("../../models/code");
const Transformer = require("../../utils/class-transformer");
const SQLUtils = require("../../utils/sql-utils");


class CodeDAO {
    static instance = null;

    static getInstance() {
        if (this.instance == null) {
            this.instance = new CodeDAO();
        }
        return this.instance
    }

    async insert(code) {
        try {
            let value = [code.email, code.code, code.type, code.time];
            let query = `INSERT into code(email, code, type, time) value (?, ?, ?, ?);`;
            let [res] = await global.connection.query(query, value);
            code.id = res.insertId;

            return Transformer.getInstance().jsonToInstance(Code, code);
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

            let query = `SELECT ${queryKeys} from code where id = '${id}'`;

            // query
            let [code] = await global.connection.query(query);

            return Transformer.getInstance().jsonToInstance(Code, code[0]);

        } catch (error) {
            console.log(error);
            return null;
        }
    }

    // select
    async select(wheres, keys, pagination) {
        try {
            let { sql, values } = SQLUtils.getWheres(wheres);
            sql = `SELECT ${SQLUtils.getKeys(keys)} from code ${sql != null ?
                "WHERE " + sql : ""} ${SQLUtils.getPagination(pagination)};`;

            let [res] = await global.connection.query(sql, values);
            return Transformer.getInstance().jsonToInstance(Code, res);

        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async update(code, wheres) {
        try {
            let codeObj = SQLUtils.getSets(code);
            let wheresObj = SQLUtils.getWheres(wheres);

            let sql = `UPDATE code set ${codeObj.sql} where ${wheresObj.sql}`;
            let [res] = await global.connection.query(sql, [...codeObj.values, ...wheresObj.values]);

            return res;

        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async delete(wheres) {
        try {
            let whereObj = SQLUtils.getWheres(wheres);
            let sql = `DELETE from code where ${whereObj.sql};`;
            let [res] = await global.connection.query(sql, whereObj.values);
            return res;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
}

module.exports = CodeDAO;
