

import React from "react";
import './textfield.css';
import autosize from "autosize";

class TextField extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            text: props.value
        }
    }

    componentDidUpdate() {
        // this.textarea.focus();
        autosize(this.textarea);
    }

    shouldComponentUpdate(nextProps, nextState){
        if (nextState != this.state) return true;
        let curProps = {...this.props};
        curProps.value = this.state.text;
        return nextProps != curProps;
    }

    render(){
        let { style, onchange, value, placeholder } = this.props;
        this.state.value = value;

        return <textarea ref={c=>this.textarea=c} style={{...style}} placeholder={placeholder} type="text" className="textfield" onChange={this.onChange} value={this.state.text}/>
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

export default TextField;
