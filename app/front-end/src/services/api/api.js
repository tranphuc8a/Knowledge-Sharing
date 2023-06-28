import axios from "axios";
import ExpiredToken from "../../common/exception/expired-token";
import ExpiredRefreshToken from "../../common/exception/expired-refresh-token";
import Session from "../../session/session";
import DomainConfig from "../../config/domain-config";

class API{
    constructor(){
        try {
            this.methods = ["GET", "POST", "DELETE", "PUT", "PATCH"];
            this.setURL('');
            this.setMethod('GET');
            this.setData({});
            this.setHeaders({
                'Content-Type' : 'application/json;charset=utf-8'
            });
            this.config = {};
        } catch (e){
            throw e;
        }
    }

    setURL(url){
        this.url = url;
        return this;
    }

    setMethod(method){
        try {
            method = method.toUpperCase();
            if (!this.methods.includes(method)) throw new Error();
            this.method = method;
            return this;
        } catch (e){
            throw new Error("Method is invalid: " + method + "\n" + e);
        }
    }

    setHeaders(headers){
        this.headers = headers;
        return this;
    }

    setBody(body){
        this.data = body;
        return this;
    }

    setData(data){
        this.data = data;
        return this;
    }

    setConfig(config){
        try {
            this.config = config;
            this.setURL(config.url);
            this.setMethod(config.method);
            this.setData(config.data || config.body);
            this.setHeaders(config.headers);
            this.setParams(config.params || this.params);
            return this;
        } catch (e){
            throw e;
        }
    }

    setToken(token){
        this.headers.authorization = token;
        return this;
    }

    setContentType(contentType){
        this.headers['Content-Type'] = contentType;
        return this;
    }

    setParams(params){
        this.params = params;
        return this;
    }

    prepareData(){
        this.config = {
            url:        this.url        || this.config.url,
            method:     this.method     || this.config.method,
            data:       this.data       || this.config.data,
            headers:    this.headers    || this.config.headers,
            params:     this.params     || this.config.params
        }
    }

    async getResult(){
        throw new Error("Abstract methods");
    }

    updateMethod(){
        throw new Error("Abstract methods");
    }

    resetData(){
        try {
            this.setURL('');
            this.setMethod('GET');
            this.setData({});
            this.setHeaders({});
            this.setContentType('application/json;charset=utf-8');
            this.setParams({});
        } catch (e) {
            throw e;
        }
    }

    async execute(config){ // template method
        try {
            this.prepareData();
            this.updateMethod();
            console.log("Calling API... " + this.method + " " + this.config.url);
            let res = await this.getResult();
            console.log("Result of " + this.method + " " + this.config.url + ":");
            console.log(res.data);
            if (res.data.message == "Expired token") throw new ExpiredToken();
            this.resetData();
            return res.data;
        } catch (e){
            if (e instanceof ExpiredToken){
                try {
                    console.log("Calling RefreshToken... ");
                    let rs2 = await this.refreshToken();
                    console.log("Result of refreshToken:");
                    console.log(rs2.data);
                    if (res.data.code != 200)
                        throw new ExpiredRefreshToken("Refresh token hết hạn hoặc không có");
                    let token = res.data.data.token;
                    Session.getInstance().saveToken(token);
                    this.setToken(token);
                    return await this.execute();
                } catch (err){
                    throw err; 
                }
            }
            throw e;
        }
    }

    async refreshToken(){
        try {
            return await axios.post(
                DomainConfig.domainAPI + "/api/auth/refreshToken", // url 
                {}, // data
                { // config
                    headers: {
                        authorization: Session.getInstance().refreshToken
                    }
                }
            );
        } catch (e){
            throw e;
        }
    }
    
}

export default API;

/** parameters of axios:
 * 1. url: string
 * 2. data: \data will be sent
 * 3. config: json objet of fields:
 *      - url: same above  (setURL)
 *      - method: 'get', 'post', 'put', 'delete', ...   (setMethod)
 *      - data: same above  (setData, setBody)
 *      - headers: json object of request header:  (setHeader)
 *          + authorization  (setToken)
 *          + 'Content-Type': 'application/json', 'form-data', ... (setContentType)
 *      - params: object of params (setParams)
 *      - timeout: ms
 */
