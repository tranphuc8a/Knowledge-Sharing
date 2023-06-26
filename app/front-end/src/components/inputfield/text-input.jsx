

import React from "react";
import './text-input.css';

class TextInput extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            text: props.value
        }
    }

    shouldComponentUpdate(nextProps, nextState){
        if (nextState != this.state) return true;
        let curProps = {...this.props};
        curProps.value = this.state.text;
        return nextProps != curProps;
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
            }
        } catch (e) {
            throw e;
        }
    }
}

export default TextInput;
