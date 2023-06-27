import API from "./api";
import axios from "axios";

class PutAPI extends API{
    static instance = null;
    static getInstance(){
        if (this.instance == null) this.instance = new PutAPI();
        return this.instance;
    }

    constructor(){
        super();
    }

    updateMethod(){
        try { this.setMethod("PUT") }
        catch (e) { throw e }
    }

    async getResult(){
        try {
            return await axios.put(this.url, this.data, this.config);
        } catch (e){
            throw e;
        }
    }
}


export default PutAPI;
