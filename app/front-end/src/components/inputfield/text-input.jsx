

import React from "react";
import './text-input.css';

class TextInput extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            text: ""
        }
    }

    render(){
        let { style, onchange, value, placeholder, type } = this.props;
        this.state.text = value;

        return <input style={style} placeholder={placeholder} type={ type || "text"} className="text-input" onChange={this.onChange} value={this.state.text}/>;
    }

    onChange = (event) => {
        let text = event.target.value;
        this.setState({
            text: text
        });
        try {
            if (this.props.onchange){
                this.props.onchange(text);
                // console.log(text);
            }
        } catch (e) {
            throw e;
        }
    }
}

export default TextInput;
