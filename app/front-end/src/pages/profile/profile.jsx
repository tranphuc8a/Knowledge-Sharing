import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './profile.module.scss';
import Intro from './intro';
import GetAPI from '../../services/api/get-api';
import ListCourse from '../../components/course/list-course/list-course';
import ListUserLesson from '../../components/lesson/list-user-lesson/list-user-lesson';
import ListMyRequestConcrete from '../../components/request/list-my-request-concrete';
import ListMyInviteConcrete from '../../components/request/list-my-invite-concrete';
import ListLearningCourse from '../../components/course/list-learning-course/list-learning-course';
import Spinner from 'react-bootstrap/Spinner';
import PostAPI from '../../services/api/post-api';
import PopupConfirm from '../../components/popup/popup-confirm/popup-confirm';
import DeleteAPI from '../../services/api/delete-api';
import PutAPI from '../../services/api/put-api';
import { useLocation, useNavigate } from 'react-router-dom';
import Session from '../../session/session';
import ListFollow from '../list-follow/list-follow';
import ListMyMark from '../../components/discussion/mark/list-my-mark';


export default function (props) {
    // get email from url params
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get('email');

    // for navigating
    const navigate = useNavigate();

    const [profile, setProfile] = useState({});
    const [isLoading, setIsloading] = useState(false);
    const [error, setError] = useState(''); // errors come
    const [isShowPopupConfirm, setIsShowPopupConfirm] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null); // change avatar

    // get profile
    useEffect(() => {
        try {
            const token = Session.getInstance().token;
            async function fetchAPI() {
                // call get profile api
                await GetAPI.getInstance().setURL("http://localhost:3000/api/profile/" + email)
                    .setToken(token)
                    .execute()
                    .then(res => {
                        console.log(res);
                        if (res.data == null) { // navigate if email doesn't exist
                            if (Session.getInstance().mainUser.email != null) {
                                window.location.href = '/profile?email=' + encodeURIComponent(Session.getInstance().mainUser.email);

                            }
                            else {
                                window.location.href = '/home';
                            }
                        } else {
                            setProfile(res.data);
                        }

                    });
            }
            fetchAPI();
        } catch (error) {
            setError(error.message);
        } finally {

        }
    }, [location.search]);

    const handleEmpty = () => {

    }

    // add follow click
    const handleFollow = async () => {
        try {
            // loading...
            setIsloading(true);

            // check token
            const token = Session.getInstance().token;

            if (token == null || token == "") {
                throw new Error("Bạn chưa đăng nhập");
            }

            // temporily wait 2 seconds for developing
            await new Promise((resolve) => setTimeout(resolve, 2000));

            await PostAPI.getInstance().setURL("http://localhost:3000/api/follow")
                .setToken(token)
                .setData({ followedEmail: email })
                .execute()
                .then(res => {
                    console.log(res);
                    if (res.code == 200) { // success
                        // update button
                        if (profile.relation == "UNKNOWN")
                            setProfile(prevProfile => ({
                                ...prevProfile,
                                relation: "FOLLOWING"
                            }));
                        else if (profile.relation == "FOLLOWED")
                            setProfile(prevProfile => ({
                                ...prevProfile,
                                relation: "BOTH"
                            }));
                    } else if (res.code == 400 || res.code == 404) { // bad request
                        throw new Error(res.message);
                    } else {
                        throw new Error("Server đang gặp lỗi");
                    }
                });

        } catch (error) {
            setError(error.message);
        } finally {
            // cancel loading...
            setIsloading(false);
        }
    }

    // un follow click
    const handleUnfollow = async () => {
        try {
            // loading...
            setIsloading(true);

            // check token
            const token = Session.getInstance().token;

            if (token == null || token == "") {
                throw new Error("Bạn chưa đăng nhập");
            }

            // temporily wait 2 seconds for developing
            await new Promise((resolve) => setTimeout(resolve, 2000));

            await DeleteAPI.getInstance().setURL("http://localhost:3000/api/follow")
                .setToken(token)
                .setData({ followedEmail: email })
                .execute()
                .then(res => {
                    console.log(res);
                    if (res.code == 200) { // success
                        // update button
                        if (profile.relation == "FOLLOWING")
                            setProfile(prevProfile => ({
                                ...prevProfile,
                                relation: "UNKNOWN"
                            }));
                        else if (profile.relation == "BOTH")
                            setProfile(prevProfile => ({
                                ...prevProfile,
                                relation: "FOLLOWED"
                            }));
                    } else if (res.code == 400 || res.code == 404) { // bad request
                        throw new Error(res.message);
                    } else {
                        throw new Error("Server đang gặp lỗi");
                    }
                    unShowPopupConfirm();
                });

        } catch (error) {
            setError(error.message);
        } finally {
            // cancel loading...
            setIsloading(false);
        }
    }

    const showPopupConfirm = () => {
        setIsShowPopupConfirm(true);
    }

    const unShowPopupConfirm = () => {
        setIsShowPopupConfirm(false);
    }


    // for image changing
    const inputFileRef = useRef(null);

    const handleChooseImage = () => {
        inputFileRef.current.click();
    };

    const handleImageChange = async (event) => {
        try {
            setIsloading(true);

            // check token
            const token = Session.getInstance().token;

            if (token == null || token == "") {
                throw new Error("Bạn chưa đăng nhập");
            }

            const image = event.target.files[0];
            setSelectedImage(URL.createObjectURL(image));

            // call api post image
            if (image) {
                let postImage = await PostAPI.getInstance().postImage(image);
                console.log(postImage);
                // update profile
                if (postImage.code == 200) {
                    await PutAPI.getInstance().setURL("http://localhost:3000/api/profile")
                        .setToken(token)
                        .setData({ avatar: postImage.data.url })
                        .execute()
                        .then(res => {
                            console.log(res);
                            if (res.code == 200) { // success

                            } else if (res.code == 400 || res.code == 404) { // bad request
                                throw new Error(res.message);
                            } else {
                                throw new Error("Server đang gặp lỗi");
                            }
                        });
                }
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setIsloading(false);
        }
    };


    return (
        <div className="justify-content-center align-items-center h-100">
            <div className="flex-column">
                {/* header */}
                <div
                    className="rounded-top text-white d-flex flex-row justify-content-start"
                    style={{ backgroundColor: "rgba(80, 0, 100, 1)", height: 250 }}
                >
                    {/* avatar and button edit */}
                    <div
                        className="ms-4 flex-column bg-transparent w-auto"
                    >
                        {
                            (selectedImage == null) ?
                                (<img
                                    src={(profile.avatar) ? profile.avatar : "/src/assets/null_user.png"}
                                    alt="Generic placeholder image"
                                    className="img-fluid img-thumbnail m-0 rounded-circle border border-dark"
                                    style={{ width: 150, zIndex: 1 }}
                                />) :
                                (
                                    <img
                                        src={selectedImage}
                                        alt="Generic placeholder image"
                                        className="img-fluid img-thumbnail m-0 rounded-circle border border-dark"
                                        style={{ width: 150, zIndex: 1 }}
                                    />
                                )
                        }

                        {/* for choosing image */}
                        <div>
                            <input
                                type="file"
                                ref={inputFileRef}
                                accept="image/*"
                                onChange={handleImageChange}
                                style={{ display: 'none' }}
                            />
                        </div>


                        {
                            isLoading ? (
                                <Spinner className='bg-transparent mt-2 text-light' animation="border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </Spinner>

                            ) : (
                                <button
                                    type="button"
                                    className={`btn btn-light btn-outline-secondary mt-2 d-flex w-150 ${styles['btn']}`}
                                    data-mdb-ripple-color="dark"
                                    style={{ zIndex: 1, fontFamily: 'Montserrat', fontSize: '18px', fontWeight: 'bold' }}
                                    onClick={
                                        profile.relation == 'ME' ? handleChooseImage :
                                            profile.relation == 'FOLLOWING' ? showPopupConfirm :
                                                profile.relation == 'FOLLOWED' ? handleFollow :
                                                    profile.relation == 'BOTH' ? showPopupConfirm :
                                                        handleFollow
                                    }
                                >
                                    <img
                                        src={profile.relation == 'ME' ? "/src/assets/ic_update.png" :
                                            profile.relation == 'FOLLOWING' ? "/src/assets/ic_following.png" :
                                                profile.relation == 'FOLLOWED' ? "/src/assets/ic_followed.png" :
                                                    profile.relation == 'BOTH' ? "/src/assets/ic_follow_each_other.png" :
                                                        "/src/assets/ic_add_follow.png"}
                                        className={`me-1 bg-transparent ${styles['follow-icon']}`}
                                        alt="Follow Icon"
                                        style={{ width: '18px', height: '18px' }}
                                    />
                                    {profile.relation == 'ME' ? "Thay avatar " :
                                        profile.relation == 'FOLLOWING' ? "Đang theo dõi " :
                                            profile.relation == 'FOLLOWED' ? "Theo dõi lại " :
                                                profile.relation == 'BOTH' ? "Theo dõi nhau " :
                                                    "Theo dõi "}
                                </button>
                            )
                        }

                        {/* pop up confirm will show when unfollowing */}
                        {
                            isShowPopupConfirm ?
                                (<PopupConfirm
                                    title="Huỷ follow?"
                                    content={`Bạn có chắc chắn muốn huỷ follow với ${profile.name}?`}
                                    isShow={isShowPopupConfirm}
                                    actionCancel={unShowPopupConfirm}
                                    actionOk={handleUnfollow}>
                                </PopupConfirm>) :
                                ""
                        }

                        {/* error text */}
                        {error && <p className={`error-message text-danger my-2 bg-transparent`} style={{ fontSize: 16 }}>{error}</p>}

                    </div>

                    {/* name and email */}
                    <div className="ms-4 flex-column w-auto bg-transparent">
                        <h5 className="bg-transparent text-white fw-bold justify-content-start" style={{ fontSize: '32px', fontFamily: 'Roboto' }}>
                            {profile.name}
                        </h5>
                        <p className="bg-transparent text-white fw-bold justify-content-start" style={{ fontSize: '24px', fontFamily: 'Roboto' }}>
                            {profile.email}
                        </p>
                    </div>

                </div>

                {/* body */}
                <div className='flex-column mx-2 mt-1'>
                    {/* navbar */}
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

                        {profile.relation == "ME" ? <li className="nav-item w-auto" role="presentation">
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
                        </li> : null}

                        {profile.relation == "ME" ? <li className="nav-item w-auto" role="presentation">
                            <button
                                className={`nav-link ${styles['nav-link']}`}
                                id="pills-request-tab"
                                data-bs-toggle="pill"
                                data-bs-target="#pills-request"
                                type="button"
                                role="tab"
                                aria-controls="pills-request"
                                aria-selected="false"
                                disabled=""
                            >
                                Yêu cầu
                            </button>
                        </li> : null}

                        {profile.relation == "ME" ? <li className="nav-item w-auto" role="presentation">
                            <button
                                className={`nav-link ${styles['nav-link']}`}
                                id="pills-invite-tab"
                                data-bs-toggle="pill"
                                data-bs-target="#pills-invite"
                                type="button"
                                role="tab"
                                aria-controls="pills-invite"
                                aria-selected="false"
                                disabled=""
                            >
                                Lời mời
                            </button>
                        </li> : null}

                        {profile.relation == "ME" ? <li className="nav-item w-auto" role="presentation">
                            <button
                                className={`nav-link ${styles['nav-link']}`}
                                id="pills-learning-tab"
                                data-bs-toggle="pill"
                                data-bs-target="#pills-learning"
                                type="button"
                                role="tab"
                                aria-controls="pills-learning"
                                aria-selected="false"
                                disabled=""
                            >
                                Đang học
                            </button>
                        </li> : null}
                    </ul>

                    {/* content */}
                    <div className={`tab-content ${styles['tab-content']}`} id="pills-tabContent">
                        <div
                            className="tab-pane fade show active"
                            id="pills-intro"
                            role="tabpanel"
                            aria-labelledby="pills-intro-tab"
                            tabIndex={0}
                        >
                            {/* Intro tab */}
                            <Intro profile={{ ...profile, email: email }}>

                            </Intro>
                        </div>
                        <div
                            className="tab-pane fade"
                            id="pills-courses"
                            role="tabpanel"
                            aria-labelledby="pills-courses-tab"
                            tabIndex={0}
                        >
                            <ListCourse email={email} />
                        </div>
                        <div
                            className="tab-pane fade"
                            id="pills-lessons"
                            role="tabpanel"
                            aria-labelledby="pills-lessons-tab"
                            tabIndex={0}
                        >
                            <ListUserLesson email={email} />
                        </div>
                        <div
                            className="tab-pane fade"
                            id="pills-followed"
                            role="tabpanel"
                            aria-labelledby="pills-followed-tab"
                            tabIndex={0}
                        >
                            <ListFollow email={email} type={1}>

                            </ListFollow>
                        </div>
                        <div
                            className="tab-pane fade"
                            id="pills-following"
                            role="tabpanel"
                            aria-labelledby="pills-following-tab"
                            tabIndex={0}
                        >
                            <ListFollow email={email} type={0}>

                            </ListFollow>
                        </div>
                        <div
                            className="tab-pane fade"
                            id="pills-mark"
                            role="tabpanel"
                            aria-labelledby="pills-mark-tab"
                            tabIndex={0}
                        >
                            <ListMyMark />
                        </div>
                        <div
                            className="tab-pane fade"
                            id="pills-request"
                            role="tabpanel"
                            aria-labelledby="pills-request-tab"
                            tabIndex={0}
                        >
                            <ListMyRequestConcrete email={email} />
                        </div>
                        <div
                            className="tab-pane fade"
                            id="pills-invite"
                            role="tabpanel"
                            aria-labelledby="pills-invite-tab"
                            tabIndex={0}
                        >
                            <ListMyInviteConcrete email={email} />
                        </div>

                        <div
                            className="tab-pane fade"
                            id="pills-learning"
                            role="tabpanel"
                            aria-labelledby="pills-learning-tab"
                            tabIndex={0}
                        >
                            <ListLearningCourse email={email} />
                        </div>
                    </div>
                </div>

            </div>
        </div >

    );
}