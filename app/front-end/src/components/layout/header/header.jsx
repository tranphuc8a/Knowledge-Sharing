// Layout.js
import React from 'react';
import NavBar from '../../navbar/navbar';
import Logo from '../../logo/logo';
import AvatarToolbar from '../avatar-toolbar/avatar-toolbar';
import './header.css';


class Header extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return (
            <div className="header">
                <Logo 
                    height = {'90%'}
                    style = {{
                        margin: '0px 32px',
                        width: 'auto',
                        cursor: 'pointer'
                    }}
                />
                <div style={{ justifyContent: 'space-between'}}>
                    <NavBar
                        className={"header-navbar"}
                        active = {this.props.active}
                        links = {[{
                            url: '/home',
                            title: 'Trang chủ'
                        }, {
                            url: 'https://youtube.com',
                            title: 'Học tập'
                        }, {
                            url: 'https://youtube.com',
                            title: 'Thảo luận'
                        }, {
                            url: 'https://youtube.com',
                            title: 'Kết nối'
                        }]} 
                    />
                    <AvatarToolbar style = {{
                        width: 'auto',
                        padding: '0px 12px'
                    }} />
                </div>
            </div>
        );
    }
}


export default Header;
