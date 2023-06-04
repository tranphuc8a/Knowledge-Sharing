const Learn = require("../../models/learn");
const Transformer = require("../../utils/class-transformer");
const SQLUtils = require("../../utils/sql-utils");
const RequestDAO = require("./request-dao");


class LearnDAO{
    static instance = null;
    static getInstance() {
        if (this.instance == null) this.instance = new LearnDAO();
        return this.instance;
    }
    constructor(){
        this.conn = global.connection;
    }

    async insert(learn){
        try {
            RequestDAO.getInstance().delete({
                learner_email: learn.email,
                courses_id: learn.courses_id
            });
            let value = [learn.email, learn.courses_id, learn.time];
            let sql = `insert into learn(email, courses_id, time) value (?, ?, ?);`;
            let [res] = await this.conn.query(sql, value);
            return res;
        } catch(e){
            console.log(e);
            return null;
        }
    }

    async select(wheres, keys, pagination){
        try{
            let {sql, values} = SQLUtils.getWheres(wheres);
            sql = `select ${SQLUtils.getKeys(keys)} from learn
                        ${wheres != null ? "WHERE " + sql : ""} ${SQLUtils.getPagination(pagination)};`;
            let [res] = await this.conn.query(sql, values);
            return Transformer.getInstance().jsonToInstance(Learn, res);     
        } catch(e){
            console.log(e);
            return null;
        }
    }

    async update(learn, wheres){
        try{
            let learnObj = SQLUtils.getSets(learn);
            let whereObj = SQLUtils.getWheres(wheres);

            sql = `update learn set ${learnObj.sql} where ${whereObj.sql}`;
            let [res] = await this.conn.query(sql, [...learnObj.values, ...whereObj.values]);
            return res;     
        } catch(e){
            console.log(e);
            return null;
        }
    }

    async delete(wheres){
        try {
            let whereObj = SQLUtils.getWheres(wheres);
            let sql = `delete from learn where ${whereObj.sql}`;
            let [res] = await this.conn.query(sql, whereObj.values);
            return res;  
        } catch(e){
            console.log(e);
            return null;
        }
    }
}

module.exports = LearnDAO;