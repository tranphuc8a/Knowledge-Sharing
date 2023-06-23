// Layout.js
import React from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';


class NavBar extends React.Component{
    constructor(){
        super();
    }

    render(){
        let links = this.props.links;
        return (
            <nav style={this.props.style}>
                {
                    links.map((link, index) => (
                        <li key={index} className='item'>
                            {/* <a href = {link.url} > 
                                {link.title}
                            </a> */}
                            <Link to = {link.url} > 
                                {link.title}
                            </Link>
                        </li>
                    ))
                }
            </nav>
        );
    }
}


export default NavBar;
