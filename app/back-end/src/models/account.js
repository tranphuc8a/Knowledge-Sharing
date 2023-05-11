
class Account {
    constructor(email, password, role, warning) {
        this.email = email;
        this.password = password;
        this.role = role;
        this.warning = warning;
    }
}

module.exports = Account;