import withRouter from "../router/withRouter";
import ListRequestCourse from "./list-request-course";

class ListRequestCourseConcrete extends ListRequestCourse{
    constructor(props){
        super(props);
    }

    // override steps
    getType()           { return "request"; }
    getHaveRequest()    { return "Danh sách yêu cầu"; }
    getNoRequest()      { return "Không có yêu cầu nào"; }
}

export default withRouter(ListRequestCourseConcrete);

