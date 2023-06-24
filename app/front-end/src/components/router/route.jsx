import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "../../App";
import Login from "../../pages/login";
// import './root-style.css';
import CourseDetail from "../../pages/course-detail";
import Home from "../../pages/home";
import Register from "../../pages/register";

class MyRoute extends React.Component {

    render() {
        return (<Router> <Routes style={{ color: 'black' }}>

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
                path="/course-detail"
                element={<CourseDetail />}
            />

            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/register"
                element={<Register />}
            />

        </Routes> </Router>);
    }
}


export default MyRoute;