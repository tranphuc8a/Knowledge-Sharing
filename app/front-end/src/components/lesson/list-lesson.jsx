


import React from "react";
import LessonCard from "./lesson-card";

class ListLesson extends React.Component{
    constructor(props){
        super(props);
        this.state = {

        }
    }

    render(){
        let { listLesson, style } = this.props;
        if (listLesson == null) return this.nullListLesson();
        let numLessons = listLesson.length;
        listLesson.sort((lesa, lesb) => lesa.offset - lesb.offset);
        return (
            <div style={{...style, width: '90%', margin: '0px 0px 72px 0px', flexDirection: 'column'}}>
                <div style={{justifyContent: 'flex-start', fontSize: '24px', fontWeight: '500', margin: '0px 0px 36px 0px'}}>
                    {numLessons > 0 ? "Danh sách bài học" : "Không có bài học nào"}
                </div>
                <div >
                    {listLesson.map((lesson, index) => {
                        return <LessonCard lesson={lesson} key={index}/>
                    })}
                </div>
            </div>
        );
    }

    nullListLesson(){

    }
    
}


export default ListLesson;

