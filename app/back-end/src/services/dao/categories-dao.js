const SQLUtils = require("../../utils/sql-utils");

class CategoriesDAO{
    static instance = null;
    static getInstance() {
        if (this.instance == null) this.instance = new CategoriesDAO();
        return this.instance;
    }
    constructor(){
        this.conn = global.connection;
    }

    async getCategories(knid){
        try{
            let categories = await this.select({
                knowledge_id: knid
            }, ['categories']);
            if (categories == null) return null;
            return categories.map(category => category.categories);
        } catch(e){
            console.log(e);
            return null;
        }
    }

    async insert(knowledge){
        try {
            let values = knowledge.categories.map(category => [knowledge.id, category]);
            let sql = `insert into categories(knowledge_id, categories) values ?`;
            let [res] = await this.conn.query(sql, values);
            return res;
        } catch(e){
            console.log(e);
            return null;
        }
    }

    async select(wheres, keys, pagination){
        try{
            let { sql, values } = SQLUtils.getWheres(wheres);
            sql = `SELECT ${SQLUtils.getKeys(keys)} from categories ${sql != null ?
                "WHERE " + sql : ""} ${SQLUtils.getPagination(pagination)};`;
            let [res] = await global.connection.query(sql, values);
            return res;
        } catch(e){
            console.log(e);
            return null;
        }
    }

    async delete(wheres){
        try {
            let {sql, values} = SQLUtils.getWheres(wheres);
            sql = `delete from categories where ${sql};`;
            let [res] = await this.conn.query(sql, values);
            return res;
        } catch(e){
            console.log(e);
            return null;
        }
    }
}

module.exports = CategoriesDAO;