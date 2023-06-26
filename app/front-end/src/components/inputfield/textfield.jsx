

import React from "react";
import './textfield.css';

class TextField extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            text: ""
        }
    }

    render(){
        let { style, onchange, value, placeholder } = this.props;
        this.state.text = value;

        return <textarea style={{...style}} placeholder={placeholder} type="text" className="textfield" onChange={this.onChange} value={this.state.text}/>
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

export default TextField;
