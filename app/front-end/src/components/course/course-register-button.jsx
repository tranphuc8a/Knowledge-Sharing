

import React from "react";
import Button from "../button/button";

class CourseRegisterButton extends React.Component{
    constructor(props){
        super(props);
        this.state = {}
        this.course = this.props.course;
    }

    render(){
        let {style } = this.props;
        switch (this.course.relevant){
            case 0: // chưa đăng ký
                return <Button style = {style} text = {"Đăng ký khóa học"} onclick={this.register} />
            case 1: // requested
                return <Button style = {style} text = {"Hủy yêu cầu"} onclick={this.register} />
            case 2: // invited
                return <div style={{flexDirection: 'column', justifyContent: 'center'}}>
                    <div style={{ display:'flex', justifyContent: 'center', margin: '12px 0px'}}>
                        <Button style={{
                            backgroundColor: 'green',
                            color: 'white',
                            margin: '0px 12px'
                        }} text = {"Đồng ý"} onclick = {this.confirm(true)} />
                        <Button style={{
                            backgroundColor: 'red',
                            color: 'white',
                            margin: '0px 12px'
                        }} text = {"Từ chối"} onclick = {this.confirm(false)} />
                    </div>
                    <div style={{ justifyContent: 'center'}}> Chủ khóa học đã mời bạn tham gia khóa học này</div>
                </div>
            case 3: // joined
                return <Button style = {style} text = {"Rời khóa học"} onclick={this.register} />
            case 4: // owner
                return <Button style = {style} text = {"Chỉnh sửa khóa học"} onclick={this.register} />
        }
        return null;
    }

    register = (event) => {
        alert("Register course");
    }

    confirm = (okay) => {

    }


}

export default CourseRegisterButton;

