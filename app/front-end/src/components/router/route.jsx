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
import LessonDetail from "../../pages/lesson/lesson-detail";
import CourseCreate from "../../pages/course/course-create";
import CourseUpdate from "../../pages/course/course-update";
import LessonCreate from "../../pages/lesson/lesson-create";
import LessonUpdate from "../../pages/lesson/lesson-update";
import CoursePayment from "../../pages/course/course-payment";
import CourseManage from "../../pages/course/course-manage";

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

            // LessonDetail
            <Route
                path="/lesson-detail/:lessonid"
                element={<LessonDetail />}
            />

            // Course create
            <Route
                path="/course-create/"
                element={<CourseCreate />}
            />

            // Course update
            <Route
                path="/course-update/:courseid"
                element={<CourseUpdate />}
            />

            // Course payment
            <Route
                path="/course-payment/:courseid"
                element={<CoursePayment />}
            />

            // Course manage
            <Route
                path="/course-manage/:courseid"
                element={<CourseManage />}
            />

            // Lesson Create
            <Route
                path="/lesson-create/"
                element={<LessonCreate />}
            />

            // Lesson Update
            <Route
                path="/lesson-update/:lessonid"
                element={<LessonUpdate />}
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