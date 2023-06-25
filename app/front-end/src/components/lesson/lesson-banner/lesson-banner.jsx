

import React from "react";
import './lesson-banner.css';
import LessonContext from "../../../pages/lesson/lesson-context";
import DomainConfig from "../../../config/domain-config";
import NavBar from "../../navbar/navbar";
import Mark from "../../discussion/mark/mark";



class LessonBanner extends React.Component{
    static contextType = LessonContext;
    
    constructor(props){
        super(props);        
        this.lessonDefault = {
            thumbnail: DomainConfig.domain + '/src/assets/knowledge-icon.jpg',
            title: 'Vai trò của số nguyên tố trong việc thực hiện hành vi nhân đạo',
            name: 'Trần Văn Phúc',
            description: 'Bài học rất hay Bài học rất hay Bài học rất hay Bài học rất hay Bài học rất hay Bài học rất hayBài học rất hay Bài học rất hayBài học rất hay Bài học rất hay Bài học rất hayBài học rất hayBài học rất hayBài học rất hayBài học rất hayBài học rất hayBài học rất hayBài học rất hayBài học rất hayBài học rất hayBài học rất hayBài học rất hayBài học rất hay',
            score: 3.5,
            learning_time: 100,
            content: "This is content"
        }
        this.state = {}; 
    }

    preRender(){
        let [content, discussion] = [{
                title: 'Nội dung',
                onClick: () => { this.context.updateNavbarIndex(0) }
            }, {
                title: 'Thảo luận',
                onClick: () => { this.context.updateNavbarIndex(1) }
            }
        ];
        this.links = [content, discussion];
    }

    render(){
        this.lesson = this.context.state.lesson;
        this.preRender();
        if (this.lesson == null) this.lesson = this.lessonDefault;
        return this.lessonHeader();
    }

    lessonHeader(){
        return (
            <div className="lesson-header">
                <div className="lesson-bg" 
                    style={{
                        background: "url('" + DomainConfig.domain + "/src/assets/course-bg.png') center center/cover",
                        height: '33vw'
                }} >
                    <div style={{ backgroundColor: 'rgba(50, 0, 50, 0.75)', height: '100%' }}>
                    </div>
                </div>

                { this.lessonBanner() }
            </div>
        );
    }

    

    lessonBanner(){
        return <div className="lesson-banner">
            <div className="lesson-info">
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
                <Mark knowledge={this.lesson} style={{width: '40px'}} />
            </div>

        </div>;
    }

    CIInfo(){
        return <div className="ci-info">
            <div className="ci-avatar" style={{padding: '0 16px 0 0'}}>
                <img src={this.lesson.thumbnail} alt="lesson thumbnail" style={{borderRadius: '8px'}} />
            </div>
            <div className="ci-info-info">
                <p className="ci-title">{this.lesson.title}</p>
                <div className="ci-name" style={{justifyContent: 'flex-start', fontSize: '14px', marginBottom: '12px'}}>
                    <span style={{width: 'auto', marginRight: '4px'}}> Tác giả: </span>
                    <p 
                        style={{ width: 'auto', cursor: 'pointer', width: 'auto'}} 
                        onClick={this.clickAuthor}> 
                        {this.lesson.name} </p>
                </div>
                <p className="ci-description">{this.lesson.description}</p>
                <div className="ci-name" style={{justifyContent: 'flex-start', fontSize: '14px', marginTop: '12px'}}>
                    <span style={{width: 'auto', marginRight: '4px'}}> Score: </span>
                    <p 
                        style={{width: 'auto'}} > 
                        {this.lesson.score} </p>
                </div>
            </div>
        </div>;
    }


    CICost(){
        return <div className="ci-cost">
            <p> {"Thời gian: " + (this.lesson.learning_time ? (this.lesson.learning_time + " phút") : "Chưa có")} </p>
            {/* Nút chỉnh sửa bài học cho chủ bài học */}
            {/* <lessonRegisterButton updatelesson={this.context.getlesson} lesson = {this.lesson} style ={{margin: '12px'}} /> */}
    
        </div>
    }

}


export default LessonBanner;
