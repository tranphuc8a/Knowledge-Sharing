
class Account {
    constructor(account) {
        this.email = account.email;
        this.password = account.password;
        this.role = account.role;
        this.warning = account.warning;
    }
}

module.exports = Account;