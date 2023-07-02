
import React from "react";
import GetAPI from "../../../services/api/get-api";
import DomainConfig from "../../../config/domain-config";
import Session from "../../../session/session";
import Toast from "../../../utils/toast";
import CourseCard from "../course-card/course-card";
import Separate from "../../separate/separate";
import Button from "../../button/button";
import withRouter from "../../router/withRouter";

class ListCourse extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            listCourse: [],
            isUpdateApi: true
        }
        this.isMe = false;
        let email = this.props.email;
        let mainUser = Session.getInstance().mainUser;
        if (mainUser && mainUser.email == email) this.isMe = true;
    }

    componentDidMount() {
        this.updateListCourse();
    }

    componentDidUpdate () {
        if (this.state.isUpdateApi) {
            this.state.isUpdateApi = false;
            this.updateListCourse();
        }
    }

    updateListCourse = async () => {
        let email = this.props.email;
        if (email == null) return null;
        try {
            let res = await new GetAPI()
                .setURL(DomainConfig.domainAPI + "/api/courses/list?email=" + email)
                .setToken(Session.getInstance().token)
                .execute();
            if (res.code != 200) throw new Error(res.message);
            this.state.listCourse = res.data.data || [];
            this.setState(this.state);
        } catch (e) {
            Toast.getInstance().error(e.message);
        }
    }

    render = () => {
        let { style, email } = this.props;
        let listCourse = this.state.listCourse;
        let numCourse = listCourse ? listCourse.length : 0;
        if (numCourse <= 0) return this.nullListCourse();
 
        return (
            <div>
                <div style={{...style, width: '90%', margin: '36px 0px 12px 0px', flexDirection: 'column'}}>
                    <div style={{justifyContent: 'space-between', fontSize: '24px', fontWeight: '500', margin: '0px 0px 12px 0px'}}>
                        { this.isMe ? "Danh sách khóa học của bạn" : "Danh sách khóa học" }
                        { this.isMe && <Button text="Tạo khóa học" onclick = {this.addNewCourse} /> }
                    </div>
                    <Separate />
                    <div style={{ flexDirection: 'column'}} >
                        {listCourse.map((course, index) => {
                            return <CourseCard style={{margin: '12px 0px'}} course={course} key={index}/>
                        })}
                    </div>
                </div>
            </div>
        );
    }

    nullListCourse = () => {
        return <div>
            <div style={{width: '90%', margin: '36px 0px 12px 0px', flexDirection: 'column'}}>
                <div style={{justifyContent: 'flex-start', fontSize: '24px', fontWeight: '500', margin: '0px 0px 12px 0px'}}>
                    { this.isMe ? "Bạn chưa có khóa học nào" : "Không có khóa học" }
                </div>
                <Separate />
                <div style={{ flexDirection: 'column'}} >
                    { this.isMe && <Button text="Thêm khóa học mới" onclick = {this.addNewCourse} /> }
                </div>
            </div>
        </div>
    }

    addNewCourse = (event) => {
        this.props.router.navigate('/course-create/');
    }
    
}

export default withRouter(ListCourse);
