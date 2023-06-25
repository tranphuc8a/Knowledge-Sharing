
import React from "react";
import ScoreBanner from "./score/score-banner";
import ListComment from "./comment/list-comment";

class Discussion extends React.Component{
    constructor(props){
        super(props);

    }

    render(){
        let {style, knowledge, updateKnowledge } = this.props;
        return (
            <div style={{...style, width: '90%', margin: '0px 0px 72px 0px', flexDirection: 'column'}}>
                <ScoreBanner knowledge={knowledge} updateKnowledge={updateKnowledge} />
                <ListComment knowledge={knowledge} />
            </div>
            
        );
    }
}

export default Discussion;

