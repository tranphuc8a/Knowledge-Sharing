

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
        let { style, onchange, value } = this.props;
        this.state.text = value;

        return <div style={{...style}}>
            <textarea type="text" className="textfield" onChange={this.onChange} value={this.state.text}/>
        </div>
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
