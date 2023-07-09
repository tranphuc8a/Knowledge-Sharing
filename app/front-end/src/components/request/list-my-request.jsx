
import React from "react";
import Toast from "../../utils/toast";
import GetAPI from "../../services/api/get-api";
import Request from "./request";
import Separate from "../separate/separate";
import DomainConfig from "../../config/domain-config";
import Session from "../../session/session";
import withRouter from "../router/withRouter";

class ListMyRequest extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            listRequest: []
        }
    }

    componentDidMount(){
        this.updateListRequest();
    }

    // template method
    render(){
        let { style } = this.props;

        let listRequest = this.state.listRequest;
        let numRequest = listRequest ? listRequest.length : 0;
        return (
            <div>
                <div style={{...style, width: '90%', margin: '36px 0px 12px 0px', flexDirection: 'column'}}>
                    <div style={{justifyContent: 'flex-start', fontSize: '24px', fontWeight: '500', margin: '0px 0px 12px 0px'}}>
                        {numRequest > 0 ? this.getHaveRequest() : this.getNoRequest() }
                            {/* (type == "request" ? "Danh sách yêu cầu" : "Danh sách lời mời") : 
                            (type == "request" ? "Không có yêu cầu" : "Không có lời mời")} */}
                    </div>
                    <Separate />
                    <div style={{ flexWrap: 'wrap', justifyContent: 'flex-start' }}>
                        {
                            listRequest.map((request, index) => {
                                return <div style={{margin: '16px', width: 'auto'}} key={index}> 
                                    <Request updateListRequest={this.updateListRequest} width={150} request={request} focus={"course"} />
                                </div>
                            })
                        }
                    </div>
                </div>
            </div>
            
        );
    }

    // steps
    getType()           { throw new Error("Abstract method"); }
    getHaveRequest()    { throw new Error("Abstract method"); }
    getNoRequest()      { throw new Error("Abstract method"); }

    // template methods
    updateListRequest = async () => {
        // let { email } = this.props;

        try {
            let res = await GetAPI.getInstance()
                .setURL(DomainConfig.domainAPI + "/api/courses/" + this.getType())
                .setToken(Session.getInstance().token)
                .execute();
            if (res.code != 200) throw new Error(res.message);
            this.state.listRequest = res.data;
            this.setState(this.state);
        } catch (e) {
            Toast.getInstance().error(e.message);
        }
    }
}

export default ListMyRequest;

