import ListRequestCourse from "./list-request-course";


class ListInviteCourseConcrete extends ListRequestCourse{
    constructor(props){
        super(props);
    }

    // override steps
    getType()           { return "invite"; }
    getHaveRequest()    { return "Danh sách lời mời"; }
    getNoRequest()      { return "Không có lời mời nào"; }
}

export default ListInviteCourseConcrete;

