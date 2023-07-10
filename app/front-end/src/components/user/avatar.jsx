
import React from "react";

class Avatar extends React.Component{
    constructor(props){
        super(props);
        this.state = {

        }
    }

    render(){
        let {style , src, alt , onclick} = this.props;
        return (
            <div style={{borderRadius: '50%', border: 'solid violet 1px', overflow: 'hidden', width: '50px', height: '50px', cursor: onclick ? 'pointer' : '', ...style,}} 
                onClick={ this.onClick }
            >
                <img src={src} alt={alt} style={{height: '100%', width: '100%'}} />
            </div>
        );
    }

    onClick = (event) => {
        try {
            let onclick = this.props.onclick;
            if (onclick) onclick(event);
        } catch (e) {
            console.log(e);
        }
    }
}

export default Avatar;

