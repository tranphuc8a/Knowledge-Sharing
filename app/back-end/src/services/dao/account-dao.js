// const { connection } = require("../server");
const Account = require("../models/account");
const Transformer = require("../utils/class-transformer");

class AccountDAO {
    static instance = null;

    static getInstance() {
        if (this.instance == null) {
            this.instance = new AccountDAO();
        }
        return this.instance
    }

}

module.exports = AccountDAO;