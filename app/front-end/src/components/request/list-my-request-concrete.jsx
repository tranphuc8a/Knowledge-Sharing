import ListMyRequest from './list-my-request';

class ListMyRequestConcrete extends ListMyRequest{
    constructor(props){
        super(props);
    }

    // override steps
    getType()           { return "request"; }
    getHaveRequest()    { return "Danh sách yêu cầu của bạn"; }
    getNoRequest()      { return "Bạn chưa gửi yêu cầu nào"; }
}

export default ListMyRequestConcrete;

