
import React from 'react';

import Layout from '../../components/layout/layout';
import Banner from '../../components/layout/banner/banner';
import withRouter from '../../components/router/withRouter';
import Header from '../../components/layout/header/header';
import Separate from '../../components/separate/separate';
import TextInput from '../../components/inputfield/text-input';
import Button from '../../components/button/button';
import DropdownMenu from '../../components/inputfield/dropdown-menu';
import Toast from '../../utils/toast';
import GetAPI from '../../services/api/get-api';
import DomainConfig from '../../config/domain-config';
import Session from '../../session/session';
import UserCard from '../../components/user/user-card';
import CourseCard from '../../components/course/course-card/course-card';
import LessonCard from '../../components/lesson/lesson-card';

class SearchPage extends React.Component{
    constructor(props){
        super(props);

        this.key = props.router.searchParams.get("key");
        this.categories = props.router.searchParams.get("categories");
        this.type = props.router.searchParams.get("type");
        if (! (["user", "course", "lesson"].includes(this.type))) {
            this.type = "user";
            this.props.router.setSearchParams({type: this.type});
        }
        if (this.key == null) this.key = "";
        if (this.categories == null) this.categories = "";

        this.state = {
            key: this.key,
            type: this.type || "user",
            categories: this.categories,
            listUser: [],
            listCourse: [],
            listLesson: []
        };
    }


    componentDidMount(){
        this.callSearch();
    }

    callSearch = async () => {
        if (this.type == "user")
            await this.getListUser();
        if (this.type == "course")
            await this.getListCourse();
        if (this.type == "lesson")
            await this.getListLesson();
    }

    getListUser = async () => {
        if (this.key == null || this.key == "")
            return;
        let key = this.key;
        try {
            let res = await GetAPI.getInstance()
                .setURL(DomainConfig.domainAPI + "/api/search/account/" + key)
                .setToken(Session.getInstance().token)
                .execute();
            if (res.code != 200) throw new Error(res.message);
            Toast.getInstance().success("Tìm kiếm thành công");
            this.state.listUser = res.data;
            this.setState(this.state);
        } catch (e) {
            Toast.getInstance().error(e.message)
        }
    }

    getListCourse = async () => {
        let key = this.key;
        let categories = this.categories;
        if (this.key == "" && this.categories == "")
            return;
        let keyQuery = (this.key == "") ? "" : ("key=" + this.key);
        let catQuery = (this.categories == "") ? "" : ("categories=" + this.categories);
        let query = (keyQuery == "" || catQuery == "") ?
                    (keyQuery + catQuery) : (keyQuery + "&" + catQuery);
        try {
            let res = await GetAPI.getInstance()
                .setURL(DomainConfig.domainAPI + "/api/search/courses?" + query)
                .setToken(Session.getInstance().token)
                .execute();
            if (res.code != 200) throw new Error(res.message);
            Toast.getInstance().success("Tìm kiếm thành công");
            this.state.listCourse = res.data;
            this.setState(this.state);
        } catch (e) {
            Toast.getInstance().error(e.message)
        }
    }

    getListLesson = async () => {
        let key = this.key;
        let categories = this.categories;
        if (this.key == "" && this.categories == "")
            return;
        let keyQuery = (this.key == "") ? "" : ("key=" + this.key);
        let catQuery = (this.categories == "") ? "" : ("categories=" + this.categories);
        let query = (keyQuery == "" || catQuery == "") ?
                    (keyQuery + catQuery) : (keyQuery + "&" + catQuery);
        try {
            let res = await GetAPI.getInstance()
                .setURL(DomainConfig.domainAPI + "/api/search/lesson?" + query)
                .setToken(Session.getInstance().token)
                .execute();
            if (res.code != 200) throw new Error(res.message);
            Toast.getInstance().success("Tìm kiếm thành công");
            this.state.listLesson = res.data;
            this.setState(this.state);
        } catch (e) {
            Toast.getInstance().error(e.message)
        }
    }

    render(){
        this.state.key = this.key;
        return <Layout header={<Header active={0}/>} >
            <Banner />
            <div style={{ width: '90%', margin: '72px 0px 72px 0px', flexDirection: 'column'}}>
                <div style={{justifyContent: 'space-between', fontSize: '24px', fontWeight: '500', margin: '0px 0px 12px 0px'}}>
                    {"Tìm kiếm " + (this.type == "user" ? "người dùng" : (this.type == "course" ? "khóa học" : "bài học"))}
                </div>
                <Separate style={{margin: '24px 0'}} />
                {this.searchBar()}
                <Separate style={{margin: '24px 0'}} />
                {this.contentView()}
            </div>
        </Layout>;
    }

    leftTitle = (title) => {
        return <div style={{ margin: '0px 12px', width: '25%', justifyContent: 'flex-end', textAlign: 'end', fontSize: '18px', fontWeight: '600'}}>
            {title}
        </div>
    }

    rightFrame = (elemenet) => {
        return <div style={{ margin: '0px 12px', width: '75%', justifyContent: 'flex-start'}}>
            { elemenet }
        </div>
    }


    searchBar = () => {
        return <div style={{flexDirection: 'column'}}>
            {this.getInputKeyFrame()}
            {this.getChooseSearchType()}
            {this.type == "user" ? null : this.getCategoriesFrame()}
            <Button text="Tìm kiếm" style={{}} onclick={this.clickSearchButton} />
        </div>
    }

    clickSearchButton = (event) => {
        this.type = this.state.type;
        this.key = this.state.key;
        this.categories = this.state.categories;
        let query = {type: this.type}
        if (this.key) query.key = this.key;
        if (this.type != "user"){
            if (this.categories) query.categories = this.categories;
        }
        this.props.router.setSearchParams(query);
        this.callSearch();
    }

    getInputKeyFrame = () => {
        let inputKey = <TextInput 
            type="text"
            onchange={this.onChangeKey} 
            value={this.state.key} 
            placeholder={"Nhập từ khóa tìm kiếm"}
        />
        return <div>
            { this.leftTitle("Từ khóa tìm kiếm") }
            { this.rightFrame(inputKey) }
        </div>
    }

    onChangeKey = (text) => {
        this.state.key = text;
        this.key = text;
        this.setState(this.state);
    }

    getChooseSearchType = () => {
        let listOptions = [
            {
                title: 'Người dùng',
                value: "user"
            }, {
                title: "Khóa học",
                value: "course"
            }, {
                title: "Bài học",
                value: "lesson"
            }
        ];
        let menuOption = <DropdownMenu
            style={{ width: '50%' }}
            listOptions={listOptions}
            value={this.state.type}
            onchange={this.onChangeType}
        />
        return <div style={{ flexDirection: 'column' }}>
            <div>
                {this.leftTitle("Mục tìm kiếm")}
                {this.rightFrame(menuOption)}
            </div>
        </div>
    }

    onChangeType = (value) => {
        if (!(["user", "course", "lesson"].includes(value))) return;
        this.state.type = value;
        this.type = value;
        this.props.router.setSearchParams({type: this.type});
        this.setState(this.state);
    }

    contentView = () => {
        if (this.type == "user")
            return this.listUserView();
        if (this.type == "course")
            return this.listCourseView();
        return this.listLessonView();
    }

    getCategoriesFrame = () => {
        let inputKey = <TextInput 
            type="text"
            onchange={this.onChangeCategories} 
            value={this.state.categories} 
            placeholder={"Nhập categories"}
        />
        return <div>
            { this.leftTitle("Categories") }
            { this.rightFrame(inputKey) }
        </div>
    }

    onChangeCategories = (text) => {
        this.state.categories = text;
        this.categories = text;
        this.setState(this.state);
    }


    listUserView = () => {
        let listUser = this.state.listUser;
        let numUser = listUser ? listUser.length : 0;
        return <div style={{ margin: '0px 0px 0px 0px', flexDirection: 'column'}}>
            <div style={{justifyContent: 'space-between', fontSize: '24px', fontWeight: '500', margin: '0px 0px 12px 0px'}}>
                {"Danh sách người dùng"}
            </div>
            <Separate />
            {
                numUser <= 0 ? (
                    "Không tìm thấy người dùng"
                ) : (
                    <div style={{flexWrap: 'wrap', justifyContent: 'flex-start'}}>
                        {
                            listUser.map((user, index) => {
                                return <div style={{margin: '16px', width: 'auto'}} key={index}> 
                                    <UserCard width={150} user={user} />
                                </div>
                            })
                        }
                    </div>
                )
            }
        </div>
    }

    listCourseView = () => {
        let listCourse = this.state.listCourse;
        let numCourse = listCourse ? listCourse.length : 0;
        return <div style={{ margin: '0px 0px 0px 0px', flexDirection: 'column'}}>
            <div style={{justifyContent: 'space-between', fontSize: '24px', fontWeight: '500', margin: '0px 0px 12px 0px'}}>
                {"Danh sách khóa học"}
            </div>
            <Separate />
            {
                numCourse <= 0 ? (
                    "Không tìm thấy khóa học"
                ) : (
                    <div style={{ flexDirection: 'column'}} >
                        {listCourse.map((course, index) => {
                            return <CourseCard style={{margin: '12px 0px'}} course={course} key={index}/>
                        })}
                    </div>
                )
            }
        </div>
    }

    listLessonView = () => {
        let listLesson = this.state.listLesson;
        let numLesson = listLesson ? listLesson.length : 0;
        return <div style={{ margin: '0px 0px 0px 0px', flexDirection: 'column'}}>
            <div style={{justifyContent: 'space-between', fontSize: '24px', fontWeight: '500', margin: '0px 0px 12px 0px'}}>
                {"Danh sách bài học"}
            </div>
            <Separate />
            {
                numLesson <= 0 ? (
                    "Không tìm thấy bài học"
                ) : (
                    <div style={{ flexDirection: 'column'}} >
                        {listLesson.map((lesson, index) => {
                            return <LessonCard style={{margin: '12px 0px'}} lesson={lesson} key={index}/>
                        })}
                    </div>
                )
            }
        </div>
    }

}


export default withRouter(SearchPage);
