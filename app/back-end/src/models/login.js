
class Login {
    constructor(login) {
        if (login == null) return;
        this.email = login.email;
        this.token = login.token;
        this.refresh_token = login.refresh_token;
        this.time = login.time;
    }
}

module.exports = Login;