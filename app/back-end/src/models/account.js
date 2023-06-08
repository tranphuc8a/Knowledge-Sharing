
class Account {
    constructor(account) {
        if (account == null) return;
        this.email = account.email;
        this.password = account.password;
        this.role = account.role;
        this.warning = account.warning;
        this.time = account.time;
    }
}

module.exports = Account;