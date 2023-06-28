


import React from 'react';
import withRouter from '../../components/router/withRouter';
import Layout from '../../components/layout/layout';
import Session from '../../session/session';
import GetAPI from '../../services/api/get-api';
import Header from '../../components/layout/header/header';
import DomainConfig from '../../config/domain-config';
import Toast from '../../utils/toast';
import Separate from '../../components/separate/separate';
import Button from '../../components/button/button';
import TextInput from '../../components/inputfield/text-input';
import Banner from '../../components/layout/banner/banner';
import PostAPI from '../../services/api/post-api';
import Popup from '../../components/popup/popup';
import ChooseLessonPopup from '../../components/course/choose-lesson-popup/choose-lesson-popup';



class CourseManage extends React.Component{
    constructor(props){
        super(props);
        this.courseid = props.router.params.courseid;
        this.mainUser = Session.getInstance().mainUser;

        this.state = {
            course: null,
            listLesson: [],
            isShowAddLessonPopup: false
        }
    }

    componentDidMount() {
        this.getCourse();
        this.getListLesson();
    }

    getCourse = async () => {
        try {
            let res = await GetAPI.getInstance()
                .setURL(DomainConfig.domainAPI + '/api/courses/detail/' + this.courseid)
                .setToken(Session.getInstance().token)
                .execute();
            if (res.code >= 300 || res.code < 200)
                throw Error(res.message);
            res = res.data;
            this.state.course = res;
            this.setState(this.state);
        } catch (e){
            Toast.getInstance().error(e.message);
        }
    }

    getListLesson = async () => {
        try {
            let res = await GetAPI.getInstance()
                .setURL(DomainConfig.domainAPI + '/api/lesson/list?courseid=' + this.courseid)
                .setToken(Session.getInstance().token)
                .execute();
            if (res.code >= 300 || res.code < 200)
                throw Error(res.message);
            res = res.data;
            this.state.listLesson = res;
            this.setState(this.state);
        } catch (e){
            Toast.getInstance().error(e.message);
        }
    }


    render(){
        let { style } = this.props;
        if (this.state.course == null)
            return this.nullCourse("Không tìm thấy khóa học");
        if ((this.mainUser == null) || (this.mainUser.email != this.state.course.owner_email))
            return this.nullCourse("Không có quyền quản lý khóa học");

        let listLesson = this.state.listLesson;

        return <Layout header={<Header active={1}/>} >
            <Banner />
            <div style={{...style, width: '90%', margin: '72px 0px 72px 0px', flexDirection: 'column'}}>
                <div style={{justifyContent: 'space-between', fontSize: '24px', fontWeight: '500', margin: '0px 0px 12px 0px'}}>
                    {"Quản lý danh sách bài học của khóa học"}     
                    <div style={{width: 'auto'}}>
                        <Button text="Thêm bài học" onclick={this.showAddLessonPopup} />
                    </div>
                </div>
                <Separate style={{margin: '12px 0px 24px 0px'}} />
                {
                    listLesson.length <= 0 ?
                    "Hiện chưa có bài học nào" :
                    this.getContent()
                }
            </div>
            { this.state.isShowAddLessonPopup ? this.getAddLessonPopup() : null}
        </Layout>;
    }

    nullCourse(message){
        return <Layout  header={<Header active={1}/>}>
            <div 
                style={{
                    justifyContent:'center',
                    alignItems: 'center',
                    height: '75vh',
                    fontSize: '26px',
                    fontWeight: '500',
                    color: 'violet',
                    fontFamily: 'revert-layer',
                    backgroundColor: 'rgba(0, 0, 0, 0.1)'
                }}
            > {message} </div>
        </Layout>
    }

    getContent = (event) => {
        let course = this.state.course;
        let listLesson = this.state.listLesson;
        
        return null;
    }

    getAddLessonPopup = () => {
        let { course } = this.state;
        return <Popup>
            <div style={{width: '90%', height: 'auto', maxHeight: '80vh', borderRadius: '6px', flexDirection:'column', padding: '48px 24px'}}>
                <ChooseLessonPopup course={course}>

                </ChooseLessonPopup>
                <div style={{width: '50%'}}>
                    <div>
                        <Button text="Xong" onclick={this.hideAddLessonPopup} style={{width: '150px', fontSize: '14px', margin: '0px 6px'}} />
                    </div>
                </div>
            </div>
        </Popup>
    }

    hideAddLessonPopup = (event) => {
        this.state.isShowAddLessonPopup = false;
        this.getListLesson();
        this.setState(this.state);
    }

    showAddLessonPopup = (event) => {
        this.state.isShowAddLessonPopup = true;
        this.setState(this.state);
    }

    payCourse = async () => {
        try {
            if (! this.validatePayment() ) return;
            let { learner, course, owner, money, password} =  this.state;

            let res = await PostAPI.getInstance()
                .setURL(DomainConfig.domainAPI + "/api/courses/pay/" + course.knowledge_id)
                .setToken(Session.getInstance().token)
                .setData({
                    money: money,
                    password: password
                })
                .execute();
            if (res.code != 200) throw new Error(res.message);
            Toast.getInstance().success("Thanh toán khóa học thành công");
            this.props.router.navigate('/course-detail/' + course.knowledge_id);
        } catch (e) {
            Toast.getInstance().error(e.message);
        }

    }

    validatePayment = () => {
        try {
            let {money, password} = this.state;
            
            if (!(money && money > 0))
                throw new Error("Số tiền không hợp lệ");

            if (!(password && password.length > 0))
                throw new Error("Mật khẩu không hợp lệ");

            return true;
        } catch (e) {
            Toast.getInstance().error(e.message)
            return false;
        }
    }
}


export default withRouter(CourseManage);
