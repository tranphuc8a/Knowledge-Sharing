
import React from "react";
import { Navigate } from "react-router-dom";
import withRouter from "../router/withRouter";
import MyRoute from "../router/route";
import DomainConfig from "../../config/domain-config";

class Logo extends React.Component{
    constructor(props){
        super(props);
        this.state = {};
    }

    clickLogo = (event) => {
        this.props.router.navigate('/');
    }
    
    render(){

        let {width, height} = this.props;
        if (!width) width = 'auto';
        if (!height) height = 'auto';

        return (
            <div onClick={this.clickLogo} style={this.props.style}>
                <img 
                    src={ DomainConfig.domain + "/src/assets/logo.png" }
                    alt="logo" 
                    style={{
                        width: width,
                        height: height
                    }} 
                />
            </div>
        );
    }
}

export default withRouter(Logo);

