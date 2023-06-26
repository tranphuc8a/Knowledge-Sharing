import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "../../App";
import Login from "../../pages/login";
// import './root-style.css';
import Register from "../../pages/register";
import CourseDetail from "../../pages/course/course-detail";
import Home from "../../pages/home/home";
import Toast from "../../utils/toast";
import Profile from "../../pages/profile";

class MyRoute extends React.Component {

    render() {
        return this.getRoute();
    }

    getRoute = () => {
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
                path="/course-detail/:courseid"
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

            <Route
                path="/profile"
                element={<Profile />}
            />

        </Routes> </Router>);
    }
}


export default MyRoute;