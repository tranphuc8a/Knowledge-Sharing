

import React from "react";
import DomainConfig from "../../../config/domain-config";
// import './comment-card.css';


class Comment extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            mark: props.comment
        }
    }

    render(){     
        let {comment, style} = this.props;
        this.formatcomment(comment);
        return (
            <div className="comment-card" 
                style={{...style, 
                    flexDirection:'row', 
                    alignItems:'flex-start', 
                    justifyContent:'flex-start',
                    borderRadius: '6px',
                    boxShadow: '0px 0px 5px 0px rgba(0, 0, 0, 0.6)',
                    padding: '24px 36px',
                    cursor: 'pointer',
                    }}
                onClick={this.clickCourse}>
                <div className="leson-thumbnail" style={{width: '75px', justifyContent:'flex-start', borderRadius: '4px'}}>
                    <img src={comment.thumbnail} alt={comment.title} />
                </div>
                <div className="comment-info" style={{
                    justifyContent: 'space-between', 
                    flexDirection:'row',
                    marginLeft: '16px',
                    alignItems: 'center',
                    height: '100%'
                }}>
                    <div className="li-info" style={{ 
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <div style={{
                            justifyContent: 'flex-start',
                            fontSize: '20px',
                            fontWeight: '500'
                        }}>
                            {comment.title}
                        </div>
                        <div className="comment-author" 
                            style={{justifyContent: 'flex-start', cursor: 'pointer'}} >
                            {comment.name}
                        </div>
                    </div>
                    <div className="li-mark" style={{width: 'auto', height: '100%'}}>
                        {this.getSave()}
                    </div>
                </div>
            </div>
        );
    }

    getSave(){
        if (this.state.mark){
            return <img onClick={this.save} src={DomainConfig.domain + "/src/assets/unsave.png"} 
                style={{width: '45px'}}
            />
        } else {
            return <img onClick={this.unsave} src={DomainConfig.domain + "/src/assets/save.png"} 
                style={{width: '45px'}}
            />
        }
    }

    formatcomment = (comment) => {
        comment.thumbnail = comment.thumbnail || DomainConfig.domain + "/src/assets/knowledge-icon.jpg"
        comment.ismark = comment.ismark || 0;
        return comment;
    }

}

export default Comment;

