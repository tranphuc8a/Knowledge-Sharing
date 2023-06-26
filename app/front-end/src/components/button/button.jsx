

import React from "react";
import { Component } from "react";
import './button.css';


class Button extends Component{
    constructor(props){
        super(props);
        this.state = {}
    }

    render(){
        let {style, text, onclick, className} = this.props;
        return (
            <div className={"button " + className} style={{
                ...style
            }} onClick={onclick}>
                {text}
            </div>
        );
    }
}

export default Button;
