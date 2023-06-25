
import React from "react";
import './lesson-content.css';
import Separate from "../../separate/separate";
import IframeResizer from "iframe-resizer-react";
import FullheightIframe from "../../iframe/full-height-iframe";

class LessonContent extends React.Component{
    constructor(props){
        super(props);
        this.state = {

        }
    }

    render(){
        let {style, lesson} = this.props;
        this.lesson = lesson;

        let html = `<h1 style="background-color: pink; height: 300px; width: 500px"> Hello </h1>`;
        return (
            <div style={{...style, width: '90%', margin: '0px 0px 72px 0px', flexDirection: 'column'}}> 
                { this.lessonHeader() }
                <Separate />
                <FullheightIframe srcDoc={html} style={{width: '100%'}} />
            </div>
        );
    }

    resizeFrame = (obj) => {
        obj.style.height = obj.contentWindow.document.documentElement.scrollHeight + 'px';
    }

    lessonHeader = () => {
        let lesson = this.lesson;
        return <div style={{flexDirection: 'column'}}>
            <div style={{ justifyContent: 'flex-start', fontSize: '32px', fontWeight: '1000', fontFamily: 'Arial, Helvetica, sans-serif'}}>
                {lesson.title}
            </div>
            <div>

            </div>
            <div>

            </div>
        </div>
    }
}

export default LessonContent;

