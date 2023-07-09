


import React from 'react';
import withRouter from '../../components/router/withRouter';
import Layout from '../../components/layout/layout';
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
import './lesson-create.css';
import AutoHeightIframe from '../../components/iframe/auto-height-iframe';
import FullheightIframe from '../../components/iframe/full-height-iframe';
import PatchAPI from '../../services/api/patch-api';
import GetAPI from '../../services/api/get-api';
import Banner from '../../components/layout/banner/banner';
import DeleteAPI from '../../services/api/delete-api';
import Popup from '../../components/popup/popup';


class LessonUpdate extends React.Component{
    constructor(props){
        super(props);
        this.lessonid = props.router.params.lessonid;
        this.lesson = null;
        this.state = {
            lesson: null,
            isShowDeletePopup: false
        }
    }

    componentDidMount(){
        this.getLesson();
    }

    getLesson = async () => {
        try {
            let futureLesson = await GetAPI.getInstance()
                .setURL(DomainConfig.domainAPI + '/api/lesson/detail/' + this.lessonid)
                .setToken(Session.getInstance().token)
                .execute();
            if (futureLesson.code >= 300 || futureLesson.code < 200)
                throw Error(futureLesson.message);
            futureLesson = futureLesson.data;
            this.formatLesson(futureLesson);
            
            // check owner of lesson:
            let mainUser = Session.getInstance().mainUser;
            if (mainUser == null || mainUser.email != futureLesson.owner_email)
                throw new Error("Bạn không phải chủ của bài học này");

            this.state.lesson = futureLesson;
            // this.state.navbarIndex = 0;
            this.setState(this.state);
        } catch (e){
            Toast.getInstance().error(e.message);
        }
    }

    render(){
        let { style } = this.props;
        let lesson = this.state.lesson;
        if (lesson == null ||  lesson.knowledge_id == null)
            return this.nullLesson();
        lesson.stringCategories ??= lesson.categories.join(', ');
        
        return <Layout header={<Header active={1}/>} >
            <Banner />
            <div style={{...style, width: '90%', margin: '72px 0px 72px 0px', flexDirection: 'column'}}>
                <div style={{justifyContent: 'space-between', fontSize: '24px', fontWeight: '500', margin: '0px 0px 12px 0px'}}>
                    {"Chỉnh sửa bài học"}
                    <Button style={{width: 'auto', backgroundColor: 'red', margin: '0 12px'}} text="Xóa khóa học" onclick={this.showDeletePopup} />
                </div>
                <Separate style={{margin: '0 0 72px 0'}} />
                { this.inputLessonTitle() }
                { this.inputLessonThumbnail() }
                { this.inputLessonLearningTime() }
                { this.inputLessonCategories() }
                { this.inputLessonContent() }
                { this.inputVisible() }
                { this.submitButton() }
                { this.state.isShowDeletePopup ? this.deletePopup() : null }
            </div>
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

    showDeletePopup = () => {
        this.state.isShowDeletePopup = true;
        this.setState(this.state);
    }

    hideDeletePopup = () => {
        this.state.isShowDeletePopup = false;
        this.setState(this.state);
    }

    deleteLesson = async () => {
        this.hideDeletePopup();
        let lesson = this.state.lesson;

        try {
            let rs = await DeleteAPI.getInstance()
                .setToken(Session.getInstance().token)
                .setURL(DomainConfig.domainAPI + "/api/lesson/" + lesson.knowledge_id)
                .execute();
            if (rs.code != 200) throw new Error(rs.message);
            // success navigate to profile
            Toast.getInstance().success("Đã xóa bài học");
            let email = lesson.owner_email;
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
                        {"Bạn có chắc muốn xóa bài học này không?"}
                    </div>
                </div>
                <div style={{width: '50%'}}>
                    <div>
                        <Button text="Chắc chắn" onclick={this.deleteLesson} style={{width: '150px', margin: '0px 6px'}}/>
                    </div>
                    <div>
                        <Button text="Hủy bỏ" onclick={this.hideDeletePopup} style={{width: '150px', margin: '0px 6px'}} />
                    </div>
                </div>
            </div>
        </Popup>
    }


    formatLesson = (lesson) => {
        try {
            if (lesson == null) return;
            lesson.thumbnail = lesson.thumbnail || DomainConfig.domain + "/src/assets/knowledge-icon.jpg";
            lesson.score = (lesson.score != null) ? Number(lesson.score).toFixed(1) : "Chưa có đánh giá";
            lesson.isMark = lesson.isMark || 0;
        } catch(e){
            throw e;
        }
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

    inputLessonTitle = () => {
        let inputTitle = <TextInput 
                onchange={this.onChangeTitle} 
                value={this.state.lesson.title} 
                placeholder={"Tiêu đề cho bài học"}
            />
        return <div>
            { this.leftTitle("Tiêu đề bài học:") }
            { this.rightFrame(inputTitle) }
        </div>
    }

    onChangeTitle = (text) => {
        this.state.lesson.title = text;
        this.setState(this.state);
    }

    inputLessonThumbnail = () => {
        let element = <div style={{width: 'auto', flexDirection: 'column'}}>
            <div>
                <ImageInput 
                    src = {this.state.lesson.thumbnail}
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

    onChangeThumbnail = (image) => {
        this.state.lesson.image = image;
    }

    inputLessonLearningTime = () => {
        let inputTime = <TextInput 
            style={{width: '50%', fontSize: '16px'}}
            type="number"
            onchange={this.onChangeTime} 
            value={this.state.lesson.learning_time} 
            placeholder={"Đơn vị phút"}
        />
        return <div>
            { this.leftTitle("Thời gian học:") }
            { this.rightFrame(inputTime) }
        </div>
    }

    onChangeTime = (text) => {
        this.state.lesson.learning_time = text;
        this.setState(this.state);
    }

    inputLessonCategories = () => {
        let inputDescription = <TextField 
            style={{fontSize: '14px', minHeight: '50px'}}
            onchange={this.onChangeCategories} value={this.state.lesson.stringCategories} 
            placeholder={"Nhập danh sách các categories ngăn cách nhau bởi dấu phẩy\nVí dụ: Math, Physic"}    
        />
        return <div>
            { this.leftTitle("Categories:") }
            { this.rightFrame(inputDescription) }
        </div>
    }

    onChangeCategories = (text) => {
        this.state.lesson.stringCategories = text;
        this.setState(this.state);
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

    inputLessonContent = () => {
        return <div className='edit-lesson-content' style={{flexDirection: 'column'}}>
            <div>
                { this.leftTitle("Soạn thảo nội dung bài học:") }
                { this.rightFrame(null) }
            </div>
            <div className='two-frame' style={{alignItems: 'flex-start'}}>
                <div style={{width: '100%', margin: '4px'}}>
                    <TextField style={{width: '100%', fontSize: '14px', fontFamily: 'consolas', height: 'auto', minHeight: '200px', margin: '4px'}} 
                        placeholder={"Hãy trổ tài code html của bạn vào đây nào"}
                        value={this.state.lesson.content}
                        onchange={this.changeContent}
                    />
                </div>
                <div style={{width: '100%', margin: '4px', minHeight: '200px', alignItems: 'flex-start'}}>
                    <FullheightIframe srcDoc={this.state.lesson.content} 
                        style={{border: 'solid violet 2px', borderRadius: '4px' , margin: '4px', padding: '4px 8px', fontSize: '8px', minHeight: '200px'}} 
                    />
                </div>
            </div>
        </div>
    }

    changeContent = (text) => {
        this.state.lesson.content = text;
        this.setState(this.state);
    }

    inputVisible = () => {
        let listOptions = [
            {
                title: 'Private',
                value: 0
            }, {
                title: 'Default',
                value: 1
            }, {
                title: 'Public',
                value: 2
            }
        ];
        let menuOption = <DropdownMenu 
                style={{width: '50%'}}
                listOptions = {listOptions}
                value = {this.state.lesson.visible}
                onchange = {this.onChangeVisible}
            />;
        return <div style={{flexDirection: 'column'}}>
            <div>
                { this.leftTitle("Chọn loại khóa học:") }
                { this.rightFrame(menuOption) }
            </div>
        </div>
    }

    onChangeVisible = (value) => {
        this.state.lesson.visible = value;
        this.setState(this.state);
    }
   

    submitButton = () => {
        return <Button text="Cập nhật khóa học" 
            style={{fontSize: '20px', margin: '36px'}}
            onclick={this.updateLesson}
             />;
    }

    updateLesson = async (event) => {
        try {
            let res = this.validateLesson();
            if (!res) throw new Error("Bài học không hợp lệ");
            let lesson = this.state.lesson;
            try {
                // post image to get thumbnail url
                if (lesson.image) {
                    let postImage = await PostAPI.getInstance().postImage(lesson.image);
                    if (postImage.code == 200) lesson.thumbnail = postImage.data.url;
                }
            } catch (e) {
                Toast.getInstance().error(e);
            } finally {
                // post create data
                let rs = await PatchAPI.getInstance()
                    .setToken(Session.getInstance().token)
                    .setURL(DomainConfig.domainAPI + "/api/lesson/" + lesson.knowledge_id)
                    .setBody({
                        title: lesson.title,
                        learning_time: lesson.learning_time,
                        content: lesson.content,
                        visible: lesson.visible,
                        categories: lesson.categories,
                        thumbnail: lesson.thumbnail
                    }).execute();
                if (rs.code != 200) throw new Error(rs.message);
                // success navigate to lesson details
                Toast.getInstance().success("Cập nhật bài học thành công");
                let lesson_id = rs.data.knowledge_id;
                this.props.router.navigate('/lesson-detail/' + lesson_id);
            }
        } catch (e) {
            Toast.getInstance().error(e.message);
        }
    }

    validateLesson = () => {
        try {
            let lesson = this.state.lesson;
            // check Title
            if (!(lesson.title && lesson.title.trim().length > 0))
                throw new Error("Tiêu đề không được rỗng");
            lesson.title = lesson.title.trim();
                
            // check learning_time
            if (!(lesson.learning_time && lesson.learning_time >= 0))
                throw new Error("Thời gian học không hợp lệ");
                
            // check categories
            lesson.categories = this.formatCategories(lesson.stringCategories);
            if (!(lesson.categories && lesson.categories.length > 0))
                throw new Error("Categories không hợp lệ");
            
            // check content:
            if (!(lesson.content && lesson.content.trim().length > 0))
                throw new Error("Nội dung không được rỗng");
            lesson.content = lesson.content.trim();

            // check visible
            let v = lesson.visible;
            if (!(v != null && (v == 0 || v == 1 || v == 2)))
                throw new Error("Visible is invalid")

            return true;
        } catch (e) {
            Toast.getInstance().error(e.message)
            return false;
        }
    }
}


export default withRouter(LessonUpdate);
