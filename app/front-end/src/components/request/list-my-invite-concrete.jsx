import ListMyRequest from './list-my-request';

class ListInviteCourseConcrete extends ListMyRequest{
    constructor(props){
        super(props);
    }

    // override steps
    getType()           { return "invite"; }
    getHaveRequest()    { return "Danh sách lời mời gửi tới bạn"; }
    getNoRequest()      { return "Bạn chưa nhận được lời mời nào"; }
}

export default ListInviteCourseConcrete;

