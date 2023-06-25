
import React from "react";
import {AiFillStar, AiOutlineStar, AiOutlineReload} from 'react-icons/ai';
import Button from "../../button/button";
import Popup from "../../popup/popup";
import Session from "../../../session/session";
import PostAPI from "../../../services/api/post-api";
import DomainConfig from "../../../config/domain-config";
import PutAPI from "../../../services/api/put-api";
import Toast from "../../../utils/toast";
import 'react-toastify/dist/ReactToastify.css';
import Separate from "../../separate/separate";


class ScoreBanner extends React.Component{
    constructor(props){
        super(props);
        this.state = { 
            isShowPopup: false,
            chooseIndex: -1,
            starIndex: -1
        }
    }

    render(){
        let {style, knowledge } = this.props;
        this.knowledge = knowledge;
        return (
            <div style={{...style, flexDirection: 'column', margin: '0px 0px 36px 0px'}}>  
                <Separate />
                <div style={{justifyContent: 'flex-start', fontSize: '24px', fontWeight: '500'}}>
                    {"Đánh giá bài học"}
                </div>
                {
                    (knowledge.score >= 0 && knowledge.score <= 5) ?
                    this.getScoreBanner() :
                    <div style={{fontSize: '20px', fontWeight: '500', margin: '0px 0px 36px 0px'}}> 
                        Chưa có đánh giá nào cho bài học
                    </div>
                }
            </div>
        );
    }

    getScoreBanner = () => {
        let knowledge = this.knowledge;
        return <div style={{width: '100%', flexDirection: 'column'}}> 
            <div style={{fontSize: '24px', fontWeight: '500'}} >
                { knowledge.score }
                <AiFillStar style={{fill: 'orange',  width: '36px'}} />
                {"/5"}
                <AiFillStar style={{fill: 'orange',  width: '36px'}}/>
            </div>
            <div>
                <Button text="Thêm đánh giá" onclick={this.addScore} 
                    style={{
                        margin: '16px',
                        padding: '12px 32px',
                        fontSize: '22px'
                    }}
                />
            </div>
            { Toast.container }
            { this.state.isShowPopup ? this.getScorePopup() : null}
        </div>
    }

    addScore = (event) => {
        this.setState({
            isShowPopup: true
        })
    }

    getScorePopup(){
        return <Popup>
            <div style={{width: '60%', height: 'auto', borderRadius: '6px', flexDirection:'column', padding: '48px 24px'}}>
                <div style={{flexDirection: 'column'}}>
                    <div style={{fontSize: '24px', fontWeight: '500'}}>
                        {"Chọn điểm đánh giá"}
                        <AiOutlineReload style={{fill:"violet", width: '40px', margin: '0 12px', cursor:'pointer'}} 
                            onClick={this.resetStar}
                        />
                    </div>
                    <div style={{margin: '32px'}}>
                        {this.listStar()}
                    </div>
                </div>
                <div style={{width: '80%'}}>
                    <div style={{margin: '0px 6px'}}>
                        <Button text="Thêm đánh giá" onclick={this.submitScore}/>
                    </div>
                    <div style={{margin: '0px 6px'}}>
                        <Button text="Hủy bỏ" onclick={this.cancelScore} />
                    </div>
                </div>
            </div>
        </Popup>
    }

    resetStar = (event) => {
        this.state.starIndex = this.state.chooseIndex = -1;
        this.setState(this.state);
    }
    listStar = () => {
        let chooseIndex = this.state.chooseIndex;
        let starIndex = this.state.starIndex;
        let stars = [
            starIndex >= 0 ? <AiFillStar style={{fill: 'orange'}} /> : <AiOutlineStar style={{fill: 'orange'}} />,
            starIndex >= 1 ? <AiFillStar style={{fill: 'orange'}} /> : <AiOutlineStar style={{fill: 'orange'}} />,
            starIndex >= 2 ? <AiFillStar style={{fill: 'orange'}} /> : <AiOutlineStar style={{fill: 'orange'}} />,
            starIndex >= 3 ? <AiFillStar style={{fill: 'orange'}} /> : <AiOutlineStar style={{fill: 'orange'}} />,
            starIndex >= 4 ? <AiFillStar style={{fill: 'orange'}} /> : <AiOutlineStar style={{fill: 'orange'}} />,
        ];
        let mouserEnterStar = (index) => {
            this.state.starIndex = index;
            this.setState(this.state);
        }
        let mouseLeaveStar = (index) => {
            this.state.starIndex = chooseIndex;
            this.setState(this.state)
        }
        let clickStar = (index) => {
            this.state.chooseIndex = index;
            this.setState(this.state);
        }
        return <div>
            {stars.map((star, index) =>
                <div key = {index}
                    onMouseEnter={(event) => { mouserEnterStar(index) }}
                    onMouseLeave={(event) => { mouseLeaveStar(index) }}
                    onClick={(event) => { clickStar(index) }}
                    style={{width: '100px'}}
                > 
                    {star}
                </div>
            )}
        </div>
    }

    submitScore = (event) => {
        this.state.isShowPopup = false;
        let score = this.state.chooseIndex + 1;
        this.setState(this.state);
        // call api update:
        // if (Session.getInstance().isAnonymous()){
        //     // require login
        //     return;
        // }
        let updateKnowledge = this.props.updateKnowledge;
        let callApi = async () => {
            try {
                let res = await PutAPI.getInstance()
                    .setURL(DomainConfig.domainAPI + "/api/knowledge/score/" + this.knowledge.id)
                    .setData({score: score})
                    .setToken(Session.getInstance().token)
                    .execute();
                if (res.code != 200) throw new Error(res.message);
                Toast.getInstance().success("Đã thêm đánh giá");
                updateKnowledge();
            } catch (e){
                Toast.getInstance().error(e.message);
            }
        }
        callApi();
    }

    cancelScore = (event) => {
        this.setState({
            isShowPopup: false
        })
    }
}

export default ScoreBanner;

