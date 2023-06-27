// Layout.js
import React from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';


class NavBar extends React.Component{
    constructor(){
        super();
        this.state = {
            active: null
        }
    }

    // componentDidMount(){
    //     this.setState({
    //         active: this.props.active
    //     })
    // }

    render(){
        this.state.active = this.props.active;
        let links = this.props.links;
        return (
            <nav className={this.props.className} style={{ flexWrap: 'wrap', justifyContent: 'flex-start', alignItems: 'flex-start', ...this.props.style}}>
                {
                    links.map((link, index) => (
                        <li key={index} className={'item'}>
                            {
                            link.url != null ?
                            <Link to = {link.url} className={(index == this.state.active ? "active" : "" )}> 
                                {link.title}
                            </Link> :
                            <div onClick={this.click(link, index)} style={{cursor: 'pointer', height: '100%'}} 
                                className={(index == this.state.active ? "active" : "" )}
                            >
                                {link.title}
                            </div>
                            }
                        </li>
                    ))
                }
            </nav>
        );
    }

    click = (link, index) => {
        return () => {
            this.setState({
                active: index
            });
            link.onClick();
        }
    }

}


export default NavBar;
