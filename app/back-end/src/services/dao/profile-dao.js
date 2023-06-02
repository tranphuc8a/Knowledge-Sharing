const Profile = require("../../models/profile");


class ProfileDAO {
    static instance = null;

    static getInstance() {
        if (this.instance == null)
            this.instance = new ProfileDAO();
        return this.instance;
    }

    // only use insert when creating account
    async insert(profile) {
        try {
            let value = [profile.email, profile.name, profile.avatar, profile.dob, profile.phone,
            profile.gender, profile.address, profile.job, profile.social_link, profile.description, profile.visible];
            let query = `INSERT into profile(email, name, avatar, dob, phone, 
                gender, address, job, social_link, description, visible) value (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
            let [res] = await global.connection.query(query, value);

            return Transformer.getInstance().jsonToInstance(Profile, profile);
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    // get by id (with keys or not)
    async getById(email, keys) {
        try {
            // check email null
            if (email == null) return null;

            // create query keys
            let queryKeys;
            if (keys == null) {
                queryKeys = '*';
            } else {
                queryKeys = keys.map(key => `${key}`).join(', ');
            }

            let query = `SELECT ${queryKeys} from profile where email = '${email}'`;

            // query
            let [profile] = await global.connection.query(query);

            return Transformer.getInstance().jsonToInstance(Profile, profile[0]);

        } catch (error) {
            console.log(error);
            return null;
        }
    }

    // select
    async select(wheres, keys, pagination) {
        try {
            let { sql, values } = SQLUtils.getWheres(wheres);
            sql = `SELECT ${SQLUtils.getKeys(keys)} from profile ${sql != null ?
                "WHERE " + sql : ""} ${SQLUtils.getPagination(pagination)};`;
            let [res] = await global.connection.query(sql, values);

            return Transformer.getInstance().jsonToInstance(Profile, res);

        } catch (error) {
            console.log(error);
            return null;
        }
    }

    // update
    async update(profile, wheres) {
        try {
            let profileObj = SQLUtils.getSets(profile);
            let wheresObj = SQLUtils.getWheres(wheres);

            let sql = `UPDATE profile set ${profileObj.sql} where ${wheresObj.sql}`;
            let [res] = await global.connection.query(sql, [...profileObj.values, ...wheresObj.values]);

            return res;

        } catch (error) {
            console.log(error);
            return null;
        }
    }

    // delete
    async delete(wheres) {
        try {
            let whereObj = SQLUtils.getWheres(wheres);
            let sql = `DELETE from profile where ${whereObj.sql};`;
            let [res] = await global.connection.query(sql, whereObj.values);
            return res;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
}

module.exports = ProfileDAO; 
