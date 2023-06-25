import API from "./api";
import axios from "axios";

class PostAPI extends API{
    static instance = null;
    static getInstance(){
        if (this.instance == null) this.instance = new PostAPI();
        return this.instance;
    }

    constructor(){
        super();
    }

    updateMethod(){
        try { this.setMethod("POST") }
        catch (e) { throw e }
    }

    async getResult(config){
        try {
            if (this.data == null) this.setData({});
            return await axios.post(this.url, this.data, this.config);
        } catch (e){
            throw e;
        }
    }
}


export default PostAPI;
