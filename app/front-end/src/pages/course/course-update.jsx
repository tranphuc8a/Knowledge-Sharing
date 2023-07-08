


import React from 'react';
import withRouter from '../../components/router/withRouter';
import Layout from '../../components/layout/layout';
import CourseContext from './course-context';
import Header from '../../components/layout/header/header';
import ImageInput from '../../components/inputfield/image-input';
import Separate from '../../components/separate/separate';
import TextInput from '../../components/inputfield/text-input';
import TextField from '../../components/inputfield/textfield';
import DropdownMenu from '../../components/inputfield/dropdown-menu';
import Button from '../../components/button/button';
import Toast from '../../utils/toast';
import PostAPI from '../../services/api/post-api';
import Session from '../../session/session';
import DomainConfig from '../../config/domain-config';
import GetAPI from '../../services/api/get-api';
import PatchAPI from '../../services/api/patch-api';
import Banner from '../../components/layout/banner/banner';
import Popup from '../../components/popup/popup';
import DeleteAPI from '../../services/api/delete-api';


class CourseUpdate extends React.Component{
    constructor(props){
        super(props);
        this.courseid = props.router.params.courseid;
        this.state = {
            course: {
                title: '',
                description: '',
                learning_time: '',
                stringCategories: '',
                fee: '',
                isfree: 1
            },
            isShowDeletePopup: false
        }
    }

    componentDidMount(){
        this.getCourse();
    }

    getCourse = async () => {
        try {
            let futureCourse = await GetAPI.getInstance()
                .setURL(DomainConfig.domainAPI + '/api/courses/detail/' + this.courseid)
                .setToken(Session.getInstance().token)
                .execute();
            if (futureCourse.code >= 300 || futureCourse.code < 200)
                throw Error(futureCourse.message);
            futureCourse = futureCourse.data;
            
            // check Course is of mainUser:
            let mainUser = Session.getInstance().mainUser;
            if (!(mainUser && mainUser.email == futureCourse.owner_email))
                throw new Error("Không phải khóa học của bạn");

            this.formatCourse(futureCourse);
            this.course = this.state.course = futureCourse;
            // this.state.navbarIndex = 0;
            this.setState(this.state);
        } catch (e){
            Toast.getInstance().error(e.message);
        }
    }

    render(){
        let { style } = this.props;
        if (this.state.course.knowledge_id == null) {
            return this.nullCourse();
        }
        let course = this.course;
        course.stringCategories = course.categories.join(', ');
        return <Layout header={<Header active={1}/>} >
            <Banner />
            <div style={{...style, width: '90%', margin: '72px 0px 72px 0px', flexDirection: 'column'}}>
                <div style={{justifyContent: 'space-between', fontSize: '24px', fontWeight: '500', margin: '0px 0px 12px 0px'}}>
                    {"Chỉnh sửa khóa học của bạn"}
                    <div style={{width: 'auto'}}>
                        <Button style={{width: 'auto'}} text="Quản lý khóa học" onclick={this.manageCourse} />
                        <Button style={{width: 'auto', backgroundColor: 'red', margin: '0 12px'}} text="Xóa khóa học" onclick={this.showDeleteCoursePopup} />
                    </div>
                </div>
                <Separate style={{margin: '0 0 72px 0'}} />
                { this.inputCourseTitle() }
                { this.inputCourseThumbnail() }
                { this.inputCourseDescription() }
                { this.inputCourseLearningTime() }
                { this.inputCourseCategories() }
                { this.inputCourseFee() }
                { this.submitButton() }
                { this.state.isShowDeletePopup ? this.deletePopup() : null }
            </div>
        </Layout>;
    }

    manageCourse = (event) => {
        this.props.router.navigate('/course-manage/' + this.state.course.knowledge_id);
    }

    showDeleteCoursePopup = () => {
        this.state.isShowDeletePopup = true;
        this.setState(this.state);
    }

    hideDeleteCoursePopup = () => {
        this.state.isShowDeletePopup = false;
        this.setState(this.state);
    }

    deleteCourse = async () => {
        this.hideDeleteCoursePopup();
        let course = this.state.course;

        try {
            let rs = await DeleteAPI.getInstance()
                .setToken(Session.getInstance().token)
                .setURL(DomainConfig.domainAPI + "/api/courses/" + course.knowledge_id)
                .execute();
            if (rs.code != 200) throw new Error(rs.message);
            // success navigate to profile
            Toast.getInstance().success("Đã xóa khóa học");
            let email = course.owner_email;
            this.props.router.navigate('/profile?email=' + email);
        } catch (e) {
            Toast.getInstance().error(e.message);
        }
    }

    deletePopup = () => {
        console.log("here");
        return <Popup>
            <div style={{width: '60%', height: 'auto', borderRadius: '6px', flexDirection:'column', padding: '48px 24px'}}>
                <div style={{flexDirection: 'column', margin: '32px 0px'}}>
                    <div style={{fontSize: '24px', fontWeight: '500'}}>
                        {"Bạn có chắc muốn xóa khóa học này không?"}
                    </div>
                </div>
                <div style={{width: '50%'}}>
                    <div>
                        <Button text="Chắc chắn" onclick={this.deleteCourse} style={{width: '150px', margin: '0px 6px'}}/>
                    </div>
                    <div>
                        <Button text="Hủy bỏ" onclick={this.hideDeleteCoursePopup} style={{width: '150px', margin: '0px 6px'}} />
                    </div>
                </div>
            </div>
        </Popup>
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

    inputCourseTitle = () => {
        let inputTitle = <TextInput 
                onchange={this.onChangeTitle} 
                value={this.state.course.title} 
                placeholder={"Tiêu đề cho khóa học"}
            />
        return <div>
            { this.leftTitle("Tiêu đề khóa học:") }
            { this.rightFrame(inputTitle) }
        </div>
    }

    onChangeTitle = (text) => {
        this.state.course.title = text;
        this.setState(this.state);
    }

    inputCourseThumbnail = () => {
        let element = <div style={{width: 'auto', flexDirection: 'column'}}>
            <div>
                <ImageInput 
                    src = {this.state.course.thumbnail}
                    style={{ width: '200px', height: '200px'}} 
                    onchange={this.onChangeThumbnail} 
                />
            </div> 
            <div style={{fontSize: '14px', fontWeight: 'bold'}}>
                {"Tải ảnh lên"}
            </div>
        </div>;
        return <div style={{margin: '18px 0px'}}>
            { this.leftTitle("Ảnh thumbnail:") }
            { this.rightFrame(element)}
        </div>
    }

    onChangeThumbnail = (image, src) => {
        this.state.course.image = image;
        // this.state.course.thumbnail = src;
    }

    inputCourseDescription = () => {
        let inputDescription = <TextField 
            style={{fontSize: '14px'}}
            onchange={this.onChangeDescription} value={this.state.course.description} 
            placeholder={"Nhập mô tả cho khóa học của bạn"}    
        />
        return <div>
            { this.leftTitle("Mô tả khóa học:") }
            { this.rightFrame(inputDescription) }
        </div>
    }

    onChangeDescription = (text) => {
        this.state.course.description = text;
        this.setState(this.state);
    }

    inputCourseLearningTime = () => {
        let inputTime = <TextInput 
            style={{width: '50%', fontSize: '16px'}}
            type="number"
            onchange={this.onChangeTime} 
            value={this.state.course.learning_time} 
            placeholder={"Đơn vị phút"}
        />
        return <div>
            { this.leftTitle("Thời gian học:") }
            { this.rightFrame(inputTime) }
        </div>
    }

    onChangeTime = (text) => {
        this.state.course.learning_time = text;
        this.setState(this.state);
    }

    inputCourseCategories = () => {
        let inputDescription = <TextField 
            style={{fontSize: '14px', minHeight: '50px'}}
            onchange={this.onChangeCategories} value={this.state.course.stringCategories} 
            placeholder={"Nhập danh sách các categories ngăn cách nhau bởi dấu phẩy\nVí dụ: Math, Physic"}    
        />
        return <div>
            { this.leftTitle("Categories") }
            { this.rightFrame(inputDescription) }
        </div>
    }

    onChangeCategories = (text) => {
        this.state.course.stringCategories = text;
        // this.setState(this.state);
    }

    formatCategories = (stringCategories) => {
        try {
            return stringCategories.split(' ')
                .filter(e => e.length > 0)
                .join(' ')
                .split(',')
                .map(e => e.trim().toLowerCase())
                .filter(e => e.length > 0);
        } catch (e) {
            throw e;
        }
    }

    inputCourseFee = () => {
        let inputMoney = <TextInput 
            style={{width: '50%', fontSize: '16px'}}
            type="number"
            onchange={this.onChangeFee} 
            value={this.state.course.fee} 
            placeholder={"Đơn vị VNĐ"}
        />
        return (this.state.course.isfree == 0) && (
            <div> 
                { this.leftTitle("Nhập số tiền") }
                { this.rightFrame(inputMoney) }
            </div>
        );
        
    }

    onChangeFee = (value) => {
        this.state.course.fee = value;
        this.setState(value);
    }

    submitButton = () => {
        return <Button text="Cập nhật khóa học" 
            style={{fontSize: '20px', margin: '36px'}}
            onclick={this.updateCourse}
             />;
    }

    updateCourse = async (event) => {
        try {
            let res = this.validateCourse();
            if (!res) throw new Error("Khóa học không hợp lệ");
            let course = this.state.course;
            try {
                // post image to get thumbnail url
                if (course.image) {
                    let postImage = await PostAPI.getInstance().postImage(course.image);
                    if (postImage.code == 200) course.thumbnail = postImage.data.url;
                }
            } catch (e) {
                Toast.getInstance().error(e);
            } finally {
                let data = {
                    title: course.title,
                    learning_time: course.learning_time,
                    description: course.description,
                    isfree: course.isfree,
                    fee: course.fee,
                    categories: course.categories,
                    thumbnail: course.thumbnail
                }
                if (data.isfree == 1) delete data.fee; 
                // post create data
                let rs = await PatchAPI.getInstance()
                    .setToken(Session.getInstance().token)
                    .setURL(DomainConfig.domainAPI + "/api/courses/" + course.knowledge_id)
                    .setBody(data).execute();
                if (rs.code != 200) throw new Error(rs.message);
                // success navigate to course details
                Toast.getInstance().success("Cập nhật khóa học thành công");
                let course_id = rs.data.knowledge_id;
                this.props.router.navigate('/course-detail/' + course_id);
            }
        } catch (e) {
            Toast.getInstance().error(e.message);
        }
    }

    validateCourse = () => {
        try {
            let course = this.state.course;
            // check Title

            if (!(course.title && course.title.trim().length > 0))
                throw new Error("Tiêu đề không được rỗng");
            course.title = course.title.trim();

            // check description
            if (!(course.description && course.description.trim().length > 0))
                throw new Error("Mô tả không được rỗng");
            course.description = course.description.trim();
                
            // check learning_time
            if (!(course.learning_time && course.learning_time >= 0))
                throw new Error("Thời gian học không hợp lệ");
                
            // check categories
            course.categories = this.formatCategories(course.stringCategories);
            if (!(course.categories && course.categories.length > 0))
                throw new Error("Categories không hợp lệ");
            
            // check fee:
            if (!course.isfree) {
                if (!(course.fee && course.fee >= 0))
                    throw new Error("Thời gian học không hợp lệ");
            }
            return true;
        } catch (e) {
            Toast.getInstance().error(e.message)
            return false;
        }
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
}


export default withRouter(CourseUpdate);
