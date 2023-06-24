import DomainConfig from "../config/domain-config";
import PostAPI from "../services/api/post-api";


class Session{
    static instance = null;
    static getInstance(){
        if (this.instance == null) this.instance = new Session();
        return this.instance;
    }

    constructor(){
        this.observers = [];
        try {
            this.fixedToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRyYW5waHVjOGFAZ21haWwuY29tIiwiaWF0IjoxNjg3NTc5NDg5LCJleHAiOjE2ODg0NDM0ODl9.FmPplgbPmt8PPNCTk5q3Ok2MaQz5WBlNnMhsk0MECZA"
            this.mainUser = null;
            this.token = localStorage.getItem("token");
            this.refreshToken = localStorage.getItem("refreshToken");
            // to set data to storage: localStorage.setItem("key", "value")
            if (this.token != null)
                this.validateToken();
        } catch (e){
            throw e;
        }
    }

    async validateToken(){
        try {
            let res = await new PostAPI()
                .setURL(DomainConfig.domainAPI + "/api/auth/validateToken")
                .setToken(this.token)
                .execute();
            if (res.data == null) return;
            this.mainUser = res.data;
            this.notify();
        } catch (e){
            throw e;
        }
    }

    isAnonymous(){
        return this.mainUser == null;
    }

    saveToken(token){
        this.token = token;
        localStorage.setItem("token", token);
    }

    saveRefreshToken(refreshToken){
        this.refreshToken = refreshToken;
        localStorage.setItem("refreshToken", refreshToken);
    }

    // Observable
    attach(observer){
        this.observers.push(observer);
    }
    detach(observer){
        this.observers.remove(observer);
    }
    notify(){
        this.observers.forEach(e => e.updateSession());
    }
}

export default Session;
