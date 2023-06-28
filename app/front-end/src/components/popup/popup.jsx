

import React from "react";

class Popup extends React.Component{
    constructor(props){
        super(props);
        this.state = {}
    }

    render(){
        let {children, style} = this.props;
        return (
            <div className="popup" style={{position: 'fixed', width: '100vw', height: '100vh', top: 0, left: 0, zIndex: 10000, backgroundColor: 'rgb(99, 0, 99, 0.75)', ...style}}>
                {children}
            </div>
        );
    }

}

export default Popup;

