
import React from "react";
import GetAPI from "../../../services/api/get-api";
import DomainConfig from "../../../config/domain-config";
import Session from "../../../session/session";
import Toast from "../../../utils/toast";
import Button from "../../button/button";
import withRouter from "../../router/withRouter";
import Separate from "../../separate/separate";
import TextInput from "../../inputfield/text-input";
import LessonCard from "../../lesson/lesson-card";
import PostAPI from "../../../services/api/post-api";

class ChooseLessonPopup extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            course: null,
            listLesson: [],
            filterLesson: [],
            keyword: ''
        }
    }

    componentDidMount(){
        this.getListLesson();
    }

    getListLesson = async () => {
        let { course } = this.props;
        if (course == null) return null;
        let email = course.owner_email;
        try {
            let res = await GetAPI.getInstance()
                .setURL(DomainConfig.domainAPI + "/api/lesson/list/")
                .setBody({email: email})
                .setToken(Session.getInstance().token)
                .execute();
            if (res.code != 200) throw new Error(res.message);
            this.state.listLesson = res.data;
            this.setState(this.state);
        } catch (e){
            Toast.getInstance().error(e.message);
            return null;
        }
    }

    render(){
        let {style } = this.props;
        let { listLesson } = this.state;
        this.state.course = this.props.course;
        let numLessons = listLesson ? listLesson.length : 0;
        return (
            <div style={{flexDirection: 'column', width: '100%', ...style}}>
                <div style={{fontSize: '18px', fontWeight: '500', justifyContent: 'space-between'}}>
                    {"Thêm bài học vào khóa học"}
                    <Button text="Thêm bài học mới" onclick={this.addNewLesson} style={{width: 'auto'}} />
                </div>
                <div style={{fontSize: '18px', fontWeight: '500', justifyContent: 'space-between'}}>
                    {"Tìm kiếm:" }
                    <TextInput 
                        placeholder = {"Nhập từ khóa tìm kiếm"}
                        value = {this.state.keyword}
                        onchange = {this.onchangeKeyword}
                        style={{width: 'auto', fontSize: '16px'}}
                    />
                </div>
                <Separate />
                {
                    (numLessons > 0) ? 
                    this.getContent() : 
                    "Hiện bạn chưa có bài học nào"
                }
                <Separate style={{margin: '12px 0px 36px 0px'}} />
            </div>  
        );
    }

    onchangeKeyword = (keyword) => {
        this.state.keyword = keyword;
        this.setState(this.state);
    }

    addLesson = async (lesson) => {
        let course = this.state.course;
        try {
            let res = await PostAPI.getInstance()
                .setURL(DomainConfig.domainAPI + "/api/courses/lesson/" 
                    + course.knowledge_id + "/" + lesson.knowledge_id)
                .setToken(Session.getInstance().token)
                .setBody({offset: course.numlesson})
                .execute();
            if (res.code != 200) throw new Error(res.message);
            this.state.course.numlesson += 1;
            this.setState(this.state);
            Toast.getInstance().success("Đã thêm bài học vào khóa học");
        } catch (e){
            Toast.getInstance().error(e.message);
        }
    }

    addNewLesson = (event) => {
        this.props.router.navigate('/lesson-create/');
    }

    getContent = () => {
        let filterLesson = this.state.listLesson.filter((lesson) => {
            return lesson.title.toLowerCase().includes(this.state.keyword.toLowerCase());
        });        
        // console.log(filterLesson);
        return <div style={{ flexDirection: 'column', height: '300px', overflow: 'auto', alignItems: 'flex-start', justifyContent: 'flex-start'}}>
            {
                filterLesson.map((lesson, index) => {
                    return <div key={index} style={{ justifyContent: 'space-evenly', margin: '12px 0px' }}> 
                        <LessonCard style={{width: '70%', fontSize: 'smaller'}} lesson={lesson} />
                        <Button text="Thêm" onclick={(event) => { this.addLesson(lesson); }} 
                            style={{fontSize: 'smaller'}}
                        />
                    </div>
                } )
            }
        </div>
    }
}

export default withRouter(ChooseLessonPopup);

