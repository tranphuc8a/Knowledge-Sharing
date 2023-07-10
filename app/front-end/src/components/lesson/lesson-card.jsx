

import React from "react";
import DomainConfig from "../../config/domain-config";
import './lesson-card.css';
import withRouter from "../router/withRouter";
import Mark from "../discussion/mark/mark";


class LessonCard extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            mark: props.lesson.isMark
        }
    }

    render(){
        let {lesson, style} = this.props;
        this.lesson = lesson;
        this.formatLesson(lesson);
        return (
            <div className="lesson-card" style={{ justifyContent: 'space-between', ...style}} onClick={this.clickLesson}>
                { this.getThumbnail() }
                { this.getLessonInfo() }
            </div>
        );
    }

    getThumbnail(){
        let lesson = this.lesson;
        return <div className="leson-thumbnail" style={{width: '75px', height: '75px', justifyContent:'flex-start', borderRadius: '4px', overflow: 'hidden'}}>
            <img src={lesson.thumbnail} alt={lesson.title} style={{width: '100%', height: '100%'}} />
        </div>;
    }

    getLessonInfo(){
        let lesson = this.lesson;
        return <div className="lesson-info" style={{flex: '1'}} >
            <div className="li-info" style={{ justifyContent: 'flex-start', alignItems: 'flex-start'}}>
                <div style={{
                    justifyContent: 'flex-start',
                    fontSize: '20px',
                    fontWeight: '500'
                }}>
                    {lesson.title}
                </div>
                <div className="lesson-author" 
                    style={{justifyContent: 'flex-start', cursor: 'pointer', width: 'auto'}} 
                    onClick={this.clickName}
                >
                    {lesson.name}
                </div>
            </div>
            <div className="li-mark" style={{width: 'auto', height: '100%'}}>
                <Mark knowledge={lesson} style={{width: '100%'}} />
            </div>
        </div>
    }


    formatLesson = (lesson) => {
        lesson.thumbnail = lesson.thumbnail || DomainConfig.domain + "/src/assets/knowledge-icon.jpg"
        lesson.isMark = lesson.isMark || 0;
        return lesson;
    }

    clickLesson = (event) => {
        event.stopPropagation();
        // navigate to lesson detail
        this.props.router.navigate('/lesson-detail/' + this.props.lesson.knowledge_id);
    }

    clickName = (event) => {
        event.stopPropagation();
        // navigate to profile page
        this.props.router.navigate('/profile?email=' + this.props.lesson.owner_email);
    }

}

export default withRouter(LessonCard);

