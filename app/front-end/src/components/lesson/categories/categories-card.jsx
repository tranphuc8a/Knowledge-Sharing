
import React from "react";
import './categories-card.css';

class CategoriesCard extends React.Component{
    constructor(props){
        super(props);
        this.state = {

        }
    }

    render(){
        let { style, category } = this.props;
        return (
            
            <div className="category-card" style={{...style}}
                onClick={this.clickCategoryCard}
            >  
                { category }
            </div>
        );
    }

    clickCategoryCard = (event) => {
        // navigate màn search với category tương ứng
        
    }
}

export default CategoriesCard;

