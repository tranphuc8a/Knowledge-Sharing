

import React from "react";
import './dropdown-menu.css';

class DropdownMenu extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            value: null
        }
    }

    render(){
        let { style, onchange, value, listOptions } = this.props;
        this.state.value = value;

        return <select className="dropdownMenu" style={{ ...style}} value={this.state.value} onChange={this.onChange}>
            { listOptions && (
                listOptions.map((option, index) => {
                    return <option className="dropdownOption" key={index} value={option.value}>
                        {option.title}
                    </option>
                })
            )}
        </select>
    }

    onChange = (event) => {
        let value = event.target.value;
        this.setState({
            value: value
        });
        try {
            if (this.props.onchange){
                this.props.onchange(value);
                // console.log(value);
            }
        } catch (e) {
            throw e;
        }
    }
}

export default DropdownMenu;
