import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import autosize from 'autosize';

export default class AutoHeightIframe extends Component {

    constructor() {
        super();
        // this.state = {
        //     iFrameHeight: '0px'
        // }
    }

    componentDidUpdate(){
        autosize(this.iframe);
    }

    render() {
        return (
            <iframe 
                style={{width:'100%', overflow:'visible', ...this.props.style}}
                // onLoad={() => {
                //     const obj = ReactDOM.findDOMNode(this);
                //     this.setState({
                //         "iFrameHeight":  (obj.contentWindow.document.body.scrollHeight + 20) + 'px'
                //     });
                // }} 
                ref={c=>this.textarea=c}
                srcDoc={this.props.srcDoc}
                src={this.props.src} 
                // width="100%" 
                // height={this.state.iFrameHeight} 
                // scrolling="no" 
                // frameBorder="0"
            />
        );
    }
}

