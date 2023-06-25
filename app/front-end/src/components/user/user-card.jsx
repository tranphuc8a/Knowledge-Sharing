
import React from "react";
import DomainConfig from "../../config/domain-config";
import Toast from "../../utils/toast";
import GetAPI from "../../services/api/get-api";
import Session from "../../session/session";
import './user-card.css';
import Button from "../button/button";
import DeleteAPI from "../../services/api/delete-api";
import PostAPI from "../../services/api/post-api";
import MyMutex from "../../utils/mutex";

class UserCard extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            user: null
        }
        this.buttonMutex = new MyMutex();
    }

    componentDidMount(){
        this.updateUser();
    }

    componentDidUpdate(){
        if (this.state.user == null || this.state.user.email != this.props.user.email)
            this.updateUser();
    }

    render(){
        let {width, height, user} = this.props;
        user = this.state.user || user;
        user = this.user = this.formatUser(user);

        if (width) height = width * 1.6;
        else if (height) width = height / 1.6;
        else { width = 100, height = 160};

        return (
            <div className="user-card" style={{width: width + "px", height: height + "px", flexDirection: 'column', borderRadius: '4px', overflow: 'hidden',
                border: 'solid violet 1px', boxShadow: '0px 0px 4px 0px rgba(150, 0, 150, 0.75)', backgroundColor: 'rgba(230, 230, 230, 1)', cursor: 'pointer' }}
            >  
                <img style={{width: width + "px", height: width + "px"}} 
                    src = {user.avatar} alt = {user.name}
                    onClick={this.clickAvatar}
                />

                <div className="user-info" style={{ width: width + "px", height: 0.6*width + "px", backgroundColor: 'rgba(230, 230, 230, 1)', flexDirection: 'column'}}>
                    <div className="user-name" style={{height: '50%', justifyContent: 'flex-start', alignItems: 'flex-start', padding: '4px 8px', lineHeight: '16px'
                        }}
                    >
                        <p style={{width: 'auto', fontSize: '16px', fontWeight: '700', justifyContent: 'flex-start', alignItems: 'flex-start', }}>{user.name}</p>
                    </div>
                    <div className="user-button" style={{height: '50%', padding: '4px 8px'}}>
                        {this.getButton()}
                    </div>
                </div>
            </div>
        );
    }

    getButton = () => {
        let user = this.user;
        if (user.relation == null) return null;
        if (user.relation == "MYSELF" || user.relation == "ME") return null;
        if (user.relation == "FOLLOWING" || user.relation == "BOTH") {
            return <Button className="unfollow" text="Hủy theo dõi" onclick={this.unfollow} style={{width: '100%'}} />
        }
        return <Button className="follow" text="Theo dõi" onclick={this.follow}  style={{width: '100%'}}/>
        // Others: FOLLOWED, UNKNOWN, ...
    }

    unfollow = async (event) => {
        if (!await this.buttonMutex.lock()) return;

        let user = this.user;
        try {
            let res = await DeleteAPI.getInstance()
                .setURL(DomainConfig.domainAPI + "/api/follow")
                .setBody({followedEmail: user.email})
                .setToken(Session.getInstance().token)
                .execute();
            if (res.code != 200) throw new Error(res.message);
            Toast.getInstance().success("Unfollowed", 1000);
            this.updateUser();
        } catch (e) {
            Toast.getInstance().error(e.message);
        } finally {
            this.buttonMutex.unlock();
        }
    }

    follow = async (event) => {
        if (!await this.buttonMutex.lock()) return;

        let user = this.user;
        try {
            let res = await PostAPI.getInstance()
                .setURL(DomainConfig.domainAPI + "/api/follow")
                .setBody({followedEmail: user.email})
                .setToken(Session.getInstance().token)
                .execute();
            if (res.code != 200) throw new Error(res.message);
            Toast.getInstance().success("Followed user", 1000);
            this.updateUser();
        } catch (e) {
            Toast.getInstance().error(e.message);
        } finally {
            this.buttonMutex.unlock();
        }
    }

    updateUser = async () => {
        let user = this.props.user;
        try {
            let res = await GetAPI.getInstance()
                .setURL(DomainConfig.domainAPI + "/api/profile/" + user.email)
                .setToken(Session.getInstance().token)
                .execute();
            if (res.code != 200) throw new Error(res.message);
            this.state.user = res.data;
            this.setState(this.state);
        } catch (e) {
            Toast.getInstance().error(e.message);
        }
    }

    formatUser = (user) => {
        user.avatar = user.avatar || DomainConfig.domain + "/src/assets/null_user.png";

        return user;
    }

    clickAvatar = (event) => {

    }
}

export default UserCard;

