
import React from "react";
import MyRoute from "../../router/route";
import Session from "../../../session/session";
import DomainConfig from "../../../config/domain-config";
import withRouter from "../../router/withRouter";

class AvatarToolbar extends React.Component {
    constructor(props) {
        super(props);
        Session.getInstance().attach(this);
        this.state = {
            user: {
                avatar: DomainConfig.domain + "/src/assets/null_user.png"
            }
        };
    }

    render() {
        this.formatUser(this.state.user);
        return (
            <div style={{ ...this.props.style, padding: '0px 18px' }}>
                <div className="announce" style={{ padding: '0px 12px' }}>
                    <div onClick={this.clickBell}
                        style={{ cursor: 'pointer', borderRadius: '50%', width: '30px', height: '30px', overflow: 'hidden' }}>
                        <img src={DomainConfig.domain + "/src/assets/bell_icon.png"} alt="Announce"
                            style={{ height: '30px', width: 'auto' }} />
                    </div>
                </div>
                <div className="avatar" style={{ padding: '0px 12px' }}>
                    <div onClick={this.clickAvatar}
                        style={{ cursor: 'pointer', borderRadius: '50%', width: '45px', height: '45px', overflow: 'hidden', border: 'solid violet 1px' }}>
                        <img src={this.state.user.avatar} alt="Avatar"
                            style={{ height: '30px', width: 'auto' }} />
                    </div>
                </div>
            </div>
        );
    }

    updateSession = () => {
        this.setState({
            user: Session.getInstance().mainUser
        });
    }

    clickAvatar = (event) => {
        this.props.router.navigate('/profile?email=' + Session.getInstance().mainUser.email);
    }

    clickBell = (event) => {

    }

    formatUser = (user) => {
        user.avatar = user.avatar || DomainConfig.domain + "/src/assets/null_user.png";

        return user;
    }
}

export default withRouter(AvatarToolbar);
