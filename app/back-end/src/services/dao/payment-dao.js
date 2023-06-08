const { Transform } = require('class-transformer');
var Transformer = require('../../utils/class-transformer');
const Payment = require('../../models/payment');
const SQLUtils = require('../../utils/sql-utils');

class PaymentDAO{
    static instance = null;
    static getInstance() {
        if (this.instance == null) this.instance = new PaymentDAO();
        return this.instance;
    }
    constructor(){
        this.conn = global.connection;
    }

    async insert(payment){
        try {
            let value = [payment.email, payment.courses_id, payment.money, payment.time]; 
            let sql = `insert into payment(email, courses_id, money, time) value (?, ?, ?, ?);`;
            let [res] = await this.conn.query(sql, value);
            payment.id = res.insertId;
            return payment;
        } catch(e){
            console.log(e);
            return null;
        }
    }

    async getById(id, keys){
        try {
            let sql = `select ${SQLUtils.getKeys(keys)} from payment where payment.id=?`;
            let [res] = await this.conn.query(sql, [id]);
            return Transformer.getInstance().jsonToInstance(payment, res[0]);
        } catch(e){
            console.log(e);
            return null;
        }
    }

    async select(wheres, keys, pagination){
        try{
            let {sql, values} = SQLUtils.getWheres(wheres);

            sql = `select ${SQLUtils.getKeys(keys)} from payment
                        ${wheres != null ? "WHERE " + sql : ""} ${SQLUtils.getPagination(pagination)};`;
            let [res] = await this.conn.query(sql, values);
            return Transformer.getInstance().jsonToInstance(Payment, res);     
        } catch(e){
            console.log(e);
            return null;
        }
    }

    async update(payment, wheres){
        try{
            let paymentObj = SQLUtils.getSets(payment);
            let whereObj = SQLUtils.getWheres(wheres);

            let sql = `update payment 
                   set ${paymentObj.sql} where ${whereObj.sql}`;
            let [res] = await this.conn.query(sql, [...paymentObj.values, ...whereObj.values]);
            return res;     
        } catch(e){
            console.log(e);
            return null;
        }
    }

    async delete(wheres){
        try {
            let whereObj = SQLUtils.getWheres(wheres);
            let sql = `delete from payment where ${whereObj.sql}`;
            let [res] = await this.conn.query(sql, whereObj.values);
            return res;  
        } catch(e){
            console.log(e);
            return null;
        }
    }
}

module.exports = PaymentDAO;