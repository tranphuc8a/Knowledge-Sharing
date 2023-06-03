
class Code {
    static TypeCode = {
        REGISTER: 'register',
        FORGOT_PASSWORD: 'forgot password'
    }

    constructor(code) {
        if (code == null) return;
        this.id = code.id;
        this.code = code.code;
        this.type = code.type;
        this.email = code.email;
        this.time = code.time;
    }
}

module.exports = Code;