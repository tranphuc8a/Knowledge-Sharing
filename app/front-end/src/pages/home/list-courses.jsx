import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Separate from '../../components/separate/separate';
import LessonCard from '../../components/lesson/lesson-card';
import GetAPI from '../../services/api/get-api';
import Session from '../../session/session';
import CourseCard from '../../components/course/course-card/course-card';

export default function (props) {

    // let listLesson = this.state.listLesson;
    // let numLesson = listLesson ? listLesson.length : 0;
    const [listLesson, setListLesson] = useState([]);
    const [numLesson, setNumLesson] = useState(0);
    const [isLoading, setIsloading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        try {
            async function fetchAPI() {
                const token = Session.getInstance().token;

                let api = GetAPI.getInstance().setURL("http://localhost:3000/api/search/courses?offset=0&length=100");
                if (token != null && token.length > 0) {
                    api.setToken(token);
                }
                await api.execute()
                    .then(res => {
                        console.log(res);
                        if (res.code == 200) {
                            setListLesson(res.data);
                            setNumLesson(res.data.length);
                        } else {
                            throw new Error(res.message);
                        }

                    });

            }
            setIsloading(true);
            fetchAPI();
        } catch (error) {
            setError(error.message);
        } finally {
            setIsloading(false);
        }
    }, []);


    return (
        <div style={{ margin: '0px 0px 0px 0px', flexDirection: 'column' }}>
            <div style={{ justifyContent: 'space-between', fontSize: '24px', fontWeight: '500', margin: '0px 0px 12px 0px' }}>
                {"Khoá học đề xuất"}
            </div>
            <Separate />
            {
                numLesson <= 0 ? (
                    "Không tìm thấy khoá học"
                ) : (
                    <div style={{ flexDirection: 'column' }} >
                        {listLesson.map((lesson, index) => {
                            return <CourseCard style={{ margin: '12px 0px' }} course={lesson} key={index} />
                        })}
                    </div>
                )
            }
        </div>
    );
}