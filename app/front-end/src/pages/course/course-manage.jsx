


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
import LessonCard from '../../components/lesson/lesson-card';
import {BiTrash as Trash} from 'react-icons/bi';
import DeleteAPI from '../../services/api/delete-api';
import PatchAPI from '../../services/api/patch-api';



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
        listLesson.sort((lessonA, lessonB) => lessonA.offset - lessonB.offset);
        listLesson.forEach((lesson, index) => {
            lesson.offset = index;
        })

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
                <Separate style={{margin: '12px 0px 24px 0px'}} />
                <div>
                    <Button text = "Lưu lại" onclick = {this.saveListLesson } />
                    <Button text = "Trở lại khóa học" onclick = {this.backCourse } style = {{margin: '0px 12px'}} />
                </div>
            </div>
            { this.state.isShowAddLessonPopup ? this.getAddLessonPopup() : null}
        </Layout>;
    }

    backCourse = (event) => {
        this.props.router.navigate('/course-detail/' + this.state.course.knowledge_id);
    }

    saveListLesson = async (event) => {
        let listLesson = this.state.listLesson;
        let course = this.state.course;
        try { 
            listLesson.forEach((lesson, index) => {
                lesson.offset = index;
            })
            let res = await PatchAPI.getInstance()
                .setURL(DomainConfig.domainAPI + "/api/courses/listLesson/" + course.knowledge_id)
                .setToken(Session.getInstance().token)
                .setBody({
                    listLesson: listLesson.map((lesson) => ({
                        lessonid: lesson.knowledge_id,
                        offset: lesson.offset
                    }))
                }).execute();
            if (res.code != 200) throw new Error(res.message);
            Toast.getInstance().success("Đã lưu thành công khóa học");
            this.setState(this.state);
            this.getListLesson();
        } catch (e) {
            Toast.getInstance().error(e.message);
        }
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
        
        return <div style={{ flexDirection: 'column' }}>
            {
                listLesson.map((lesson, index) => {
                    return <div style={{ margin: '12px 0px'}} key = {index}>
                        <div style={{ margin: '4px 12px 4px 0px', width: '75px', fontSize: 'larger', fontWeight: 'bold'}}>
                            {"Bài " + lesson.offset}
                        </div>
                        <LessonCard lesson={lesson} style={{width: '100%'}} />
                        <div style={{width: '150px', margin: '0 0 0 12px'}}>
                            <div style={{flexDirection: 'column'}}>
                                <div style={{ margin: '4px 0px'}}>
                                    <Button text="Up" onclick={() => {this.lessonUp(lesson, index)}} 
                                        style={{ fontSize: 'smaller', fontWeight: '400', width: '70px'}}
                                    />
                                </div>
                                <div style={{ margin: '4px 0px'}}>
                                    <Button text="Down" onclick={() => {this.lessonDown(lesson, index)}} 
                                        style={{ fontSize: 'smaller', fontWeight: '400', width: '70px'}}
                                    />
                                </div>
                            </div>
                            <div style={{ backgroundColor: 'violet', width: '50px', height: 'auto', margin: '0px 4px'}}>
                                <Trash style={{fill: 'red', cursor: 'pointer'}} 
                                onClick={ () => { this.deleteLesson(lesson, index) }} 
                            />
                            </div>
                        </div>
                    </div>
                })
            }
        </div>;
    }

    lessonUp = (lesson, index) => {
        try {
            let listLesson = this.state.listLesson;
            if (index == 0) {
                Toast.getInstance().error("Không thể di chuyển lên");
                return;
            }
            listLesson[index] = listLesson[index - 1];
            listLesson[index].offset = index;
            listLesson[index - 1] = lesson;
            listLesson[index - 1].offset = index - 1;
            this.setState(this.state);
        } catch (e) {
            Toast.getInstance().error(e.message);
        }   
    }

    lessonDown = (lesson, index) => {
        try {
            let listLesson = this.state.listLesson;
            if (index >= listLesson.length - 1) {
                Toast.getInstance().error("Không thể di chuyển xuống");
                return;
            }
            listLesson[index] = listLesson[index + 1];
            listLesson[index].offset = index;
            listLesson[index + 1] = lesson;
            listLesson[index + 1].offset = index + 1;
            this.setState(this.state);
        } catch (e) {
            Toast.getInstance().error(e.message);
        }
    }

    deleteLesson = async (lesson, index) => {
        let course = this.state.course;
        let listLesson = this.state.listLesson;
        try {
            let res = await DeleteAPI.getInstance()
                .setURL(DomainConfig.domainAPI + "/api/courses/lesson/"
                    + course.knowledge_id + "/" + lesson.knowledge_id)
                .setToken(Session.getInstance().token)
                .execute();
            if (res.code != 200) throw new Error(res.message);
            Toast.getInstance().success("Đã xóa khóa học khỏi bài học");
            this.state.listLesson.splice(index, 1);
            this.setState(this.state);
        } catch (e) {
            Toast.getInstance().error(e.message);
        }
    }

    getAddLessonPopup = () => {
        let { course } = this.state;
        return <Popup style={{backgroundColor: 'rgba(0, 0, 0, 0.1)'}}>
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
