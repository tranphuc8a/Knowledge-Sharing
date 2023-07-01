


import React from "react";
import DomainConfig from "../../../config/domain-config";
import GetAPI from "../../../services/api/get-api";
import Session from "../../../session/session";
import withRouter from "../../router/withRouter";
import Separate from "../../separate/separate";
import LessonCard from "../lesson-card";
import Button from "../../button/button";
import Toast from "../../../utils/toast";

class ListUserLesson extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            listLesson: [],
            isUpdateApi: true
        }
        this.isMe = false;
        let email = this.props.email;
        let mainUser = Session.getInstance().mainUser;
        if (mainUser && mainUser.email == email) this.isMe = true;
    }

    componentDidMount() {
        this.updateListLesson();
    }

    componentDidUpdate () {
        if (this.state.isUpdateApi) {
            this.state.isUpdateApi = false;
            this.updateListLesson();
        }
    }

    updateListLesson = async () => {
        let email = this.props.email;
        if (email == null) return null;
        try {
            let res = await GetAPI.getInstance()
                .setURL(DomainConfig.domainAPI + "/api/lesson/list?email=" + email)
                .setToken(Session.getInstance().token)
                .execute();
            if (res.code != 200) throw new Error(res.message);
            this.state.listLesson = res.data || [];
            this.setState(this.state);
        } catch (e) {
            Toast.getInstance().error(e.message);
        }
    }

    render = () => {
        console.log("Render");
        let { style, email } = this.props;
        let listLesson = this.state.listLesson;
        let numLesson = listLesson ? listLesson.length : 0;
        if (numLesson <= 0) return this.nullListLesson();
 
        return (
            <div>
                <div style={{...style, width: '90%', margin: '36px 0px 12px 0px', flexDirection: 'column'}}>
                    <div style={{justifyContent: 'space-between', fontSize: '24px', fontWeight: '500', margin: '0px 0px 12px 0px'}}>
                        { this.isMe ? "Danh sách bài học của bạn" : "Danh sách bài học" }
                        { this.isMe && <Button text="Tạo bài học" onclick = {this.addNewLesson} /> }
                    </div>
                    <Separate />
                    <div style={{ flexDirection: 'column'}} >
                        {listLesson.map((lesson, index) => {
                            return <LessonCard style={{margin: '12px 0px'}} lesson={lesson} key={index}/>
                        })}
                    </div>
                </div>
            </div>
        );
    }

    nullListLesson = () => {
        <div style={{ width: '90%', margin: '0px 0px 72px 0px', flexDirection: 'column'}}>
            <Separate />
            <div style={{justifyContent: 'flex-start', fontSize: '24px', fontWeight: '500', margin: '0px 0px 36px 0px'}}>
                { this.isMe ? "Bạn chưa có bài học nào" : "Không có bài học" }
            </div>
            <div style={{ flexDirection: 'column'}} >
                { this.isMe && <Button text="Thêm bài học mới" onclick = {this.addNewLesson} /> }
            </div>
        </div>
    }

    addNewLesson = (event) => {
        this.props.router.navigate('/lesson-create/');
    }


    
}


export default withRouter(ListUserLesson);

