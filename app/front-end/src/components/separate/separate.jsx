
import React from "react";

class Separate extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        let {style } = this.props;
        return (
            <div style={{backgroundColor: 'rgba(255, 0, 255, 0.5)', marginBottom: '12px', height: '2px', borderRadius: '4px', ...style}}></div>
        );
    }
}

export default Separate;

