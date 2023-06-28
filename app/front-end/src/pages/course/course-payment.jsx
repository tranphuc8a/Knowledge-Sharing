


import React from 'react';
import withRouter from '../../components/router/withRouter';
import Layout from '../../components/layout/layout';
import Session from '../../session/session';
import GetAPI from '../../services/api/get-api';
import Header from '../../components/layout/header/header';
import DomainConfig from '../../config/domain-config';
import Toast from '../../utils/toast';
import Separate from '../../components/separate/separate';
import Button from '../../components/button/button';
import TextInput from '../../components/inputfield/text-input';
import Banner from '../../components/layout/banner/banner';
import PostAPI from '../../services/api/post-api';



class CoursePayment extends React.Component{
    constructor(props){
        super(props);
        this.courseid = props.router.params.courseid;
        this.mainUser = Session.getInstance().mainUser;
        this.learner_email = this.mainUser ? this.mainUser.email : null;

        this.state = {
            course: null,
            learner: null,
            owner: null,
            money: '',
            password: ''
        }
    }

    componentDidMount() {
        if (this.learner_email == null) return;
        this.getLearner();
        let that = this;
        this.getCourse().then((res) => {
            if (this.state.course != null)
                this.getOwner();
        });
    }

    getCourse = async () => {
        try {
            let res = await GetAPI.getInstance()
                .setURL(DomainConfig.domainAPI + '/api/courses/detail/' + this.courseid)
                .setToken(Session.getInstance().token)
                .execute();
            if (res.code >= 300 || res.code < 200)
                throw Error(res.message);
            res = res.data;
            this.state.course = res;
            // this.state.navbarIndex = 0;
            this.setState(this.state);
        } catch (e){
            Toast.getInstance().error(e.message);
        }
    }

    getLearner = async () => {
        try {
            let res = await GetAPI.getInstance()
                .setURL(DomainConfig.domainAPI + '/api/profile/' + this.learner_email)
                .setToken(Session.getInstance().token)
                .execute();
            if (res.code >= 300 || res.code < 200)
                throw Error(res.message);
            res = res.data;
            this.state.learner = res;
            // this.state.navbarIndex = 0;
            this.setState(this.state);
        } catch (e){
            Toast.getInstance().error(e.message);
        }
    }

    getOwner = async () => {
        try {
            let res = await GetAPI.getInstance()
                .setURL(DomainConfig.domainAPI + '/api/profile/' + this.state.course.owner_email)
                .setToken(Session.getInstance().token)
                .execute();
            if (res.code >= 300 || res.code < 200)
                throw Error(res.message);
            res = res.data;
            this.state.owner = res;
            // this.state.navbarIndex = 0;
            this.setState(this.state);
        } catch (e){
            Toast.getInstance().error(e.message);
        }
    }

    render(){
        let { style } = this.props;
        if (this.learner_email == null || this.learner_email == null)
            return this.nullPayment("Không có quyền thanh toán khóa học");
        if (this.state.course == null)
            return this.nullPayment("Không tìm thấy khóa học");
        if (this.state.course.isfree == 1)
            return this.nullPayment("Đây là khóa học miễn phí")
        if (this.state.owner == null)
            return this.nullPayment("Không tìm thấy chủ khóa học");
        if (this.learner_email == this.state.course.owner_email)
            return this.nullPayment("Không thể tự đăng ký khóa học của mình")

        return <Layout header={<Header active={1}/>} >
            <Banner />
            <div style={{...style, width: '90%', margin: '72px 0px 72px 0px', flexDirection: 'column'}}>
                <div style={{justifyContent: 'flex-start', fontSize: '24px', fontWeight: '500', margin: '0px 0px 12px 0px'}}>
                    {"Thông tin hóa đơn thanh toán khóa học"}
                </div>
                <Separate style={{margin: '0 0 72px 0'}} />
                <div style={{ justifyContent: 'space-between' }}>
                    <div style={{width: '100%'}}>
                        { this.learnerInfo() }
                    </div>
                    <div style={{ width: '72px', height: '100%', backgroundColor: 'violet'}}>

                    </div>
                    <div style={{width: '100%'}}>
                        { this.ownerInfo() }
                    </div>
                </div>
                <Separate style={{margin: '36px 0 0 0'}} />
                { this.courseInfo() }
                <Separate style={{margin: '0 0 36px 0'}} />
                { this.verification() }
            </div>
        </Layout>;
    }

    nullPayment(message){
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
            > {message} </div>
        </Layout>
    }

    learnerInfo = () => {
        this.formatUser(this.state.learner);
        return this.userInfo(this.state.learner, "Thông tin người mua khóa học");
    }

    ownerInfo = () => {
        this.formatUser(this.state.owner);
        return this.userInfo(this.state.owner, "Thông tin người chủ khóa học");
    }

    userInfo = (user, title) => {
        return <div style={{flexDirection: 'column'}}>
            <div style={{justifyContent: 'flex-start', fontSize: '18px', fontWeight: '500', margin: '0px 0px 12px 0px'}}>
                {title}
            </div>
            <Separate style={{margin: '0 0 18px 0'}} />
            <div style={{flexDirection: 'column'}}>
                <div style={{justifyContent: 'space-between'}}>
                    <div style={{width: 'auto', fontWeight: 'bold'}}>
                        {"Họ tên:"}
                    </div>
                    <div style={{width: 'auto'}}>
                        {user.name}
                    </div>
                </div>
                <div style={{justifyContent: 'space-between'}}>
                    <div style={{width: 'auto', fontWeight: 'bold'}}>
                        {"Email:"}
                    </div>
                    <div style={{width: 'auto'}}>
                        {user.email}
                    </div>
                </div>
                <div style={{justifyContent: 'space-between'}}>
                    <div style={{width: 'auto', fontWeight: 'bold'}}>
                        {"Giới tính:"}
                    </div>
                    <div style={{width: 'auto'}}>
                        {user.gender}
                    </div>
                </div>
                <div style={{justifyContent: 'space-between'}}>
                    <div style={{width: 'auto', fontWeight: 'bold'}}>
                        {"Địa chỉ:"}
                    </div>
                    <div style={{width: 'auto'}}>
                        {user.address}
                    </div>
                </div>
                <div style={{justifyContent: 'space-between'}}>
                    <div style={{width: 'auto', fontWeight: 'bold'}}>
                        {"Số điện thoại:"}
                    </div>
                    <div style={{width: 'auto'}}>
                        {user.phone}
                    </div>
                </div>
            </div>
        </div>
    }

    courseInfo = () => {
        let course = this.state.course;

        return <div style={{flexDirection: 'column', width: '70%', margin: '48px 0 24px 0px '}}>
            <div style={{justifyContent: 'flex-start', fontSize: '18px', fontWeight: '700', margin: '0px 0px 12px 0px'}}>
                {"Thông tin khóa học"}
            </div>
            <Separate style={{margin: '0 0 18px 0'}} />
            <div style={{flexDirection: 'column'}}>
                <div style={{justifyContent: 'space-between'}}>
                    <div style={{width: 'auto', fontWeight: 'bold'}}>
                        {"Tên khóa học:"}
                    </div>
                    <div style={{width: 'auto'}}>
                        {course.title}
                    </div>
                </div>
                <div style={{justifyContent: 'space-between'}}>
                    <div style={{width: 'auto', fontWeight: 'bold'}}>
                        {"Số lượng bài học: "}
                    </div>
                    <div style={{width: 'auto'}}>
                        { course.numlesson}
                    </div>
                </div>
                <div style={{justifyContent: 'space-between'}}>
                    <div style={{width: 'auto', fontWeight: 'bold'}}>
                        {"Ngày tạo khóa học:"}
                    </div>
                    <div style={{width: 'auto'}}>
                        { course.create_at}
                    </div>
                </div>
                <div style={{justifyContent: 'space-between'}}>
                    <div style={{width: 'auto', fontWeight: 'bold'}}>
                        {"Thời gian học:"}
                    </div>
                    <div style={{width: 'auto'}}>
                        { course.learning_time + " phút" }
                    </div>
                </div>
                <div style={{justifyContent: 'space-between', fontSize: 'larger'}}>
                    <div style={{width: 'auto', fontWeight: 'bold'}}>
                        {"Giá tiền:"}
                    </div>
                    <div style={{width: 'auto', fontWeight: 'bold'}}>
                        {course.fee + " VNĐ"}
                    </div>
                </div>
            </div>
        </div>
    }   

    formatUser = (user) => {
        Object.keys(user).forEach((key) => {
            user[key] = user[key] || "Không có";
        });
    }
    
    verification = () => {
        return <div style={{ flexDirection: 'column', fontSize: '15px', width: 'auto', minWidth: '500px' }}>
            <div>
                <div style={{ width: '25%', justifyContent: 'flex-end' }}>
                    {"Nhập số tiền:"}
                </div>
                <div style={{width: '12px'}}></div>
                <div style={{ width: '75%', justifyContent:'flex-start' }}> 
                    <TextInput type="number" 
                        value={ this.state.money } 
                        onchange={this.onChangeMoney} 
                        style={{ fontSize: '15px', width: '100%'}}
                        placeholder="Nhập lại số tiền thanh toán"
                        />
                </div>
            </div>
            <div style={{ width: '100%' }}>
                <div style={{ width: '25%', justifyContent: 'flex-end'  }}>
                    {"Nhập mật khẩu: "}
                </div>
                <div style={{width: '12px'}}></div>
                <div style={{ width: '75%', justifyContent:'flex-start' }}>
                    <TextInput type="password" 
                        value={ this.state.password } 
                        onchange={this.onChangePassword} 
                        style={{ fontSize: '15px', width: '100%' }}
                        placeholder="Nhập mật khẩu xác thực"
                        />
                </div>
            </div>
            <div style={{margin: '36px'}}>
                <Button text="Thanh toán khóa học" onclick={this.payCourse} ></Button>
            </div>
        </div>
    }

    onChangeMoney = (money) => {
        this.state.money = money;
        this.setState(this.state);
    }

    onChangePassword = (pass) => {
        this.state.password = pass;
        this.setState(this.state);
    }

    submitButton = () => {
        return <Button text="Thanh toán khóa học" 
            style={{fontSize: '20px', margin: '36px'}}
            onclick={this.payCourse}
             />;
    }

    payCourse = async () => {
        try {
            if (! this.validatePayment() ) return;
            let { learner, course, owner, money, password} =  this.state;

            let res = await PostAPI.getInstance()
                .setURL(DomainConfig.domainAPI + "/api/courses/pay/" + course.knowledge_id)
                .setToken(Session.getInstance().token)
                .setData({
                    money: money,
                    password: password
                })
                .execute();
            if (res.code != 200) throw new Error(res.message);
            Toast.getInstance().success("Thanh toán khóa học thành công");
            this.props.router.navigate('/course-detail/' + course.knowledge_id);
        } catch (e) {
            Toast.getInstance().error(e.message);
        }

    }

    validatePayment = () => {
        try {
            let {money, password} = this.state;
            
            if (!(money && money > 0))
                throw new Error("Số tiền không hợp lệ");

            if (!(password && password.length > 0))
                throw new Error("Mật khẩu không hợp lệ");

            return true;
        } catch (e) {
            Toast.getInstance().error(e.message)
            return false;
        }
    }
}


export default withRouter(CoursePayment);
