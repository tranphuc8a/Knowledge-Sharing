


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


class LessonCreate extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            lesson: {
                title: '',
                description: '',
                learning_time: '',
                stringCategories: '',
                fee: '',
                isfree: 1
            },
        }
    }

    render(){
        let { style } = this.props;
        return <Layout header={<Header active={1}/>} >
            <div style={{...style, width: '90%', margin: '72px 0px 72px 0px', flexDirection: 'column'}}>
                <div style={{justifyContent: 'flex-start', fontSize: '24px', fontWeight: '500', margin: '0px 0px 12px 0px'}}>
                    {"Tạo khóa học mới cho bản thân"}
                </div>
                <Separate style={{margin: '0 0 72px 0'}} />
                { this.inputlessonTitle() }
                { this.inputlessonThumbnail() }
                { this.inputlessonDescription() }
                { this.inputlessonLearningTime() }
                { this.inputlessonCategories() }
                { this.inputlessonFee() }
                { this.submitButton() }
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

    inputlessonTitle = () => {
        let inputTitle = <TextInput 
                onchange={this.onChangeTitle} 
                value={this.state.lesson.title} 
                placeholder={"Tiêu đề cho khóa học"}
            />
        return <div>
            { this.leftTitle("Tiêu đề khóa học:") }
            { this.rightFrame(inputTitle) }
        </div>
    }

    onChangeTitle = (text) => {
        this.state.lesson.title = text;
        this.setState(this.state);
    }

    inputlessonThumbnail = () => {
        let element = <div style={{width: 'auto', flexDirection: 'column'}}>
            <div>
                <ImageInput 
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

    inputlessonDescription = () => {
        let inputDescription = <TextField 
            style={{fontSize: '14px'}}
            onchange={this.onChangeDescription} value={this.state.lesson.description} 
            placeholder={"Nhập mô tả cho khóa học của bạn"}    
        />
        return <div>
            { this.leftTitle("Mô tả khóa học:") }
            { this.rightFrame(inputDescription) }
        </div>
    }

    onChangeDescription = (text) => {
        this.state.lesson.description = text;
        this.setState(this.state);
    }

    inputlessonLearningTime = () => {
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

    inputlessonCategories = () => {
        let inputDescription = <TextField 
            style={{fontSize: '14px', minHeight: '50px'}}
            onchange={this.onChangeCategories} value={this.state.lesson.stringCategories} 
            placeholder={"Nhập danh sách các categories ngăn cách nhau bởi dấu phẩy\nVí dụ: Math, Physic"}    
        />
        return <div>
            { this.leftTitle("Categories") }
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

    inputlessonFee = () => {
        let listOptions = [
            {
                title: 'Miễn phí',
                value: 1
            }, {
                title: 'Có tính phí',
                value: 0
            }
        ];
        let menuOption = <DropdownMenu 
                style={{width: '50%'}}
                listOptions = {listOptions}
                value = {this.state.lesson.isfree}
                onchange = {this.onChangeFeeFlag}
            />
        let inputMoney = <TextInput 
            style={{width: '50%', fontSize: '16px'}}
            type="number"
            onchange={this.onChangeFee} 
            value={this.state.lesson.fee} 
            placeholder={"Đơn vị VNĐ"}
        />
        return <div style={{flexDirection: 'column'}}>
            <div>
                { this.leftTitle("Chọn hình thức khóa học") }
                { this.rightFrame(menuOption) }
            </div>
            <div>
                { (this.state.lesson.isfree == 0) && (
                    <div> 
                        { this.leftTitle("Nhập số tiền") }
                        { this.rightFrame(inputMoney) }
                    </div>
                )}
            </div>
        </div>
    }

    onChangeFeeFlag = (value) => {
        this.state.lesson.isfree = value;
        this.setState(this.state);
    }

    onChangeFee = (value) => {
        this.state.lesson.fee = value;
        this.setState(value);
    }

    submitButton = () => {
        return <Button text="Tạo khóa học" 
            style={{fontSize: '20px', margin: '36px'}}
            onclick={this.creatlesson}
             />;
    }

    creatlesson = async (event) => {
        try {
            let res = this.validatelesson();
            if (!res) throw new Error("Khóa học không hợp lệ");
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
                let rs = await PostAPI.getInstance()
                    .setToken(Session.getInstance().token)
                    .setURL(DomainConfig.domainAPI + "/api/lessons")
                    .setBody({
                        title: lesson.title,
                        learning_time: lesson.learning_time,
                        description: lesson.description,
                        isfree: lesson.isfree,
                        fee: lesson.fee,
                        categories: lesson.categories,
                        thumbnail: lesson.thumbnail
                    }).execute();
                if (rs.code != 200) throw new Error(rs.message);
                // success navigate to lesson details
                Toast.getInstance().success("Tạo khóa học thành công");
                let lesson_id = rs.data.knowledge_id;
                this.props.router.navigate('/lesson-detail/' + lesson_id);
            }
        } catch (e) {
            Toast.getInstance().error(e.message);
        }
    }

    validatelesson = () => {
        try {
            let lesson = this.state.lesson;
            // check Title

            if (!(lesson.title && lesson.title.trim().length > 0))
                throw new Error("Tiêu đề không được rỗng");
            lesson.title = lesson.title.trim();

            // check description
            if (!(lesson.description && lesson.description.trim().length > 0))
                throw new Error("Mô tả không được rỗng");
            lesson.description = lesson.description.trim();
                
            // check learning_time
            if (!(lesson.learning_time && lesson.learning_time >= 0))
                throw new Error("Thời gian học không hợp lệ");
                
            // check categories
            lesson.categories = this.formatCategories(lesson.stringCategories);
            if (!(lesson.categories && lesson.categories.length > 0))
                throw new Error("Categories không hợp lệ");
            
            // check fee:
            if (!lesson.isfree) {
                if (!(lesson.fee && lesson.fee >= 0))
                    throw new Error("Thời gian học không hợp lệ");
            }
            return true;
        } catch (e) {
            Toast.getInstance().error(e.message)
            return false;
        }
    }
}


export default withRouter(LessonCreate);
