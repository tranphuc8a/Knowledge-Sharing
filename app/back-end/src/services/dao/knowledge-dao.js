const Knowledge = require("../../models/knowledge");
const Transformer = require("../../utils/class-transformer");
const SQLUtils = require("../../utils/sql-utils");

class KnowledgeDAO{
    static instance = null;
    static getInstance() {
        if (this.instance == null) this.instance = new KnowledgeDAO();
        return this.instance;
    }
    constructor(){
        this.conn = global.connection;
    }


    async insert(knowledge){
        try {
            let value = [knowledge.owner_email, knowledge.title, knowledge.update_at, 
                         knowledge.create_at, knowledge.thumbnail, knowledge.learning_time];
            let sql = `insert into knowledge(owner_email, title, update_at, create_at, thumbnail, learning_time) 
                        value (?, ?, ?, ?, ?, ?);`;
            let [res] = await this.conn.query(sql, value);
            knowledge.id = res.insertId;

            return knowledge;
        } catch(e){
            console.log(e);
            return null;
        }
    }

    async getById(id, keys){
        try {
            let sql = `select ${SQLUtils.getKeys(keys)} from knowledge where knowledge.id=?`;
            let [res] = await this.conn.query(sql, [id]);
            return Transformer.getInstance().jsonToInstance(Knowledge, res[0]);
        } catch(e){
            console.log(e);
            return null;
        }
    }

    async select(wheres, keys, pagination){
        try{
            let {sql, values} = SQLUtils.getWheres(wheres);

            sql = `select ${SQLUtils.getKeys(keys)} from knowledge
                        ${wheres != null ? "WHERE " + sql : ""} ${SQLUtils.getPagination(pagination)};`;
            let [res] = await this.conn.query(sql, values);
            return Transformer.getInstance().jsonToInstance(Knowledge, res);     
        } catch(e){
            console.log(e);
            return null;
        }
    }

    async update(knowledge, wheres){
        try{
            let knowledgeObj = SQLUtils.getSets(knowledge);
            let whereObj = SQLUtils.getWheres(wheres);

            sql = `update knowledge 
                   set ${knowledgeObj.sql} where ${whereObj.sql}`;
            let [res] = await this.conn.query(sql, [...knowledgeObj.values, ...whereObj.values]);
            return res;     
        } catch(e){
            console.log(e);
            return null;
        }
    }

    async delete(wheres){
        try {
            let whereObj = SQLUtils.getWheres(wheres);
            sql = `delete knowledge, knowledge from knowledge 
                   where ${whereObj.sql}`;
            let [res] = await this.conn.query(sql, whereObj.values);
            return res;  
        } catch(e){
            console.log(e);
            return null;
        }
    }
}

module.exports = KnowledgeDAO;