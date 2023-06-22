import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import './root-style.css';
import CourseDetail from "../../pages/course-detail";
import Home from "../../pages/home";

class MyRoute extends React.Component{

    render(){
        return ( <Router> <Routes style={{color: 'black'}}>
            
            // Màn mặc định của app
            <Route exact 
                path="/" 
                element={<Home />} 
            />

            // Màn trang chủ
            <Route 
                path="/home"  
                element={<Home />} 
            />

            // CourseDetail
            <Route
                path = "/course-detail"
                element = { <CourseDetail />}
            />

        </Routes> </Router> );
    }
}


export default MyRoute;