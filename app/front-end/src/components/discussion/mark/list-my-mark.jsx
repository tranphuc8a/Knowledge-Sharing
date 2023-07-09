
import React from "react";
import DropdownMenu from "../../inputfield/dropdown-menu";
import CourseCard from "../../course/course-card/course-card";
import GetAPI from "../../../services/api/get-api";
import DomainConfig from "../../../config/domain-config";
import Session from "../../../session/session";
import Toast from "../../../utils/toast";
import Separate from "../../separate/separate";
import LessonCard from "../../lesson/lesson-card";


class ListMyMark extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            listMark: [],
            listCourseMark: [],
            listLessonMark: [],
            type: "course"
        }
        this.menuOption = [
            {
                title: 'Khóa học',
                value: "course"
            }, {
                title: "Bài học",
                value: "lesson"
            }
        ];
    }

    componentDidMount(){
        this.updateListMark();
    }

    // template method
    render(){
        let { style } = this.props;

        return (
            <div>
                <div style={{...style, width: '90%', margin: '36px 0px 12px 0px', flexDirection: 'column'}}>
                    <div style={{justifyContent: 'space-between', fontSize: '24px', fontWeight: '500', margin: '0px 0px 12px 0px'}}>
                        <div style={{justifyContent: 'flex-start'}}>
                            {
                                this.state.type == "course" ? 
                                    "Danh sách khóa học đã đánh dấu" : 
                                    "Danh sách bài học đã đánh dấu"
                            }
                        </div>
                        <DropdownMenu
                            style={{ width: 'auto', fontSize: 'smaller' }}
                            listOptions={this.menuOption}
                            value={this.state.type}
                            onchange={this.onChangeType}
                        />
                    </div>
                    <Separate />
                    { this.state.type == "course" ? this.getListCourse() : this.getListLesson() }
                </div>
            </div>
        );
    }

    onChangeType = (value) => {
        this.state.type = value;
        this.setState(this.state);
    }

    getListCourse = () => {
        let listCourse = this.state.listCourseMark;
        let numCourse = listCourse ? listCourse.length : 0;
        
        return numCourse <= 0 ? (
                "Không tìm thấy khóa học"
            ) : (
                <div style={{ flexDirection: 'column'}} >
                    {listCourse.map((course, index) => {
                        return <CourseCard style={{margin: '12px 0px'}} course={course} key={index}/>
                    })}
                </div>
            )
    }

    getListLesson = () => {
        let listLesson = this.state.listLessonMark;
        let numLesson = listLesson ? listLesson.length : 0;
        
        return numLesson <= 0 ? (
                "Không tìm thấy khóa học"
            ) : (
                <div style={{ flexDirection: 'column'}} >
                    {listLesson.map((lesson, index) => {
                        return <LessonCard style={{margin: '12px 0px'}} lesson={lesson} key={index}/>
                    })}
                </div>
            )
    }

    updateListMark = async () => {

        try {
            let res = await GetAPI.getInstance()
                .setURL(DomainConfig.domainAPI + "/api/knowledge/mark")
                .setToken(Session.getInstance().token)
                .execute();
            if (res.code != 200) throw new Error(res.message);
            this.state.listMark = res.data.data;
            this.state.listMark.forEach(mark => {
                mark.isMark = 1,
                mark.knowledge_id = mark.knid
            });
            this.state.listCourseMark = this.state.listMark.filter(mark => {
                return mark.is_course == 1;
            });
            this.state.listLessonMark = this.state.listMark.filter(mark => {
                return mark.is_course != 1;
            });
            this.setState(this.state);
        } catch (e) {
            Toast.getInstance().error(e.message);
        }
    }
}

export default ListMyMark;

