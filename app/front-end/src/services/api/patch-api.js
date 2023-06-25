import API from "./api";
import axios from "axios";

class PatchAPI extends API{
    static instance = null;
    static getInstance(){
        if (this.instance == null) this.instance = new PatchAPI();
        return this.instance;
    }

    constructor(){
        super();
    }

    updateMethod(){
        try { this.setMethod("PATCH") }
        catch (e) { throw e }
    }

    async getResult(config){
        try {
            return await axios.patch(this.url, this.data, this.config);
        } catch (e){
            throw e;
        }
    }
}


export default PatchAPI;
