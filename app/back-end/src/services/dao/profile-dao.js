

class ProfileDAO{
    static instance = null;
    static getInstance() {
        if (this.instance == null) this.instance = new ProfileDAO();
        return this.instance;
    }
    constructor(){
        this.conn = global.connection;
    }


    async insert(course){
        try {
           
        } catch(e){
            console.log(e);
            return null;
        }
    }

    async getById(id, keys){
        try {
            
        } catch(e){
            console.log(e);
            return null;
        }
    }

    async select(wheres, keys, pagination){
        try{
            
        } catch(e){
            console.log(e);
            return null;
        }
    }

    async update(course, wheres){
        try{
            
        } catch(e){
            console.log(e);
            return null;
        }
    }

    async delete(wheres){
        try {
           
        } catch(e){
            console.log(e);
            return null;
        }
    }
}

module.exports = ProfileDAO; 
