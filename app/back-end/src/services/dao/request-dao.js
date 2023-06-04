const Request = require("../../models/request");
const Transformer = require("../../utils/class-transformer");
const SQLUtils = require("../../utils/sql-utils");


class RequestDAO{
    static instance = null;
    static getInstance() {
        if (this.instance == null) this.instance = new RequestDAO();
        return this.instance;
    }
    constructor(){
        this.conn = global.connection;
    }

    async insert(request){
        try {	
            let value = [request.owner_email, request.learner_email, request.courses_id, 
                         request.type, request.time];
            let sql = `insert into request(owner_email, learner_email, courses_id, type, time) 
                        value (?, ?, ?, ?, ?);`;
            let [res] = await this.conn.query(sql, value);
            request.id = res.insertId;
            return request;
        } catch(e){
            console.log(e);
            return null;
        }
    }

    async getById(id, keys){
        try {
            let sql = `select ${SQLUtils.getKeys(keys)} from request where request.id=?`;
            let [res] = await this.conn.query(sql, [id]);
            return Transformer.getInstance().jsonToInstance(Request, res[0]);
        } catch(e){
            console.log(e);
            return null;
        }
    }

    async select(wheres, keys, pagination){
        try{
            let {sql, values} = SQLUtils.getWheres(wheres);

            sql = `select ${SQLUtils.getKeys(keys)} from request
                        ${wheres != null ? "WHERE " + sql : ""} ${SQLUtils.getPagination(pagination)};`;
            let [res] = await this.conn.query(sql, values);
            return Transformer.getInstance().jsonToInstance(Request, res);     
        } catch(e){
            console.log(e);
            return null;
        }
    }
    
    async selectDetailRequest(wheres, keys, pagination){
        try{
            let {sql, values} = SQLUtils.getWheres(wheres);

            sql = `select ${SQLUtils.getKeys(keys)} from request 
                    join profile on request.learner_email = profile.email
                    join knowledge on request.courses_id = knowledge.id
                    where type = 'request'
                        ${wheres != null ? "AND " + sql : ""} ${SQLUtils.getPagination(pagination)};`;
                        
            let [res] = await this.conn.query(sql, values);
            return res;     
        } catch(e){
            console.log(e);
            return null;
        }
    }

    async selectDetailInvite(wheres, keys, pagination){
        try{
            let {sql, values} = SQLUtils.getWheres(wheres);

            sql = `select ${SQLUtils.getKeys(keys)} from request 
                    join profile on request.learner_email = profile.email
                    join knowledge on request.courses_id = knowledge.id
                    where type = 'invite'
                        ${wheres != null ? "and " + sql : ""} ${SQLUtils.getPagination(pagination)};`;
            let [res] = await this.conn.query(sql, values);
            return res;     
        } catch(e){
            console.log(e);
            return null;
        }
    }

    async update(request, wheres){
        try{
            let requestObj = SQLUtils.getSets(request);
            let whereObj = SQLUtils.getWheres(wheres);

            let sql = `update request
                   set ${requestObj.sql} where ${whereObj.sql}`;
            let [res] = await this.conn.query(sql, [...requestObj.values, ...whereObj.values]);
            return res;     
        } catch(e){
            console.log(e);
            return null;
        }
    }

    async delete(wheres){
        try {
            let whereObj = SQLUtils.getWheres(wheres);
            let sql = `delete from request where ${whereObj.sql}`;
            let [res] = await this.conn.query(sql, whereObj.values);
            return res;  
        } catch(e){
            console.log(e);
            return null;
        }
    }
}

module.exports = RequestDAO;