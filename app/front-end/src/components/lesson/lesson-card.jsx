

import React from "react";
import DomainConfig from "../../config/domain-config";
import './lesson-card.css';


class LessonCard extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            mark: props.lesson.ismark
        }
    }

    render(){
        let {lesson, style} = this.props;
        this.formatLesson(lesson);
        return (
            <div className="lesson-card" style={{...style}} onClick={this.clickLesson}>
                <div className="leson-thumbnail" style={{width: '75px', justifyContent:'flex-start', borderRadius: '4px'}}>
                    <img src={lesson.thumbnail} alt={lesson.title} />
                </div>
                <div className="lesson-info" >
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
            </div>
        );
    }

    getSave(){
        if (this.state.mark){
            return <img onClick={this.save} src={DomainConfig.domain + "/src/assets/unsave.png"} 
                style={{width: '45px'}}
            />
        } else {
            return <img onClick={this.unsave} src={DomainConfig.domain + "/src/assets/save.png"} 
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

    }

    save = (event) => {
        // call api to mark
        this.setState({
            mark: false
        })
    }

    unsave = (event) => {
        // call api to unmark
        this.setState({
            mark: true
        })
    }
}

export default LessonCard;

