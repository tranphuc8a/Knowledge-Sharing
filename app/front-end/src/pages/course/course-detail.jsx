
import React from 'react';

import Layout from '../../components/layout/layout';
import CourseBanner from '../../components/course/course-banner/course-banner';
import withRouter from '../../components/router/withRouter';
import GetAPI from '../../services/api/get-api';
import MyRoute from '../../components/router/route';
import Header from '../../components/layout/header/header';
import ListLesson from '../../components/lesson/list-lesson';
import DomainConfig from '../../config/domain-config';
import Session from '../../session/session';
import CourseContext from './course-context';
import Discussion from '../../components/discussion/discussion';
import { Toast } from 'bootstrap';
import ListMember from '../../components/course/list-member/list-member';
import ListRequestCourse from '../../components/request/list-request-course';
import ListRequestCourseConcrete from '../../components/request/list-request-course-concrete';
import ListInviteCourseConcrete from '../../components/request/list-invite-course-concrete';

class CourseDetail extends React.Component{
    constructor(props){
        super(props);
        this.courseid = props.router.params.courseid;
        let navIndex = props.router.searchParams.get("index");
        if (navIndex == null) navIndex = 0;
        this.course = null;
        this.state = {
            course: null,
            navbarIndex: navIndex
        }
        this.count = 0;
    }

    getCourse = async () => {
        try {
            let futureCourse = await new GetAPI()
                .setURL(DomainConfig.domainAPI + '/api/courses/detail/' + this.courseid)
                .setToken(Session.getInstance().token)
                .execute();
            if (futureCourse.code >= 300 || futureCourse.code < 200)
                throw Error(futureCourse.message);
            futureCourse = futureCourse.data;
            this.formatCourse(futureCourse);
            this.state.course = futureCourse;
            // this.state.navbarIndex = 0;
            this.setState(this.state);
        } catch (e){
            Toast.getInstance().error(e.message);
        }
    }

    shouldComponentUpdate(){
        return true;
    }

    componentDidMount(){
        this.getCourse();
    }

    render(){
        if (this.state.course == null){
            return this.nullCourse();
        }
        return <Layout header={<Header active={1}/>} >
            <CourseContext.Provider value={this} >
                <div style={{width: '100%', flexDirection: 'column'}}>
                    <CourseBanner navbarIndex={this.state.navbarIndex} />
                    <div className='content'>
                        {
                            this.getContent(this.state.navbarIndex)
                        }
                    </div>
                </div>
            </CourseContext.Provider>
        </Layout>;
    }

    nullCourse(){
        return <Layout  header={<Header active={1}/>}>
            <div 
                style={{
                    justifyContent:'center',
                    alignItems: 'center',
                    height: '75vh',
                    fontSize: '26px',
                    fontWeight: '500',
                    color: 'violet',
                    fontFamily: 'revert-layer',
                    backgroundColor: 'rgba(0, 0, 0, 0.1)'
                }}
            > Không tìm thấy khóa học rùi!!! </div>
        </Layout>
    }

    formatCourse = (course) => {
        try {
            if (course == null) return;
            course.thumbnail = course.thumbnail || DomainConfig.domain + "/src/assets/knowledge-icon.jpg";
            // course.thumbnail = decodeURI(course.thumbnail);
            course.score = course.score ? Number(course.score).toFixed(1) : "Chưa có đánh giá";
            course.relevant = course.relevant || 0;
            course.isMark = course.isMark || 0;
        } catch(e){
            throw e;
        }
    }

    getContent(navbarIndex){
        let course = this.state.course;
        switch (Number(navbarIndex)){
            case 0: // list lesson
                return <ListLesson 
                    updateListLesson={(listLesson)=>{course.listLesson = listLesson}} 
                    listLesson={this.state.course.listLesson}
                />;
            case 1: // list discussion
                this.state.course.id = this.state.course.knowledge_id;
                return <Discussion knowledge = {this.state.course } updateKnowledge={this.getCourse}/>;
            case 2: // list member
                return <ListMember course={course} />;
            case 3: // list request
                return <ListRequestCourseConcrete course={course} />
            case 4: // list invite
                return <ListInviteCourseConcrete course={course} />
        }
        return <div></div>
    }

    updateNavbarIndex(index){
        // this.state.navbarIndex = 0;
        // this.setState(this.state);
        this.props.router.setSearchParams({index: index});
        this.state.navbarIndex = index;
        this.setState(this.state);
    }

}


export default withRouter(CourseDetail);
