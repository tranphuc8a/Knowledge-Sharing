

import React from "react";

class CourseCard extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            course: null
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

export default CourseCard;


