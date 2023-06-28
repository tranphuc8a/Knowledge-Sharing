import API from "./api";
import axios from "axios";

class GetAPI extends API{
    static instance = null;
    static getInstance(){
        if (this.instance == null) this.instance = new GetAPI();
        return this.instance;
    }

    constructor(){
        super();
    }

    updateMethod(){
        try { this.setMethod("GET") }
        catch (e) { throw e }
    }

    async getResult(){
        try {
            return await axios.get(this.url, this.config);
        } catch (e){
            throw e;
        }
    }
}


export default GetAPI;
