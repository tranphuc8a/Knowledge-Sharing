

class SQLUtils {

    static getKeys(keys) {
        let keysString = '*';
        if (keys != null) {
            keysString = keys.join(', ');
        }
        return keysString;
    }

    static getPagination(pagination) {
        let paginationString = '';
        if (pagination != null) {
            paginationString = `LIMIT ${pagination.length} OFFSET ${pagination.offset}`;
        }
        return paginationString;
    }

    static getWheres(wheres) {
        if (wheres == null) return { sql: null, values: null };
        let sql = [];
        let values = [];
        Object.keys(wheres).forEach((key, index) => {
            sql.push(`${key} = ?`);
            values.push(wheres[key]);
        });
        sql = sql.join(' AND ');
        return { sql, values };
    }

    static getSets(obj) {
        if (obj == null) return { sql: null, values: null };
        let sql = [];
        let values = [];
        Object.keys(obj).forEach((key, index) => {
            sql.push(`${key} = ?`);
            values.push(obj[key]);
        });
        sql = sql.join(', ');
        return { sql, values };
    }

    static getCateWheres(categories) {
        if (categories == null || categories.length == 0) return "";
        let sql = "WHERE " + categories.map(cate => `FIND_IN_SET('${cate}', orderCate.categories) > 0`).join(' AND ');
        return sql;
    }
}

module.exports = SQLUtils;