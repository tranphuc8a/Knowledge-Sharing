
class Payment{
    constructor(payment){
        if (payment == null) return;
        this.id = payment.id;
        this.email = payment.email;
        this.courses_id = payment.courses_id;
        this.money = payment.money;
        this.time = payment.time;
    }
}

module.exports = Payment;