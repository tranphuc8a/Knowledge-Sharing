// const { connection } = require("../server");
const Account = require("../models/account");
const Transformer = require("../utils/class-transformer");

class AccountDAO {
    static instance = null;

    //singleton
    static getInstance() {
        if (this.instance == null) {
            this.instance = new AccountDAO();
        }
        return this.instance
    }

    async getListAccount() {

        try {
            let [listAccount] = await global.connection.query('Select * from `account`');

            return Transformer.getInstance().jsonToInstance(Account, listAccount)
        } catch (error) {
            console.log(error);
            return null;
        }
    }
}

module.exports = AccountDAO;