

import React from "react";
import DomainConfig from "../../config/domain-config";
import './lesson-card.css';
import withRouter from "../router/withRouter";
import Toast from "../../utils/toast";
import PostAPI from "../../services/api/post-api";
import Session from "../../session/session";


class LessonCard extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            mark: props.lesson.ismark
        }
    }

    render(){
        let {lesson, style} = this.props;
        this.lesson = lesson;
        this.formatLesson(lesson);
        return (
            <div className="lesson-card" style={{...style}} onClick={this.clickLesson}>
                { this.getThumbnail() }
                { this.getLessonInfo() }
            </div>
        );
    }

    getThumbnail(){
        let lesson = this.lesson;
        return <div className="leson-thumbnail" style={{width: '75px', justifyContent:'flex-start', borderRadius: '4px'}}>
            <img src={lesson.thumbnail} alt={lesson.title} />
        </div>;
    }

    getLessonInfo(){
        let lesson = this.lesson;
        return <div className="lesson-info" >
            <div className="li-info">
                <div style={{
                    justifyContent: 'flex-start',
                    fontSize: '20px',
                    fontWeight: '500'
                }}>
                    {lesson.title}
                </div>
                <div className="lesson-author" 
                    style={{justifyContent: 'flex-start', cursor: 'pointer'}} >
                    {lesson.name}
                </div>
            </div>
            <div className="li-mark" style={{width: 'auto', height: '100%'}}>
                {this.getSave()}
            </div>
        </div>
    }

    getSave(){
        if (this.state.mark){
            return <img onClick={this.unsave} src={DomainConfig.domain + "/src/assets/unsave.png"} 
                style={{width: '45px'}}
            />
        } else {
            return <img onClick={this.save} src={DomainConfig.domain + "/src/assets/save.png"} 
                style={{width: '45px'}}
            />
        }
    }

    formatLesson = (lesson) => {
        lesson.thumbnail = lesson.thumbnail || DomainConfig.domain + "/src/assets/knowledge-icon.jpg"
        lesson.ismark = lesson.ismark || 0;
        return lesson;
    }

    clickLesson = (event) => {
        // navigate to lesson
    }

    save = (event) => {
        this.state.mark = true;
        this.setState(this.state);
        this.markLesson(1);
    }

    unsave = (event) => {
        this.state.mark = false;
        this.setState(this.state);
        this.markLesson(0);
    }

    markLesson = async (type) => {
        let lesson = this.lesson;
        let updateLesson = this.props.updateLesson;
        let successString = (type == 1 ? "Đã đánh dấu" : "Đã bỏ đánh dấu");
        try {
            let res = await PostAPI.getInstance()
                .setURL(DomainConfig.domainAPI + "/api/knowledge/mark/" + lesson.knowledge_id)
                .setToken(Session.getInstance().fixedToken)
                .setBody({type: type})
                .execute();
            if (res.code != 200) throw new Error(res.message);
            Toast.getInstance().success(successString);
            lesson.ismark = type;
            updateLesson(lesson);
        } catch (e) {
            Toast.getInstance().error(e.message);
        }
    }
}

export default withRouter(LessonCard);

