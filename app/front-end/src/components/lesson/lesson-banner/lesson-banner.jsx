

import React from "react";
import './lesson-banner.css';
import LessonContext from "../../../pages/lesson/lesson-context";
import DomainConfig from "../../../config/domain-config";
import NavBar from "../../navbar/navbar";
import Mark from "../../discussion/mark/mark";
import Session from "../../../session/session";
import Button from "../../button/button";
import withRouter from "../../router/withRouter";
import Banner from "../../layout/banner/banner";



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
                <Banner />

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
                        style={{ width: 'auto', cursor: 'pointer'}} 
                        onClick={this.clickAuthor}> 
                        {this.lesson.name} </p>
                </div>
                <p className="ci-description">{this.lesson.description}</p>
                {/* <div className="ci-name" style={{justifyContent: 'flex-start', fontSize: '14px', marginTop: '12px'}}>
                    <span style={{width: 'auto', marginRight: '4px'}}> Score: </span>
                    <p 
                        style={{width: 'auto'}} > 
                        {this.lesson.score} </p>
                </div> */}
            </div>
        </div>;
    }


    CICost(){
        return <div className="ci-cost" style={{paddingRight: '24px'}}>
            <div style={{justifyContent: 'space-between'}}>
                <p style={{width: 'auto'}}> Thời gian học: </p>
                <p style={{width: 'auto'}}> {this.lesson.learning_time ? (this.lesson.learning_time + " phút") : "Chưa có"}</p>
            </div>
            <div style={{justifyContent: 'space-between'}}>
                <p style={{width: 'auto'}}> Thảo luận: </p>
                <p style={{width: 'auto'}}> {this.lesson.numcmt ? this.lesson.numcmt : "0"}</p>
            </div>
            <div style={{justifyContent: 'space-between'}}>
                <p style={{width: 'auto'}}> Đánh giá: </p>
                <p style={{width: 'auto'}}> {this.lesson.score}</p>
            </div>
            {/* Nút chỉnh sửa bài học cho chủ bài học */}
            { this.getUpdateButton() }
        </div>
    }

    getUpdateButton = () => {
        let lesson = this.lesson;
        let mainUser = Session.getInstance().mainUser;
        if (mainUser.email == lesson.owner_email){
            return <Button text="Chỉnh sửa bài học" onclick={this.clickUpdateButton} style={{width: 'auto', margin: '12px 0px'}} />
        } 
        return null;
    }

    clickUpdateButton = (event) => {
        this.props.router.navigate('/lesson-update/' + this.context.state.lesson.knowledge_id);
    }
}


export default withRouter(LessonBanner);
