

import React from "react";
import './course-card.css';
import withRouter from "../../router/withRouter";
import DomainConfig from "../../../config/domain-config";
import Mark from "../../discussion/mark/mark";


class CourseCard extends React.Component{
    constructor(props){
        super(props);
        this.state = {
        }
    }

    render(){
        let {course, style} = this.props;
        this.course = course;
        this.formatcourse(course);
        return (
            <div className="course-card" style={{...style}} onClick={this.clickcourse}>
                { this.getThumbnail() }
                { this.getCourseInfo() }
            </div>
        );
    }

    getThumbnail(){
        let course = this.course;
        return <div className="leson-thumbnail" style={{width: '75px', height: '75px', justifyContent:'flex-start', borderRadius: '4px', overflow: 'hidden'}}>
            <img src={course.thumbnail} alt={course.title} style={{width: '100%', height: '100%'}} />
        </div>;
    }

    getCourseInfo(){
        let course = this.course;
        return <div className="course-info" style={{flex: '1'}} >
            <div className="li-info" style={{ justifyContent: 'flex-start', alignItems: 'flex-start'}}>
                <div style={{
                    justifyContent: 'flex-start',
                    fontSize: '20px',
                    fontWeight: '500'
                }}>
                    {course.title}
                </div>
                <div className="course-author" 
                    style={{justifyContent: 'flex-start', cursor: 'pointer', width: 'auto'}} 
                    onClick={this.clickName}
                >
                    {course.name}
                </div>
            </div>
            <div className="li-mark" style={{width: 'auto', height: '100%'}}>
                <Mark knowledge={course} style={{width: '100%'}} />
            </div>
        </div>
    }


    formatcourse = (course) => {
        course.thumbnail = course.thumbnail || DomainConfig.domain + "/src/assets/knowledge-icon.jpg"
        course.isMark = course.isMark || 0;
        return course;
    }

    clickcourse = (event) => {
        // navigate to course detail
        this.props.router.navigate('/course-detail/' + this.props.course.knowledge_id);
    }

    clickName = (event) => {
        event.stopPropagation();
        // navigate to profile page
        this.props.router.navigate('/profile?email=' + this.course.owner_email);
    }

}

export default withRouter(CourseCard);

