

import React from "react";
import './text-input.css';
import { AiOutlineUpload as Upload } from "react-icons/ai";
import DomainConfig from "../../config/domain-config";


class UploadIcon extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            isShowUploadIcon: false
        }
    }

    render(){
        let { style } = this.props;
        return <div style={{ width: '100px', height: '100px', backgroundColor: 'rgba(0, 0, 0, 0)', ...style}}
            onMouseEnter={this.mouseEnter} onMouseLeave={this.mouseLeave}
        >
            { this.state.isShowUploadIcon && <Upload style={{ width: '30%', fill: 'violet', backgroundColor: 'rgba(0, 0, 0, 0)'}} /> }
        </div>
    }

    mouseEnter = (event) => {
        this.state.isShowUploadIcon = true;
        this.setState(this.state);
    }

    mouseLeave = (event) => {
        this.state.isShowUploadIcon = false;
        this.setState(this.state);
    }
}

class ImageInput extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            selectedImage: props.src
        }
    }

    shouldComponentUpdate(nextProps, nextState){
        return nextState != this.state;
    }

    render(){
        let { style, onchange } = this.props;
        
        let { selectedImage } = this.state;
        let src = selectedImage ? URL.createObjectURL(selectedImage) : DomainConfig.domain + "/src/assets/knowledge-icon.jpg";

        return (
            <div style={{ width: '150px', height: '150px', borderRadius: '50%', overflow: 'hidden', border: '1px violet solid', ...style}}>  
                <input
                    id="input-lesson-thumbnail"
                    style={{ visibility: 'hidden', width: '0px', height: '0px'}}
                    type="file"
                    name="myImage"
                    onChange={ this.onChange }
                />  
                <label htmlFor="input-lesson-thumbnail" 
                    style={{height: '100%', width: '100%',
                        backgroundImage: 'url(' + src + ')', backgroundSize: '100% 100%' }}
                    onMouseEnter={ this.mouseEnter } onMouseLeave={ this.mouseLeave }
                > 
                    <UploadIcon style={{height: '100%', width: '100%'}} />
                </label>

            </div>
        );
    }

    setSelectedImage = (image) => {
        this.state.selectedImage = image;
        this.setState(this.state);
    }

    onChange = (event) => {
        let image = event.target.files[0];
        this.setSelectedImage(image);

        try {
            if (this.props.onchange){
                this.props.onchange(image);
            }
        } catch (e) {
            throw e;
        }
    }

    
}


export default ImageInput;
