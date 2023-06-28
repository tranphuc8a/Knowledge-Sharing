


import React from "react";
import Comment from "./comment";
import Button from "../../button/button";
import Popup from "../../popup/popup";
import { AiOutlineReload } from "react-icons/ai";
import TextField from "../../inputfield/textfield";
import Toast from "../../../utils/toast";
import PostAPI from "../../../services/api/post-api";
import DomainConfig from "../../../config/domain-config";
import Session from "../../../session/session";
import GetAPI from "../../../services/api/get-api";
import Separate from "../../separate/separate";


class ListComment extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            listComment: [],
            isShowPopup: false
        }
    }

    componentDidMount(){
        this.updateListComment();
    }

    render(){
        let { knowledge, style } = this.props;
        this.knowledge = knowledge;
        let { listComment } = this.state;
        listComment.sort((comma, commb) => comma.time <= commb.time);
        
        return (
            <div style={{...style, flexDirection: 'column'}}>
                <Separate />
                <div style={{justifyContent: 'space-between', fontSize: '24px', fontWeight: '500', margin: '0px 0px 36px 0px'}}>
                    {"Danh sách bình luận"}
                    <Button text="Thêm bình luận" onclick={this.addComment} />
                </div>
                <div style={{flexDirection: 'column'}}>
                    {
                        (listComment == null || listComment.length <= 0) ?
                        (
                            <div style={{fontSize: '20px', fontWeight: '500', margin: '0px 0px 36px 0px'}}>
                                {"Chưa có bình luận"}
                            </div>
                        ) : (
                            listComment.map((comment, index) => {
                                return <Comment updateListComment={this.updateListComment} style = {{margin: '16px 0px'}} comment={comment} key={index}/>
                            })
                        )
                    }
                </div>
                { this.state.isShowPopup ? this.commentPopup() : null}
            </div>
        );
    }

    commentPopup = () => {
        return <Popup> 
            <div style={{width: '60%', height: 'auto', maxHeight: '80vh', borderRadius: '6px', flexDirection:'column', padding: '48px 24px'}}>
                <div style={{flexDirection: 'column', width: '90%'}}>
                    <div style={{fontSize: '24px', fontWeight: '500'}}>
                        {"Thêm bình luận"}
                        <AiOutlineReload style={{fill:"violet", width: '40px', margin: '0 12px', cursor:'pointer'}} 
                            onClick={this.resetComment}
                        />
                    </div>
                    <TextField 
                        style={{ margin: '32px', padding: '0px 24px' }} 
                        onchange={(text) => {this.state.comment = text; this.setState(this.state)}} 
                        value={this.state.comment} 
                    />

                </div>
                <div style={{width: '50%'}}>
                    <div>
                        <Button text="Thêm bình luận" onclick={this.submitComment} style={{width: '150px', fontSize: '14px', margin: '0px 6px'}}/>
                    </div>
                    <div>
                        <Button text="Hủy bỏ" onclick={this.cancelComment} style={{width: '150px', fontSize: '14px', margin: '0px 6px'}} />
                    </div>
                </div>
            </div>
        </Popup>
    }

    updateListComment = async () => {
        let knowledge = this.props.knowledge;
        if (knowledge == null) return;
        try{
            let rs = await GetAPI.getInstance()
                .setURL(DomainConfig.domainAPI + "/api/knowledge/comment/" + knowledge.id)
                .setToken(Session.getInstance().token)
                .execute();
            if (rs.code != 200) throw new Error(rs.message);
            this.state.listComment = rs.data.data;
            this.setState(this.state);
        } catch (e){
            Toast.getInstance().error(e.message);
        }
    }

    addComment = (event) => {
        this.state.isShowPopup = true;
        this.setState(this.state);
    }

    submitComment = () => {
        let comment = this.state.comment;
        this.state.isShowPopup = false;
        this.setState(this.state);
        if (comment == null || comment.length == ""){
            Toast.getInstance().error("Bình luận không được rỗng");
            return;
        }
        if (Session.getInstance().isAnonymous()){
            // solve for anonymous
        }
        let updateListComment = this.updateListComment;
        let callApi = async () => {
            try {
                let rs = await PostAPI.getInstance()
                    .setURL(DomainConfig.domainAPI + "/api/knowledge/comment/" + this.knowledge.id)
                    .setToken(Session.getInstance().token)
                    .setBody({content: comment})
                    .execute();
                if (rs.code == 200){
                    // update list comment
                    updateListComment();
                    Toast.getInstance().success("Đã thêm bình luận");
                } else throw new Error(rs.message);
            } catch (e) {
                Toast.getInstance().error(e.message);
            }
        }
        callApi();
    }

    cancelComment = () => {
        this.state.isShowPopup = false;
        this.setState(this.state);
    }
    
    resetComment = () => {
        this.state.comment = "";
        this.setState(this.state);
    }
}


export default ListComment;

