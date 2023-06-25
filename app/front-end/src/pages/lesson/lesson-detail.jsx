
import React from 'react';
import DomainConfig from '../../config/domain-config';
import Session from '../../session/session';
import Toast from '../../utils/toast';
import LessonContext from './lesson-context';
import Discussion from '../../components/discussion/discussion';
import withRouter from '../../components/router/withRouter';
import Layout from '../../components/layout/layout';
import Header from '../../components/layout/header/header';
import GetAPI from '../../services/api/get-api';
import LessonBanner from '../../components/lesson/lesson-banner/lesson-banner';
import LessonContent from '../../components/lesson/lesson-content/lesson-content';


class LessonDetail extends React.Component{
    constructor(props){
        super(props);
        this.lessonid = props.router.params.lessonid;
        let navIndex = props.router.searchParams.get("index");
        if (navIndex == null) navIndex = 0;
        this.lesson = null;
        this.state = {
            lesson: null,
            navbarIndex: navIndex
        }
    }

    getLesson = async () => {
        try {
            let futureLesson = await GetAPI.getInstance()
                .setURL(DomainConfig.domainAPI + '/api/lesson/detail/' + this.lessonid)
                .setToken(Session.getInstance().token)
                .execute();
            // console.log(futureLesson);
            if (futureLesson.code >= 300 || futureLesson.code < 200)
                throw Error(futureLesson.message);
            futureLesson = futureLesson.data;
            this.formatLesson(futureLesson);
            this.state.lesson = futureLesson;
            // this.state.navbarIndex = 0;
            this.setState(this.state);
        } catch (e){
            Toast.getInstance().error(e.message);
        }
    }

    componentDidMount(){
        this.getLesson();
    }

    render(){
        if (this.state.lesson == null){
            return this.nullLesson();
        }
        return <Layout header={<Header active={1}/>} >
            <LessonContext.Provider value={this} >
                <div style={{width: '100%', flexDirection: 'column'}}>
                    <LessonBanner navbarIndex={this.state.navbarIndex} />
                    <div className='content'>
                        {
                            this.getContent(this.state.navbarIndex)
                        }
                    </div>
                </div>
            </LessonContext.Provider>
        </Layout>;
    }

    nullLesson(){
        return <Layout header={<Header active={1}/>}>
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
            > Không tìm thấy bài học này rùi bạn ơi!!! </div>
        </Layout>
    }

    formatLesson = (lesson) => {
        try {
            if (lesson == null) return;
            lesson.thumbnail = lesson.thumbnail || DomainConfig.domain + "/src/assets/knowledge-icon.jpg";
            lesson.score = lesson.score ? Number(lesson.score).toFixed(1) : "Chưa có đánh giá";
            lesson.isMark = lesson.isMark || 0;
        } catch(e){
            throw e;
        }
    }

    getContent(navbarIndex){
        let lesson = this.state.lesson;
        switch (Number(navbarIndex)){
            case 0: // lesson detail
                return <LessonContent lesson={lesson} />
            case 1: // list discussion
                this.state.lesson.id = this.state.lesson.knowledge_id;
                return <Discussion knowledge = {this.state.lesson } updateKnowledge={this.getLesson}/>;
        }
        return null
    }

    updateNavbarIndex(index){
        // this.state.navbarIndex = 0;
        // this.setState(this.state);
        console.log("index");
        this.props.router.setSearchParams({index: index});
        this.state.navbarIndex = index;
        this.setState(this.state);
    }

}


export default withRouter(LessonDetail);
