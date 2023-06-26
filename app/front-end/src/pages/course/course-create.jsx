


import React from 'react';
import withRouter from '../../components/router/withRouter';
import Layout from '../../components/layout/layout';
import CourseContext from './course-context';
import Header from '../../components/layout/header/header';


class CourseCreate extends React.Component{
    constructor(props){
        super(props);
        // this.courseid = props.router.params.courseid;
        // let navIndex = props.router.searchParams.get("index");
        // if (navIndex == null) navIndex = 0;
        // this.course = null;
        this.state = {
            course: {},
            // navbarIndex: navIndex
        }
    }

    // getCourse = async () => {
    //     try {
    //         let futureCourse = await new GetAPI()
    //             .setURL(DomainConfig.domainAPI + '/api/courses/detail/' + this.courseid)
    //             .setToken(Session.getInstance().token)
    //             .execute();
    //         // console.log(futureCourse);
    //         if (futureCourse.code >= 300 || futureCourse.code < 200)
    //             throw Error(futureCourse.message);
    //         futureCourse = futureCourse.data;
    //         this.formatCourse(futureCourse);
    //         this.state.course = futureCourse;
    //         // this.state.navbarIndex = 0;
    //         this.setState(this.state);
    //     } catch (e){
    //         Toast.getInstance().error(e.message);
    //     }
    // }

    componentDidMount(){
        // this.getCourse();
    }

    render(){
        return <Layout header={<Header active={1}/>} >
            {/* <CourseContext.Provider value={this} >
                <div style={{width: '100%', flexDirection: 'column'}}>
                    <CourseBanner navbarIndex={this.state.navbarIndex} />
                    <div className='content'>
                        {
                            this.getContent(this.state.navbarIndex)
                        }
                    </div>
                </div>
            </CourseContext.Provider> */}
        </Layout>;
    }


    formatCourse = (course) => {
        try {
            if (course == null) return;
            course.thumbnail = course.thumbnail || DomainConfig.domain + "/src/assets/knowledge-icon.jpg";
            course.score = course.score ? Number(course.score).toFixed(1) : "Chưa có đánh giá";
            course.relevant = course.relevant || 0;
            course.isMark = course.isMark || 0;
        } catch(e){
            throw e;
        }
    }

    getContent(navbarIndex){
        // let course = this.state.course;
        // switch (Number(navbarIndex)){
        //     case 0: // list lesson
        //         return <ListLesson 
        //             updateListLesson={(listLesson)=>{course.listLesson = listLesson}} 
        //             listLesson={this.state.course.listLesson}
        //         />;
        //     case 1: // list discussion
        //         this.state.course.id = this.state.course.knowledge_id;
        //         return <Discussion knowledge = {this.state.course } updateKnowledge={this.getCourse}/>;
        //     case 2: // list member
        //         return <ListMember course={course} />;
        //     case 3: // list request
        //         return <ListRequestCourseConcrete course={course} />
        //     case 4: // list invite
        //         return <ListInviteCourseConcrete course={course} />
        // }
        // return <div></div>
    }

    updateNavbarIndex(index){
        // this.state.navbarIndex = 0;
        // this.setState(this.state);
        this.props.router.setSearchParams({index: index});
        this.state.navbarIndex = index;
        this.setState(this.state);
    }

}


export default withRouter(CourseCreate);
