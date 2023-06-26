import DomainConfig from "../../config/domain-config";
import Session from "../../session/session";
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

    async postImage(image){
        try {
            let formData = new FormData();
            formData.append('image', image);
            let res = this.setURL(DomainConfig.domainAPI + "/api/image")
                .setToken(Session.getInstance().token)
                .setBody(formData)
                .setContentType('multipart/form-data')
                .execute();
            return res;
        } catch (e) {
            throw e;
        } finally {
            this.setContentType('application/json;charset=utf-8');
        }
    }
}


export default PostAPI;
