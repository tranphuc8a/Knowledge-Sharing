
import React from "react";
import ListMyRequest from "./list-my-request";

class ListMyRequestConcrete extends ListMyRequest{
    constructor(props){
        super(props);
        this.state = {

        }
    }

    render(){
        let { style, focus, type } = this.props;
        return (
            <div style={{...style}}>  

            </div>
        );
    }
}

export default ListMyRequestConcrete;

