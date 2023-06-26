

import React from "react";
import Button from "../button/button";
import PostAPI from "../../services/api/post-api";
import DomainConfig from "../../config/domain-config";
import Session from "../../session/session";
import Toast from "../../utils/toast";
import MyMutex from "../../utils/mutex";
import DeleteAPI from "../../services/api/delete-api";
import Popup from "../popup/popup";
import withRouter from "../router/withRouter";

class CourseRegisterButton extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            canClickButton: true,
            isShowLeaveCoursePopup: false
        }
        this.lockButton = new MyMutex();
    }

    render(){
        this.course = this.props.course;
        return <div style={{justifyContent: 'center', flexDirection: 'column'}}>
            { this.getButton() }
            { this.state.isShowLeaveCoursePopup ? this.getLeaveCoursePopup() : null }
        </div>
    }

    getButton = () => {
        let { style } = this.props;
        let course = this.course;
        switch (course.relevant){
            case 0: // chưa đăng ký
                return <Button style = {style} text = {"Đăng ký khóa học"} onclick={this.register} />
            case 1: // requested
                return <Button style = {style} text = {"Hủy yêu cầu"} onclick={this.cancelRequest} />
            case 2: // invited
                return <div style={{flexDirection: 'column', justifyContent: 'center'}}>
                    <div style={{ display:'flex', justifyContent: 'center', margin: '12px 0px'}}>
                        <Button style={{
                            backgroundColor: 'green',
                            color: 'white',
                            margin: '0px 12px'
                        }} text = {"Đồng ý"} onclick = { (event) => { this.confirm(1) } } />
                        <Button style={{
                            backgroundColor: 'red',
                            color: 'white',
                            margin: '0px 12px'
                        }} text = {"Từ chối"} onclick = { (event) => { this.confirm(0) } } />
                    </div>
                    <div style={{ justifyContent: 'center'}}> Chủ khóa học đã mời bạn tham gia khóa học này</div>
                </div>
            case 3: // joined
                return <Button style = {style} text = {"Rời khóa học"} onclick={this.showLeaveCoursePopup} />
            case 4: // owner
                return <Button style = {style} text = {"Chỉnh sửa khóa học"} onclick={this.updateCourse} />
        }
        return null;
    }

    getLeaveCoursePopup = () => {
        return <Popup style={{justifyContent: 'center'}}>
            <div style={{width: '60%', height: 'auto', borderRadius: '6px', flexDirection:'column', padding: '48px 24px'}}>
                <div style={{flexDirection: 'column', margin: '32px 0px'}}>
                    <div style={{fontSize: '24px', fontWeight: '500'}}>
                        {"Bạn có chắc muốn rời khóa học này không?"}
                    </div>
                </div>
                <div style={{width: '50%'}}>
                    <div>
                        <Button text="Chắc chắn" onclick={this.leaveCourse} style={{width: '150px', margin: '0px 6px'}}/>
                    </div>
                    <div>
                        <Button text="Hủy bỏ" onclick={this.hideLeaveCoursePopup} style={{width: '150px', margin: '0px 6px'}} />
                    </div>
                </div>
            </div>
        </Popup>
    }

    showLeaveCoursePopup = () => {
        this.state.isShowLeaveCoursePopup = true;
        this.setState(this.state);
    }

    hideLeaveCoursePopup = () => {
        this.state.isShowLeaveCoursePopup = false;
        this.setState(this.state);
    }

    register = async (event) => {
        let course = this.course;
        if (course.isfree == 0) { // Khóa học có tính phí
            // CHuyển màn thanh toán
            // return;
        }
        if (this.lockButton.isLocked()) return;
        await this.lockButton.lock();
        let updateCourse = this.props.updateCourse;

        try {
            let res = await PostAPI.getInstance()
                .setURL(DomainConfig.domainAPI + "/api/courses/register/" + course.knowledge_id)
                .setToken(Session.getInstance().token)
                .execute();
            if (res.code != 200) throw new Error(res.message);
            Toast.getInstance().success("Đã đăng ký khóa học thành công");
            updateCourse();
        } catch (e) {
            Toast.getInstance().error(e.message);
        } finally {
            this.lockButton.unlock();
        }
    }

    cancelRequest = async (event) => {
        let course = this.course;
        if (this.lockButton.isLocked()) return;
        await this.lockButton.lock();
        let updateCourse = this.props.updateCourse;

        try {
            let res = await PostAPI.getInstance()
                .setURL(DomainConfig.domainAPI + "/api/courses/register/" + course.knowledge_id)
                .setToken(Session.getInstance().token)
                .execute();
            if (res.code != 200) throw new Error(res.message);
            Toast.getInstance().success("Đã đăng ký khóa học thành công");
            updateCourse();
        } catch (e) {
            Toast.getInstance().error(e.message);
        } finally {
            this.lockButton.unlock();
        }
    }

    confirm = async (okay) => {
        let course = this.course;
        if (course.requestid == null) return Toast.getInstance().error("Không tồn tại lời mời");
        if (this.lockButton.isLocked()) return;
        await this.lockButton.lock();
        let updateCourse = this.props.updateCourse;
        let successMessage = (okay == 1) ? "Đã đồng ý tham gia khóa học" : "Đã từ chối tham gia khóa học";
        try {
            let res = await DeleteAPI.getInstance()
                .setURL(DomainConfig.domainAPI + "/api/courses/invite/" + course.requestid)
                .setToken(Session.getInstance().token)
                .setBody({type: okay})
                .execute();
            if (res.code != 200) throw new Error(res.message);
            Toast.getInstance().success(successMessage);
            updateCourse();
        } catch (e) {
            Toast.getInstance().error(e.message);
        } finally {
            this.lockButton.unlock();
        }
    }

    leaveCourse = async (event) => {
        let course = this.course;
        if (this.lockButton.isLocked()) return;
        await this.lockButton.lock();
        this.state.isShowLeaveCoursePopup = false;
        this.setState(this.state);
        let updateCourse = this.props.updateCourse;
        try {
            let res = await DeleteAPI.getInstance()
                .setURL(DomainConfig.domainAPI + "/api/courses/register/" + course.knowledge_id)
                .setToken(Session.getInstance().token)
                .execute();
            if (res.code != 200) throw new Error(res.message);
            Toast.getInstance().success("Đã rời khóa học");
            updateCourse();
        } catch (e) {
            Toast.getInstance().error(e.message);
        } finally {
            this.lockButton.unlock();
        }
    }

    updateCourse = (event) => {
        // navigate to update course page
        this.props.router.navigate('/course-update/' + this.props.course.knowledge_id);
    }

}

export default withRouter(CourseRegisterButton);

