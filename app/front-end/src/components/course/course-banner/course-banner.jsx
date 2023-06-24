

import React from "react";
import './course-banner.css';
import NavBar from "../../navbar/navbar";
import CourseRegisterButton from '../course-register-button';
import MyRoute from "../../router/route";
import DomainConfig from "../../../config/domain-config";
import CourseContext from "../../../pages/course/course-context";


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
            isfee: 0,
            fee: 1000000,
            numlesson: 10,
            learning_time: 100,
        }
        this.state = {}; 
    }

    preRender(){
        this.links = [{
            title: 'Bài học',
            onClick: () => {
                this.context.updateNavbarIndex(0)
            }
            }, {
                title: 'Thảo luận',
                onClick: () => {
                    this.context.updateNavbarIndex(1)
                }
            }, {
                title: 'Thành viên',
                onClick: () => {
                    this.context.updateNavbarIndex(2)
                }
            }, {
                title: 'Yêu cầu',
                onClick: () => {
                    this.context.updateNavbarIndex(3)
                }
            }, {
                title: 'Lời mời',
                onClick: () => {
                    this.context.updateNavbarIndex(4)
                }
            }
        ];
    }

    render(){
        this.preRender();
        this.course = this.context.state.course;
        if (this.course == null) this.course = this.courseDefault;
        return this.courseHeader();
    }

    courseHeader(){
        return (
            <div className="course-header">
                <div className="course-bg" 
                    style={{
                        background: "url('" + DomainConfig.domain + "/src/assets/course-bg.png') center center/cover",
                        height: '33vw'
                }} >
                    <div style={{ backgroundColor: 'rgba(50, 0, 50, 0.75)', height: '100%' }}>
                    </div>
                </div>

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
            
            <NavBar style = {{}}
                active = {this.context.state.navbarIndex}
                links = {this.links}
            />

        </div>;
    }

    CIInfo(){
        return <div className="ci-info">
            <div className="ci-avatar" style={{padding: '0 16px 0 0'}}>
                <img src={this.course.thumbnail} alt="Course thumbnail" style={{borderRadius: '8px'}} />
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


    CICost(){
        return <div className="ci-cost">
            <p> {"Thời gian: " + (this.course.learning_time ? (this.course.learning_time + " phút") : "Chưa có")} </p>
            <p style={{justifyContent: 'flex-start', marginBottom: '12px'}}>
                {"Số bài học: " + this.course.numlesson}
            </p>
            {this.courseCost()}
            <CourseRegisterButton course = {this.course} style ={{margin: '12px'}} />
    
        </div>
    }

    courseCost(){
        if (this.course.isfee){
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


export default CourseBanner;
