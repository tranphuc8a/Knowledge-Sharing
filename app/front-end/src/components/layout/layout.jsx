// Layout.js
import React from 'react';
import Header from './header/header';
import Footer from './footer/footer';
import './layout.css';


class Layout extends React.Component{
    constructor(props){
        super(props); 
        this.header     = props.header     || <Header />;
        this.content    = props.content    || props.children;
        this.footer     = props.footer     || <Footer />;  
        this.state = {
            header: {
                style: {}
            },
            scrollX: 0,      
            scrollY: 0
        }
    }

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
    }
  
    componentWillUnmount() {
       window.removeEventListener('scroll', this.handleScroll);
    }

    render(){
        return (
            <div className="app">
                <header 
                    onMouseLeave={this.hideHeader}
                    onMouseEnter={this.showHeader}
                    style={{ height: '75px', position: 'fixed', top: 0, left: 0 }}
                >
                    <div className="header" style={this.state.header.style} >
                        { this.header }
                    </div>
                </header>

                <main className="content">
                    { this.content }
                </main>

                <footer className="footer">
                    { this.footer }
                </footer>
            </div>
        );
    }

    hideHeader = (event) => {
        let {scrollX, scrollY} = this.state;
        if (scrollY <= 150) return;
        this.timeoutId = setTimeout(() => {
            this.setState({
                header: {
                    style: {
                        transform: 'translateY(-100%)'
                    }
                }
            })
        }, 3000);
    }

    showHeader = (event) =>{
        clearTimeout(this.timeoutId); // Xóa bỏ timeout hiện tại nếu có
        this.setState({
            header: {
                style: {
                    transform: 'translateY(0)'
                }
            }
        });
    }

    handleScroll = () => {
        this.setState({
            scrollX: window.scrollX,
            scrollY: window.scrollY,
            header: {
                style: {
                    transform: window.scrollY > 500 ? 'translateY(-100%)' : 'translateY(0)'
                }
            }
        });
    };
}


export default Layout;
