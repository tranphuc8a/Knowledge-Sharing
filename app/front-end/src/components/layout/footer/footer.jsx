// Layout.js
import React from 'react';
import './footer.css';
import Logo from '../../logo/logo';
import withRouter from '../../router/withRouter';
import MyRoute from '../../router/route';
import DomainConfig from '../../../config/domain-config';

class Footer extends React.Component{
    constructor(){
        super();
    }

    render(){
        return (
            <div style={this.props.style} className='footer-parent'>
                <div className='footer-introduce'>
                    <Logo height={"100px"} style = {{width : 'auto', cursor: 'pointer', margin: '6px 0px'}}/>
                    <p className='fi-introduce'>Knowledge Sharing là nền tảng tương tác trực tuyến hỗ trợ người dùng học tập, thực hành, thi đấu và đánh giá kỹ năng lập trình một cách nhanh chóng và chính xác.</p>
                    <div className='fi-list-icons'>
                        <img onClick={this.clickFacebook} src={ DomainConfig.domain + '/src/assets/facebook-icon.png'} alt='facebook' />
                        <img onClick={this.clickYoutube} src={ DomainConfig.domain + '/src/assets/youtube-icon.png'} alt='youtube' />
                        <img onClick={this.clickTwitter} src={ DomainConfig.domain + '/src/assets/twitter-icon.png'} alt='twitter' />
                        <img onClick={this.clickInstagram} src={ DomainConfig.domain + '/src/assets/instagram-icon.png'} alt='instagram' />
                    </div>
                </div>
                <div className='footer-producer' style={{}}> 
                    <span> BTL Chuyên đề 20222, by Group ... HUST@SoICT </span>
                </div>
            </div>
        );
    }

    clickFacebook = (event) => {
        window.location.replace('https://facebook.com');
        // this.props.location.replace('https://facebook.com');
    }

    clickYoutube = (event) => {
        window.location.replace('https://youtube.com');
        // this.props.location.replace('https://youtube.com');
    }

    clickInstagram = (event) => {
        window.location.replace('https://instagram.com');
        // this.props.location.replace('https://instagram.com');
    }

    clickTwitter = (event) => {
        window.location.replace('https://twitter.com');
        // this.props.location.replace('https://twitter.com');
    }
}


export default withRouter(Footer);

