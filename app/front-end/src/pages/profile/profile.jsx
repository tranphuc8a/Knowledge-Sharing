import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './profile.module.scss';
import Intro from './intro';


export default function (props) {


    return (
        <div className="justify-content-center align-items-center h-100">
            <div className="flex-column">
                <div
                    className="rounded-top text-white d-flex flex-row justify-content-start"
                    style={{ backgroundColor: "violet", height: 250 }}
                >
                    {/* avatar and button edit */}
                    <div
                        className="ms-4 flex-column bg-transparent w-auto"
                    >
                        <img
                            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-1.webp"
                            alt="Generic placeholder image"
                            className="img-fluid img-thumbnail m-0 rounded-circle border border-dark"
                            style={{ width: 150, zIndex: 1 }}
                        />
                        <button
                            type="button"
                            className={`btn btn-light btn-outline-secondary mt-2 d-flex w-150 ${styles['btn']} text-black`}
                            data-mdb-ripple-color="dark"
                            style={{ zIndex: 1, fontFamily: 'Montserrat', fontSize: '18px', fontWeight: 'bold' }}
                        >
                            <img
                                src="/src/assets/ic_add_follow.png"
                                className={`me-1 bg-transparent ${styles['follow-icon']}`}
                                alt="Follow Icon"
                                style={{ width: '18px', height: '18px' }}
                            />
                            Theo dõi&nbsp;
                        </button>
                    </div>

                    {/* name and email */}
                    <div className="ms-4 flex-column w-auto bg-transparent">
                        <h5 className="bg-transparent text-white fw-bold justify-content-start" style={{ fontSize: '32px', fontFamily: 'Roboto' }}>Họ và tên</h5>
                        <p className="bg-transparent text-white fw-bold justify-content-start" style={{ fontSize: '24px', fontFamily: 'Roboto' }}>defaultemail@gmail.com</p>
                    </div>

                </div>

                {/* body */}
                <div className='flex-column mx-2 mt-1'>
                    <ul className={`d-flex flex-row justify-content-start nav nav-pills mb-3 w-100 ${styles['nav-pills']}`} id="pills-tab" role="tablist">
                        <li className="nav-item w-auto" role="presentation">
                            <button
                                className={`nav-link active ${styles['nav-link']}`}
                                id="pills-intro-tab"
                                data-bs-toggle="pill"
                                data-bs-target="#pills-intro"
                                type="button"
                                role="tab"
                                aria-controls="pills-intro"
                                aria-selected="true"
                            >
                                Giới thiệu
                            </button>
                        </li>
                        <li className="nav-item w-auto" role="presentation">
                            <button
                                className={`nav-link ${styles['nav-link']}`}
                                id="pills-courses-tab"
                                data-bs-toggle="pill"
                                data-bs-target="#pills-courses"
                                type="button"
                                role="tab"
                                aria-controls="pills-courses"
                                aria-selected="false"
                            >
                                Khoá học
                            </button>
                        </li>
                        <li className="nav-item w-auto" role="presentation">
                            <button
                                className={`nav-link ${styles['nav-link']}`}
                                id="pills-lessons-tab"
                                data-bs-toggle="pill"
                                data-bs-target="#pills-lessons"
                                type="button"
                                role="tab"
                                aria-controls="pills-lessons"
                                aria-selected="false"
                            >
                                Bài học
                            </button>
                        </li>
                        <li className="nav-item w-auto" role="presentation">
                            <button
                                className={`nav-link ${styles['nav-link']}`}
                                id="pills-followed-tab"
                                data-bs-toggle="pill"
                                data-bs-target="#pills-followed"
                                type="button"
                                role="tab"
                                aria-controls="pills-followed"
                                aria-selected="false"
                                disabled=""
                            >
                                Người theo dõi
                            </button>
                        </li>

                        <li className="nav-item w-auto" role="presentation">
                            <button
                                className={`nav-link ${styles['nav-link']}`}
                                id="pills-following-tab"
                                data-bs-toggle="pill"
                                data-bs-target="#pills-following"
                                type="button"
                                role="tab"
                                aria-controls="pills-following"
                                aria-selected="false"
                                disabled=""
                            >
                                Đang theo dõi
                            </button>
                        </li>

                        <li className="nav-item w-auto" role="presentation">
                            <button
                                className={`nav-link ${styles['nav-link']}`}
                                id="pills-mark-tab"
                                data-bs-toggle="pill"
                                data-bs-target="#pills-mark"
                                type="button"
                                role="tab"
                                aria-controls="pills-mark"
                                aria-selected="false"
                                disabled=""
                            >
                                Đánh dấu
                            </button>
                        </li>
                    </ul>

                    {/* content */}
                    <div className="tab-content" id="pills-tabContent">
                        <div
                            className="tab-pane fade show active"
                            id="pills-intro"
                            role="tabpanel"
                            aria-labelledby="pills-intro-tab"
                            tabIndex={0}
                        >
                            {/* Intro tab */}
                            <Intro>

                            </Intro>
                        </div>
                        <div
                            className="tab-pane fade"
                            id="pills-courses"
                            role="tabpanel"
                            aria-labelledby="pills-courses-tab"
                            tabIndex={0}
                        >
                            Courses
                        </div>
                        <div
                            className="tab-pane fade"
                            id="pills-lessons"
                            role="tabpanel"
                            aria-labelledby="pills-lessons-tab"
                            tabIndex={0}
                        >
                            Lessons
                        </div>
                        <div
                            className="tab-pane fade"
                            id="pills-followed"
                            role="tabpanel"
                            aria-labelledby="pills-followed-tab"
                            tabIndex={0}
                        >
                            Followed
                        </div>
                        <div
                            className="tab-pane fade"
                            id="pills-following"
                            role="tabpanel"
                            aria-labelledby="pills-following-tab"
                            tabIndex={0}
                        >
                            Following
                        </div>
                        <div
                            className="tab-pane fade"
                            id="pills-mark"
                            role="tabpanel"
                            aria-labelledby="pills-mark-tab"
                            tabIndex={0}
                        >
                            Mark
                        </div>
                    </div>
                </div>



            </div>
        </div >

    );
}