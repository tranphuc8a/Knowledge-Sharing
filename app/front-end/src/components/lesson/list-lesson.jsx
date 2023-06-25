


import React from "react";
import LessonCard from "./lesson-card";
import Separate from "../separate/separate";

class ListLesson extends React.Component{
    constructor(props){
        super(props);
        this.state = {

        }
    }

    render(){
        let { listLesson, style } = this.props;
        this.listLesson = listLesson;
        let numLessons = listLesson ? listLesson.length : 0;
        listLesson.sort((lesa, lesb) => lesa.offset - lesb.offset);
        return (
            <div style={{...style, width: '90%', margin: '0px 0px 72px 0px', flexDirection: 'column'}}>
                <Separate />
                <div style={{justifyContent: 'flex-start', fontSize: '24px', fontWeight: '500', margin: '0px 0px 36px 0px'}}>
                    {numLessons > 0 ? "Danh sách bài học" : "Không có bài học nào"}
                </div>
                <div >
                    {listLesson.map((lesson, index) => {
                        return <LessonCard updateLesson={() => { this.updateLesson(lesson, index)}} lesson={lesson} key={index}/>
                    })}
                </div>
            </div>
        );
    }

    updateLesson = (lesson, index) => {
        this.listLesson[index] = lesson;
        let updateListLesson = this.props.updateListLesson;
        if (updateListLesson) updateListLesson(this.listLesson);
    }
    
}


export default ListLesson;

