const Score = require("../../models/score");
const Transformer = require("../../utils/class-transformer");


class ScoreDAO{
    static instance = null;
    static getInstance() {
        if (this.instance == null) this.instance = new ScoreDAO();
        return this.instance;
    }
    constructor(){
        this.conn = global.connection;
    }
    
 
    async insert(score){
        try {
            let value = [score.email, score.knowledge_id, score.score, score.time];
            let sql = `insert into score(email, knowledge_id, score, time) 
                        value (?, ?, ?, ?);`;
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

            sql = `select ${SQLUtils.getKeys(keys)} from score
                        ${wheres != null ? "WHERE " + sql : ""} ${SQLUtils.getPagination(pagination)};`;
            let [res] = await this.conn.query(sql, values);
            return Transformer.getInstance().jsonToInstance(Score, res);     
        } catch(e){
            console.log(e);
            return null;
        }
    }

    async update(score, wheres){
        try{
            let scoreObj = SQLUtils.getSets(score);
            let whereObj = SQLUtils.getWheres(wheres);

            sql = `update score set ${scoreObj.sql} where ${whereObj.sql}`;
            let [res] = await this.conn.query(sql, [...scoreObj.values, ...whereObj.values]);
            return res;     
        } catch(e){
            console.log(e);
            return null;
        }
    }

    async delete(wheres){
        try {
            let whereObj = SQLUtils.getWheres(wheres);
            sql = `delete from score where ${whereObj.sql}`;
            let [res] = await this.conn.query(sql, whereObj.values);
            return res;  
        } catch(e){
            console.log(e);
            return null;
        }
    }
}

module.exports = ScoreDAO;