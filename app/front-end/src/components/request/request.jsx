
import React from "react";
import DomainConfig from "../../config/domain-config";
import Session from "../../session/session";
import './request.css';
import Button from "../button/button";
import MyMutex from "../../utils/mutex";
import PostAPI from "../../services/api/post-api";
import Toast from "../../utils/toast";
import DeleteAPI from "../../services/api/delete-api";

class Request extends React.Component{
    constructor(props){
        super(props);
        this.state = {

        }
        this.buttonMutex = new MyMutex();
    }


    render(){
        let {width, height, focus, request} = this.props;
        request = this.request = this.formatRequest(request);
        this.state.data = {
            avatar: request.avatar,
            name: request.name
        }
        if (focus == "course"){
            this.state.data = {
                avatar: request.thumbnail,
                name: request.title
            }
        }

        if (width) height = width * 1.6;
        else if (height) width = height / 1.6;
        else { width = 100, height = 160};

        return (
            <div className="request-card" style={{width: width + "px", height: height + "px", flexDirection: 'column', borderRadius: '4px', overflow: 'hidden',
                border: 'solid violet 1px', boxShadow: '0px 0px 4px 0px rgba(150, 0, 150, 0.75)', backgroundColor: 'rgba(230, 230, 230, 1)', cursor: 'pointer' }}
            >  
                <img style={{width: width + "px", height: width + "px"}} 
                    src = {this.state.data.avatar} alt = {this.state.data.name}
                    onClick={this.clickAvatar}
                />

                <div className="request-info" style={{ width: width + "px", height: 0.6*width + "px", backgroundColor: 'rgba(230, 230, 230, 1)', flexDirection: 'column'}}>
                    <div className="request-name" style={{height: '50%', justifyContent: 'flex-start', alignItems: 'flex-start', padding: '4px 8px', lineHeight: '16px'
                        }}
                    >
                        <p style={{width: 'auto', fontSize: '16px', fontWeight: '700', justifyContent: 'flex-start', alignItems: 'flex-start', }}
                            onClick={this.clickName}
                        >{this.state.data.name}</p>
                    </div>
                    <div className="request-button" style={{height: '50%', padding: '4px 8px'}}>
                        { this.getButton() }
                    </div>
                </div>
            </div>
        );
    }

    getButton = () => {
        let request = this.request;
        let isRequest = (request.type == "request");
        let mainUser = Session.getInstance().mainUser;
        if (mainUser == null) return null;
        if (mainUser.email == request.email) { // learner
            if (isRequest) { // mainUser là người gửi request đi
                return <Button 
                    className="cancelRequest" 
                    text={"Hủy yêu cầu"} 
                    onclick={this.cancelRequest} 
                    style={{width: '100%'}} 
                />
            } else { // mainUser là người nhận được invite
                return <div style={{backgroundColor: 'inherit'}}>
                    <Button 
                        className = "acceptRequest" 
                        text = {"Đồng ý"} 
                        onclick = { this.acceptRequest } 
                        style = {{ width: '100%', margin: '0px 4px', fontSize: '12px', padding: '6px 8px'}} 
                    />
                    <Button 
                        className="denyRequest" 
                        text={"Từ chối"} 
                        onclick={ this.denyRequest } 
                        style={ {width: '100%', margin: '0px 4px', fontSize: '12px', padding: '6px 8px'}} 
                    />
                </div>
            }
        }
        // owner
        if (isRequest){ // mainUser là người nhận được request
            return <div style={{backgroundColor: 'inherit'}}>
                <Button 
                    className = "acceptRequest" 
                    text = {"Đồng ý"} 
                    onclick = { this.acceptRequest } 
                    style = {{ width: '100%', margin: '0px 4px', fontSize: '12px', padding: '6px 8px'}} 
                />
                <Button 
                    className="denyRequest" 
                    text={"Từ chối"} 
                    onclick={ this.denyRequest } 
                    style={ {width: '100%', margin: '0px 4px', fontSize: '12px', padding: '6px 8px'}} 
                />
            </div>
        } else { // mainUser là người gửi invite đi
            return <Button 
                className="cancelRequest" 
                text={"Hủy lời mời"} 
                onclick={this.cancelRequest} 
                style={{width: '100%'}} 
            />
        }
        return <>No choose</>
    }

    clickName = (event) => {

    }

    clickAvatar = (event) => {

    }

    cancelRequest = async (event) => {
        let request = this.request;
        let subURL = "", successMessage = "";
        if (request.type == "request"){
            // cancel send request
            subURL = "/api/courses/request/" + request.courses_id;
            successMessage = "Đã hủy yêu cầu tham gia khóa học";
        } else {
            // cancel send invite
            subURL = "/api/courses/invite/phuctv@gmail.com/" + request.courses_id;
            successMessage = "Đã hủy lời mời tới user";
        }
        if (!await this.buttonMutex.lock()) return;
        let updateListRequest = this.props.updateListRequest;

        try {
            let res = await PostAPI.getInstance()
                .setURL(DomainConfig.domainAPI + subURL)
                .setToken(Session.getInstance().token)
                .execute();
            if (res.code != 200) throw new Error(res.message);
            Toast.getInstance().success(successMessage, 1000);
            updateListRequest();
        } catch (e) {
            Toast.getInstance().error(e.message);
        } finally {
            this.buttonMutex.unlock();
        }
    }
    
    acceptRequest = async (event) => {
        let request = this.request;
        let subURL = "", successMessage = "";
        if (request.type == "request"){
            // cancel send request
            subURL = "/api/courses/request/" + request.id;
            successMessage = "Đã chấp nhận yêu cầu tham gia khóa học";
        } else {
            // cancel send invite
            subURL = "/api/courses/invite/" + request.id;
            successMessage = "Đã chấp nhận lời mời tham gia khóa học";
        }
        if (!await this.buttonMutex.lock()) return;
        let updateListRequest = this.props.updateListRequest;

        try {
            let res = await DeleteAPI.getInstance()
                .setURL(DomainConfig.domainAPI + subURL)
                .setToken(Session.getInstance().token)
                .setBody({type: 1})
                .execute();
            if (res.code != 200) throw new Error(res.message);
            Toast.getInstance().success(successMessage, 1000);
            updateListRequest();
        } catch (e) {
            Toast.getInstance().error(e.message);
        } finally {
            this.buttonMutex.unlock();
        }
    }

    denyRequest = async (event) => {
        let request = this.request;
        let subURL = "", successMessage = "";
        if (request.type == "request"){
            // cancel send request
            subURL = "/api/courses/request/" + request.id;
            successMessage = "Đã từ chối yêu cầu tham gia khóa học";
        } else {
            // cancel send invite
            subURL = "/api/courses/invite/" + request.id;
            successMessage = "Đã từ chối lời mời tham gia khóa học";
        }
        if (!await this.buttonMutex.lock()) return;
        let updateListRequest = this.props.updateListRequest;

        try {
            let res = await DeleteAPI.getInstance()
                .setURL(DomainConfig.domainAPI + subURL)
                .setToken(Session.getInstance().token)
                .setBody({type: 0})
                .execute();
            if (res.code != 200) throw new Error(res.message);
            Toast.getInstance().success(successMessage, 1000);
            updateListRequest();
        } catch (e) {
            Toast.getInstance().error(e.message);
        } finally {
            this.buttonMutex.unlock();
        }
    }

    formatRequest = (req)=>{
        req.avatar = req.avatar || DomainConfig.domain + "/src/assets/null_user.png";
        req.thumbnail = req.thumbnail || DomainConfig.domain + "/src/assets/knowledge-icon.jpg";

        return req;
    }

}

export default Request;

