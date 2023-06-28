import API from "./api";
import axios from "axios";

class DeleteAPI extends API{
    static instance = null;
    static getInstance(){
        if (this.instance == null) this.instance = new DeleteAPI();
        return this.instance;
    }

    constructor(){
        super();
    }

    updateMethod(){
        try { this.setMethod("DELETE") }
        catch (e) { throw e }
    }

    async getResult(){
        try {
            return await axios.delete(this.url, this.config);
        } catch (e){
            throw e;
        }
    }
}


export default DeleteAPI;
