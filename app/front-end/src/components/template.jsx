
import React from "react";

class Template extends React.Component{
    constructor(props){
        super(props);
        this.state = {

        }
    }

    render(){
        let {style } = this.props;
        return (
            <div style={{...style}}>  

            </div>
        );
    }
}

export default Template;

