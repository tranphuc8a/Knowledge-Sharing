const Account = require("../../models/account");
const Transformer = require("../../utils/class-transformer");
const SQLUtils = require("../../utils/sql-utils");

class AccountDAO {
    static instance = null;

    static getInstance() {
        if (this.instance == null) {
            this.instance = new AccountDAO();
        }
        return this.instance
    }

    async insert(account) {
        try {
            let value = [account.email, account.password, account.role, account.warning];
            let query = `INSERT into account(email, password, role, warning) value (?, ?, ?, ?);`;
            let [res] = await global.connection.query(query, value);

            return Transformer.getInstance().jsonToInstance(Account, account);
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    // get by id (with keys or not)
    async getById(email, keys) {
        try {
            // check email null
            if (email == null) return null;

            // create query keys
            let queryKeys;
            if (keys == null) {
                queryKeys = '*';
            } else {
                queryKeys = keys.map(key => `${key}`).join(', ');
            }

            let query = `SELECT ${queryKeys} from account where email = '${email}'`;

            // query
            let [account] = await global.connection.query(query);

            return Transformer.getInstance().jsonToInstance(Account, account[0]);

        } catch (error) {
            return null;
        }
    }

    // select
    async select(wheres, keys, pagination) {
        try {
            let { sql, values } = SQLUtils.getWheres(wheres);
            sql = `SELECT ${SQLUtils.getKeys(keys)} from account ${sql != null ?
                "WHERE " + sql : ""} ${SQLUtils.getPagination(pagination)};`;
            let [res] = await global.connection.query(sql, values);

            return Transformer.getInstance().jsonToInstance(Account, res);

        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async update(account, wheres) {
        try {
            let accountObj = SQLUtils.getSets(account);
            let wheresObj = SQLUtils.getWheres(wheres);

            let sql = `UPDATE account set ${accountObj.sql} where ${wheresObj.sql}`;
            let [res] = await global.connection.query(sql, [...accountObj.values, ...wheresObj.values]);

            return res;

        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async delete(wheres) {
        try {
            let whereObj = SQLUtils.getWheres(wheres);
            let sql = `DELETE from account where ${whereObj.sql};`;
            let [res] = await global.connection.query(sql, whereObj.values);
            return res;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

}

module.exports = AccountDAO;