
import React from "react";
import './lesson-content.css';
import Separate from "../../separate/separate";
import IframeResizer from "iframe-resizer-react";
import FullheightIframe from "../../iframe/full-height-iframe";
import CategoriesCard from "../categories/categories-card";

class LessonContent extends React.Component{
    constructor(props){
        super(props);
        this.state = {

        }
    }

    render(){
        let {style, lesson} = this.props;
        this.lesson = lesson;

        // let html = `<h1 style="background-color: pink; height: 300px; width: 100vw"> Hello </h1>`;
        return (
            <div className="lesson-content" style={{...style, width: '90%', margin: '0px 0px 72px 0px', flexDirection: 'column'}}> 
                { this.lessonHeader() }
                <Separate />
                <FullheightIframe srcDoc={lesson.content} style={{width: '100%'}} />
            </div>
        );
    }

    resizeFrame = (obj) => {
        obj.style.height = obj.contentWindow.document.documentElement.scrollHeight + 'px';
    }

    lessonHeader = () => {
        let lesson = this.lesson;
        return <div className="lesson-header" style={{flexDirection: 'column', height: 'auto', margin: '0px 0px 36px 0px'}}>
            <div style={{ justifyContent: 'flex-start', fontSize: '48px', fontWeight: '600'}}>
                {lesson.title}
            </div>
            <div style={{justifyContent: 'space-between'}}>
                <div className="lesson-author" style={{ width: 'auto', justifyContent: 'flex-start', fontSize: '18px', fontWeight: '500',cursor: 'pointer' }}
                    onClick={this.clickAuthor}
                >
                    {lesson.name}
                </div>
                <div style={{width: 'auto', fontSize: '12px', fontStyle: 'italic', color: 'rgba(0, 0, 0, 0.5)'}}>
                    {lesson.update_at || lesson.create_at}
                </div>
            </div>
            <div style={{justifyContent: 'flex-end'}}>
                <div style={{width: '50%', justifyContent: 'flex-end', flexWrap: 'wrap'}}>
                    {
                        lesson.categories.map((category, index) => {
                            return <CategoriesCard key={index} category={category} />
                        })
                    }
                </div>
            </div>
            
        </div>
    }

    clickAuthor = (event) => {

    }
}

export default LessonContent;

