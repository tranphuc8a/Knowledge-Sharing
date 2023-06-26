
import React from "react";
import Separate from "../../separate/separate";
import { Toast } from "bootstrap";
import GetAPI from "../../../services/api/get-api";
import DomainConfig from "../../../config/domain-config";
import Session from "../../../session/session";
import UserCard from "../../user/user-card";

class ListMember extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            listMember: []
        }
    }

    componentDidMount(){
        this.updateListMember();
    }

    
    render(){
        let {style, course } = this.props;
        let { listMember } = this.state;
        let numMembers = listMember ? listMember.length : 0;
        return (
            <div style={{...style, width: '90%', margin: '0px 0px 72px 0px', flexDirection: 'column'}}> 
                <Separate />
                <div style={{justifyContent: 'flex-start', fontSize: '24px', fontWeight: '500', margin: '0px 0px 36px 0px'}}>
                    {numMembers > 0 ? "Danh sách thành viên" : "Không có thành viên nào"}
                </div>
                <div style={{flexWrap: 'nowrap', justifyContent: 'flex-start'}}>
                    {
                        listMember.map((member, index) => {
                            return <div style={{margin: '16px', width: 'auto'}} key={index}> 
                                <UserCard width={150} user={member} />
                            </div>
                        })
                    }
                </div>
            </div>
        );
    }

    updateListMember = async () => {
        let course = this.props.course;
        try {
            let res = await GetAPI.getInstance()
                .setURL(DomainConfig.domainAPI + "/api/courses/members/" + course.knowledge_id)
                .setToken(Session.getInstance().token)
                .execute();
            if (res.code != 200) throw new Error(res.message);
            this.state.listMember = res.data.data;
            this.setState(this.state);
        } catch (e) {
            Toast.getInstance().error(e.message);
        }
    }
}

export default ListMember;

