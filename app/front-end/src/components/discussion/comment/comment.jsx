

import React from "react";
import DomainConfig from "../../../config/domain-config";
import Session from "../../../session/session";
import {BiSolidWrench as Wrench, BiSolidTrash as Trash} from 'react-icons/bi'; 
import {AiOutlineReload} from 'react-icons/ai';
import './comment.css';
import Popup from "../../popup/popup";
import TextField from "../../textfield/textfield";
import Button from "../../button/button";
import Toast from "../../../utils/toast";
import PatchAPI from "../../../services/api/patch-api";
import DeleteAPI from "../../../services/api/delete-api";
import withRouter from "../../router/withRouter";
// import './comment-card.css';


class Comment extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            showTool: false
        }
    }

    preRender(){
        this.comment = this.props.comment;
        this.comment = this.formatComment(this.comment);
        this.mainUser = Session.getInstance().mainUser;
        // this.isOwner = (this.mainUser && this.mainUser.email == this.comment.email);
        this.isOwner = true; // temporal
    }

    render(){     
        this.preRender();
        let {comment, style} = this.props;        
        return (
           <div style={{justifyContent:"flex-start", margin: '12px 0px', alignItems: 'flex-start'}}>
                {this.getAvatar()}
                <div style={{width:'auto', justifyContent: 'flex-start'}} 
                    onMouseEnter={this.mouseEnterComment} 
                    onMouseLeave={this.mouseLeaveComment}
                >
                    {this.getComment()}
                    {this.getTool()}
                </div>
                {this.state.isShowUpdateCommentPopup ? this.getUpdateCommentPopup() : null}
                {this.state.isShowDeleteCommentPopup ? this.getDeleteCommentPopup() : null}
                {/* {Toast.container} */}
           </div>
        );
    }

    getAvatar = () => {
        let comment = this.comment;
        return <div style={{width: '75px', justifyContent: 'flex-end'}}>
            <div style={{borderRadius: '50%', margin: '0px 10px', border: 'solid violet 1px', overflow: 'hidden', width: '50px', height: '50px', cursor: 'pointer',}} 
                onClick={this.clickUser}
                >
                <img src={comment.avatar} alt={comment.name} 
                    style={{height: '35px', width: 'auto'}} 
                />
            </div>
        </div>
    }

    getComment = () => {
        let comment = this.comment;
        return <div style={{width: '100%', flexDirection: 'column', borderRadius: '6px', padding: '8px', boxShadow: '0px 0px 4px 0px rgba(0, 0, 0, 0.5)', justifyContent: 'flex-start'}}>
            <div className="comment-name" 
                onClick={this.clickUser}
                style={{ cursor: 'pointer', justifyContent: 'flex-start', fontWeight: '700', lineHeight: '18px', padding: '0px 16px 0px 8px'}}>
                {comment.name}
            </div>
            <div style={{ justifyContent: 'flex-start', alignItems: 'flex-start', textAlign: 'start', fontSize: '10px', padding: '0px 16px 0px 8px'}}>
                {comment.time}
            </div>
            <div style={{ justifyContent: 'flex-start', alignItems: 'flex-start', textAlign: 'justify', padding: '4px 8px 0px 8px' }}>
                {comment.content}
            </div>
        </div>
    }

    getTool = () => {
        return <div style={{width: '50px', flexDirection: "column", visibility: this.state.showTool ? "visible" : "hidden", backgroundColor: 'rgba(0, 0, 0, 0)'}}>
            <div style={{cursor: 'pointer', margin: '4px 0px', width: '30px', height: '30px', border: 'solid violet 1px', borderRadius: '50%', overflow: 'hidden'}}
                onClick={this.showUpdateCommentPopup}
            >
                <Wrench style={{ fill: 'violet' , width: '20px'}} />
            </div>
            <div style={{cursor: 'pointer', margin: '4px 0px', width: '30px', height: '30px', border: 'solid violet 1px', borderRadius: '50%', overflow: 'hidden'}}
                onClick={this.showDeleteCommentPopup}
            >
                <Trash style={{ fill: 'violet' , width: '20px'}} />
            </div>
        </div>
    }

    clickUser = (event) => {
        // navigate to user page
        this.props.router.navigate('/home');
    }

    mouseEnterComment = (event) => {
        if (this.isOwner)
            this.state.showTool = true;
        this.setState(this.state);
    }

    mouseLeaveComment = (event) => {
        this.state.showTool = false;
        this.setState(this.state);
    }
    
    formatComment = (comment) => {
        comment.avatar = comment.avatar || DomainConfig.domain + "/src/assets/null_user.png";
        
        return comment;
    }

    showUpdateCommentPopup = (event) => {
        this.state.isShowUpdateCommentPopup = true;
        this.state.updateComment = this.comment.content;
        this.setState(this.state);
    }

    showDeleteCommentPopup = (event) => {
        this.state.isShowDeleteCommentPopup = true;
        this.setState(this.state);
    }

    cancelBoth = (event) => {
        this.state.isShowUpdateCommentPopup = false;
        this.state.isShowDeleteCommentPopup = false;
        this.setState(this.state);
    }

    getUpdateCommentPopup = () => {
        return <Popup>
            <div style={{width: '60%', height: 'auto', borderRadius: '6px', flexDirection:'column', padding: '48px 24px'}}>
                <div style={{flexDirection: 'column'}}>
                    <div style={{fontSize: '24px', fontWeight: '500'}}>
                        {"Sửa bình luận"}
                        <AiOutlineReload style={{fill:"violet", width: '40px', margin: '0 12px', cursor:'pointer'}} 
                            onClick={this.resetComment}
                        />
                    </div>
                    <TextField 
                        style={{ margin: '32px', padding: '0px 48px' }} 
                        onchange={(text) => {this.state.updateComment = text; this.setState(this.state)}} 
                        value={this.state.updateComment} 
                    />
                </div>
                <div style={{width: '50%'}}>
                    <div>
                        <Button text="Cập nhật" onclick={this.updateComment} style={{width: '150px', margin: '0px 6px'}}/>
                    </div>
                    <div>
                        <Button text="Hủy bỏ" onclick={this.cancelBoth} style={{width: '150px', margin: '0px 6px'}} />
                    </div>
                </div>
            </div>
        </Popup>
    }

    resetComment = (event) => {
        this.state.updateComment = "";
        this.setState(this.state);
    }

    getDeleteCommentPopup = () => {
        return <Popup>
            <div style={{width: '60%', height: 'auto', borderRadius: '6px', flexDirection:'column', padding: '48px 24px'}}>
                <div style={{flexDirection: 'column', margin: '32px 0px'}}>
                    <div style={{fontSize: '24px', fontWeight: '500'}}>
                        {"Bạn có chắc muốn xóa bình luận này không?"}
                    </div>
                </div>
                <div style={{width: '50%'}}>
                    <div>
                        <Button text="Chắc chắn" onclick={this.deleteComment} style={{width: '150px', margin: '0px 6px'}}/>
                    </div>
                    <div>
                        <Button text="Hủy bỏ" onclick={this.cancelBoth} style={{width: '150px', margin: '0px 6px'}} />
                    </div>
                </div>
            </div>
        </Popup>
    }

    updateComment = (event) => {
        let text = this.state.updateComment;
        this.state.isShowUpdateCommentPopup = false;
        this.setState(this.state);
        if (text == null || text.length <= 0) {
            Toast.getInstance().error("Bình luận không được rỗng");
            return;
        }

        if (Session.getInstance().isAnonymous()) {
            // resolve
        }

        let updateListComment = this.props.updateListComment;
        let comment = this.comment;
        let callApi = async () => {
            try {
                let res = await PatchAPI.getInstance()
                    .setURL(DomainConfig.domainAPI + "/api/knowledge/comment/" + comment.id)
                    .setToken(Session.getInstance().fixedToken)
                    .setBody({newContent: text})
                    .execute();
                if (res.code != 200) throw new Error(res.message);
                // success
                Toast.getInstance().success("Đã cập nhật bình luận");
                updateListComment();
            } catch (e){
                Toast.getInstance().error(e.message);
            }
        }
        callApi();
    }

    deleteComment = (event) => {
        let comment = this.comment;
        this.state.isShowDeleteCommentPopup = false;
        this.setState(this.state);
        let updateListComment = this.props.updateListComment;
        let callApi = async () => {
            try {
                let res = await DeleteAPI.getInstance()
                    .setURL(DomainConfig.domainAPI + "/api/knowledge/comment/" + comment.id)
                    .setToken(Session.getInstance().fixedToken)
                    .execute();
                if (res.code != 200) throw new Error(res.message);
                Toast.getInstance().success("Đã xóa bình luận");
                updateListComment();
            } catch (e) {
                Toast.getInstance().error(e.message);
            }
        }
        callApi();
    }
}

export default withRouter(Comment);
