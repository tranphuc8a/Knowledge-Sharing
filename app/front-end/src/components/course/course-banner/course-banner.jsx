

import React from "react";
import './course-banner.css';
import NavBar from "../../navbar/navbar";
import CourseRegisterButton from '../course-register-button';
import MyRoute from "../../router/route";
import DomainConfig from "../../../config/domain-config";
import CourseContext from "../../../pages/course/course-context";
import Mark from "../../discussion/mark/mark";
import Banner from "../../layout/banner/banner";
import withRouter from "../../router/withRouter";


class CourseBanner extends React.Component{
    static contextType = CourseContext;
    
    constructor(props){
        super(props);        
        this.courseDefault = {
            thumbnail: DomainConfig.domain + '/src/assets/knowledge-icon.jpg',
            title: 'Vai trò của số nguyên tố trong việc thực hiện hành vi nhân đạo',
            name: 'Trần Văn Phúc',
            description: 'Bài học rất hay Bài học rất hay Bài học rất hay Bài học rất hay Bài học rất hay Bài học rất hayBài học rất hay Bài học rất hayBài học rất hay Bài học rất hay Bài học rất hayBài học rất hayBài học rất hayBài học rất hayBài học rất hayBài học rất hayBài học rất hayBài học rất hayBài học rất hayBài học rất hayBài học rất hayBài học rất hayBài học rất hay',
            score: 3.5,
            relative: 1,
            isfree: 0,
            fee: 1000000,
            numlesson: 10,
            learning_time: 100,
        }
        this.state = {}; 
    }

    preRender(){
        let [lesson, discussion, member, request, invite] = [{
                title: 'Bài học',
                onClick: () => { this.context.updateNavbarIndex(0) }
            }, {
                title: 'Thảo luận',
                onClick: () => { this.context.updateNavbarIndex(1) }
            }, {
                title: 'Thành viên',
                onClick: () => { this.context.updateNavbarIndex(2) }
            }, {
                title: 'Yêu cầu',
                onClick: () => { this.context.updateNavbarIndex(3) }
            }, {
                title: 'Lời mời',
                onClick: () => { this.context.updateNavbarIndex(4) }
            }
        ];
        switch (this.course.relevant){
            case 0:
                this.links = [lesson, discussion];
                break;
            case 1:
                this.links = [lesson, discussion];
                break;
            case 2:
                this.links = [lesson, discussion, member];
                break;
            case 3:
                this.links = [lesson, discussion, member];
                break;
            case 4:
                this.links = [lesson, discussion, member, request, invite];
                break;
            default:
                this.links = [];
        }
    }

    render(){
        this.course = this.context.state.course;
        this.preRender();
        if (this.course == null) this.course = this.courseDefault;
        return this.courseHeader();
    }

    courseHeader(){
        return (
            <div className="course-header">
                <Banner />

                { this.courseBanner() }
            </div>
        );
    }

    

    courseBanner(){
        return <div className="course-banner">
            <div className="course-info">
                {this.CIInfo()}
                {this.CICost()}        
            </div>;

            <div style={{
                borderTop: "solid gray 1px",
                width: '100%'
            }} ></div>
            
            <div style={{ justifyContent: 'space-between' }}>
                <NavBar style = {{}}
                    active = {this.context.state.navbarIndex}
                    links = {this.links}
                />
                <Mark knowledge={this.course} style={{width: '40px'}} />
            </div>

        </div>;
    }

    CIInfo(){
        return <div className="ci-info">
            <div className="ci-avatar" style={{padding: '0 16px 0 0'}}>
                <img src={this.course.thumbnail} alt="Course thumbnail" style={{borderRadius: '8px', maxHeight: ''}} />
            </div>
            <div className="ci-info-info">
                <p className="ci-title">{this.course.title}</p>
                <div className="ci-name" style={{justifyContent: 'flex-start', fontSize: '14px', marginBottom: '12px'}}>
                    <span style={{width: 'auto', marginRight: '4px'}}> Tác giả: </span>
                    <p 
                        style={{ cursor: 'pointer', width: 'auto'}} 
                        onClick={this.clickAuthor}> 
                        {this.course.name} </p>
                </div>
                <p className="ci-description">{this.course.description}</p>
                <div className="ci-name" style={{justifyContent: 'flex-start', fontSize: '14px', marginTop: '12px'}}>
                    <span style={{width: 'auto', marginRight: '4px'}}> Score: </span>
                    <p 
                        style={{width: 'auto'}} > 
                        {this.course.score} </p>
                </div>
            </div>
        </div>;
    }

    clickAuthor = (event) => {
        event.stopPropagation();
        // navigate to profile page
        this.props.router.navigate('/profile?email=' + this.course.owner_email);
    }

    CICost(){
        return <div className="ci-cost">
            <p> {"Thời gian: " + (this.course.learning_time ? (this.course.learning_time + " phút") : "Chưa có")} </p>
            <p style={{justifyContent: 'flex-start', marginBottom: '12px'}}>
                {"Số bài học: " + this.course.numlesson}
            </p>
            {this.courseCost()}
            <CourseRegisterButton updateCourse={this.context.getCourse} course = {this.course} style ={{margin: '12px'}} />
    
        </div>
    }

    courseCost(){
        if (this.course.isfree == 1){
            return <div>
                {"Khóa học miễn phí"}
            </div>
        } else {
            return <div>
                {"Giá: " + this.course.fee + " VNĐ"} 
            </div>
        }
    }

}


export default withRouter(CourseBanner);
