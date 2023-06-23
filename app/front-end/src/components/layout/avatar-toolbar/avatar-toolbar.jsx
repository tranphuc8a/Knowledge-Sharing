
import React from "react";

class AvatarToolbar extends React.Component{
    constructor(props){
        super(props);
        let { announce, user } = props;
        this.state = {
            avatar: "./src/assets/null_user.png"
        };
    }

    render(){
        return(
            <div style={{...this.props.style, padding: '0px 18px'}}>
                <div className="announce" style={{ padding: '0px 12px' }}>
                    <div onClick={this.clickBell}
                        style={{ cursor: 'pointer', borderRadius: '50%', width: '30px', height: '30px', overflow: 'hidden'}}>
                        <img src="./src/assets/bell_icon.png" alt="Announce"
                            style={{height: '30px', width: 'auto'}} />
                    </div>
                </div>
                <div className="avatar" style={{padding: '0px 12px'}}>
                    <div onClick={this.clickAvatar}
                        style={{ cursor: 'pointer', borderRadius: '50%', width: '45px', height: '45px', overflow: 'hidden', border: 'solid violet 1px'}}>
                        <img src={this.state.avatar} alt="Avatar"
                                style={{height: '30px', width: 'auto'}} />
                    </div>
                </div>
            </div>
        );
    }

    clickAvatar = (event) => {

    }

    clickBell = (event) => {
        
    }
}

export default AvatarToolbar;
