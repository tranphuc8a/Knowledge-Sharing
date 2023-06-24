
class ExpiredRefreshToken extends Error{
    constructor(...params){
        super(params);
    }
    
}

export default ExpiredRefreshToken;
