

import React from "react";
import DomainConfig from "../../../config/domain-config";

class Banner extends React.Component{
    constructor(props){
        super(props);
        this.state = {

        }
    }

    render(){
        let {style, className } = this.props;
        return (
            <div className={className}
                style={{
                    background: "url('" + DomainConfig.domain + "/src/assets/course-bg.png') center center/cover",
                    height: '33vw',
                    ...style
                }} 
            >
                <div style={{ backgroundColor: 'rgba(50, 0, 50, 0.75)', height: '100%' }}>
                </div>
            </div>
        );
    }
}

export default Banner;




