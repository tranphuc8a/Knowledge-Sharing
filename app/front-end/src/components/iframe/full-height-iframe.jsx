import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'

export default class FullheightIframe extends Component {

    constructor() {
        super();
        this.state = {
            iFrameHeight: '0px'
        }
    }

    render() {
        return (
            <iframe 
                style={{width:'100%', height:this.state.iFrameHeight, overflow:'visible', ...this.props.style}}
                onLoad={() => {
                    const obj = ReactDOM.findDOMNode(this);
                    this.setState({
                        "iFrameHeight":  (obj.contentWindow.document.body.scrollHeight + 20) + 'px'
                    });
                }} 
                ref="iframe" 
                srcDoc={this.props.srcDoc}
                src={this.props.src} 
                width="100%" 
                height={this.state.iFrameHeight} 
                scrolling="no" 
                frameBorder="0"
            />
        );
    }
}