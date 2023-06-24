import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import './root-style.css';
import CourseDetail from "../../pages/course/course-detail";
import Home from "../../pages/home/home";

class MyRoute extends React.Component{
    static domain = "http://localhost:3001";
    static domainAPI = "http://localhost:3000";
    static token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InBodWN0dkBnbWFpbC5jb20iLCJpYXQiOjE2ODc1MDUwMjksImV4cCI6MTY4ODM2OTAyOX0.3c6oK1hOsgaC-5IBL1J-_KUje2yEapl6OBPHYafgaEU";

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
                path = "/course-detail/:courseid"
                element = { <CourseDetail />}
            />

        </Routes> </Router> );
    }
}


export default MyRoute;