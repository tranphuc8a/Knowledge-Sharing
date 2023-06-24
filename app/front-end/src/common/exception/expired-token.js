
class ExpiredToken extends Error{
    constructor(...params){
        super(params);
    }
    
}

export default ExpiredToken;