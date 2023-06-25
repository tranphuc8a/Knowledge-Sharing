
import React from "react";
import GetAPI from "../../../services/api/get-api";
import DomainConfig from "../../../config/domain-config";
import Session from "../../../session/session";
import PostAPI from "../../../services/api/post-api";
import Toast from "../../../utils/toast";
import MyMutex from "../../../utils/mutex";
import {BsBookmark as MarkOutline, BsBookmarkFill as MarkFill} from 'react-icons/bs';

class Mark extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            mark: props.knowledge.isMark
        }
        this.markMutex = new MyMutex();
    }

    render(){
        let { style, knowledge } = this.props;

        if (this.state.mark == 1){
            return <MarkFill onClick={this.unsave} src={DomainConfig.domain + "/src/assets/unsave.png"} 
                style={{...style, cursor: 'pointer'}}
            />
        } else {
            return <MarkOutline onClick={this.save} src={DomainConfig.domain + "/src/assets/save.png"} 
                style={{...style, cursor: 'pointer'}}
            />
        }
    }

    unsave = async (event) => {
        await this.markKnowledge(0);
    }

    save = async (event) => {
        await this.markKnowledge(1);
    }

    markKnowledge = async (type) => {
        if (!this.markMutex.lock()) return;

        let knowledge = this.props.knowledge;
        let successString = (type == 1 ? "Đã đánh dấu" : "Đã bỏ đánh dấu");
        try {
            let res = await PostAPI.getInstance()
                .setURL(DomainConfig.domainAPI + "/api/knowledge/mark/" + knowledge.id)
                .setToken(Session.getInstance().token)
                .setBody({type: type})
                .execute();
            if (res.code != 200) throw new Error(res.message);
            Toast.getInstance().success(successString);
            knowledge.isMark = type;
            this.state.mark = type;
            this.setState(this.state);
        } catch (e) {
            Toast.getInstance().error(e.message);
        } finally {
            this.markMutex.unlock();
        }
    }
}

export default Mark;

