const { Transform } = require('class-transformer');
var Transformer = require('../../utils/class-transformer');
const Comment = require('../../models/comment');
const SQLUtils = require('../../utils/sql-utils');

class CommentDAO{
    static instance = null;
    static getInstance() {
        if (this.instance == null) this.instance = new CommentDAO();
        return this.instance;
    }
    constructor(){
        this.conn = global.connection;
    }

    async insert(comment){
        try {
            let value = [comment.email, comment.knowledge_id, comment.content, comment.time]; 
            let sql = `insert into comment(email, knowledge_id, content, time) value (?, ?, ?, ?);`;
            let [res] = await this.conn.query(sql, value);
            comment.id = res.insertId;
            return comment;
        } catch(e){
            console.log(e);
            return null;
        }
    }

    async getById(id, keys){
        try {
            let sql = `select ${SQLUtils.getKeys(keys)} from comment where comment.id=?`;
            let [res] = await this.conn.query(sql, [id]);
            return Transformer.getInstance().jsonToInstance(Comment, res[0]);
        } catch(e){
            console.log(e);
            return null;
        }
    }

    async select(wheres, keys, pagination){
        try{
            let {sql, values} = SQLUtils.getWheres(wheres);

            sql = `select ${SQLUtils.getKeys(keys)} from comment
                        ${wheres != null ? "WHERE " + sql : ""} ${SQLUtils.getPagination(pagination)};`;
            let [res] = await this.conn.query(sql, values);
            return Transformer.getInstance().jsonToInstance(Comment, res);     
        } catch(e){
            console.log(e);
            return null;
        }
    }

    async selectDetail(wheres, keys, pagination){
        try{
            let {sql, values} = SQLUtils.getWheres(wheres);

            sql = `select ${SQLUtils.getKeys(keys)} from comment join profile on comment.email=profile.email
                        ${wheres != null ? "WHERE " + sql : ""} ${SQLUtils.getPagination(pagination)};`;
            let [res] = await this.conn.query(sql, values);
            return res;     
        } catch(e){
            console.log(e);
            return null;
        }
    }

    async update(comment, wheres){
        try{
            let commentObj = SQLUtils.getSets(comment);
            let whereObj = SQLUtils.getWheres(wheres);

            let sql = `update comment 
                   set ${commentObj.sql} where ${whereObj.sql}`;
            let [res] = await this.conn.query(sql, [...commentObj.values, ...whereObj.values]);
            return res;     
        } catch(e){
            console.log(e);
            return null;
        }
    }

    async delete(wheres){
        try {
            let whereObj = SQLUtils.getWheres(wheres);
            let sql = `delete from comment where ${whereObj.sql}`;
            let [res] = await this.conn.query(sql, whereObj.values);
            return res;  
        } catch(e){
            console.log(e);
            return null;
        }
    }
}

module.exports = CommentDAO;