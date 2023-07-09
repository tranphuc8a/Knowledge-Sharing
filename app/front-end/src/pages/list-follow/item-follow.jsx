import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './item-follow.module.scss';
import { useNavigate } from 'react-router-dom';
import PopupConfirm from '../../components/popup/popup-confirm/popup-confirm';
import { Spinner } from 'react-bootstrap';
import PostAPI from '../../services/api/post-api';
import DeleteAPI from '../../services/api/delete-api';
import Session from '../../session/session';

export default function (props) {

    // for navigating
    const navigate = useNavigate();

    const [profile, setProfile] = useState(props.data);
    const [isLoading, setIsloading] = useState(false);
    const [error, setError] = useState(''); // errors come
    const [isShowPopupConfirm, setIsShowPopupConfirm] = useState(false);

    const handleEmpty = (event) => {
    }

    // add follow click
    const handleFollow = async (event) => {
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
                .setData({ followedEmail: profile.email })
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
    const handleUnfollow = async (event) => {
        try {
            // event.stopPropagation();
            setIsShowPopupConfirm(false);
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
                .setData({ followedEmail: profile.email })
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

                });

        } catch (error) {
            setError(error.message);
        } finally {
            // cancel loading...
            setIsloading(false);
        }
    }

    const showPopupConfirm = (event) => {
        // event.stopPropagation();
        setIsShowPopupConfirm(true);
    }

    const unShowPopupConfirm = (event) => {
        event.stopPropagation();
        setIsShowPopupConfirm(false);
    }


    return (
        <div
            className={`justify-content-start my-2 ${styles['container']} rounded`}
            onClick={() => {
                window.location.href = "/profile?email=" + profile.email;
            }}
        >
            <img
                src={(profile.avatar) ? profile.avatar : "/src/assets/null_user.png"}
                className={`${styles['access-icon']} mx-4 mb-4 mt-2 rounded-circle`}
                alt="/src/assets/null_user.png"
                style={{ width: '50px', height: '50px' }}
            />
            <div
                className='flex-column w-auto justify-content-start mt-3 mb-2 bg-transparent'
            >
                <p className={`justify-content-start bg-transparent fw-bold text-dark ${styles['text-name']}`}>{profile.name}</p>
                <p className='justify-content-start bg-transparent'>{profile.email}</p>
                <div className='bg-transparent'>
                    <img
                        src="/src/assets/ic_followed.png"
                        className={`${styles['access-icon']} m-1 rounded bg-transparent`}
                        alt="/src/assets/ic"
                        style={{ width: '16px', height: '16px' }}
                    />
                    <p className='justify-content-start bg-transparent text-dark'>{profile.followers} followers</p>
                </div>

            </div>

            {isLoading ? (
                <Spinner className='bg-transparent mt-2 text-dark ms-auto me-5' animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>

            ) : !isShowPopupConfirm ? (
                <button
                    type="button"
                    className={`btn btn-light btn-outline-secondary mt-2 d-flex w-auto ${styles['btn']} mx-4 ms-auto`}
                    data-mdb-ripple-color="dark"
                    style={{ zIndex: 1, fontFamily: 'Montserrat', fontSize: '18px' }}
                    onClick={(event) => {
                        event.stopPropagation();
                        profile.relation == 'ME' ? handleEmpty(event) :
                            profile.relation == 'FOLLOWING' ? showPopupConfirm(event) :
                                profile.relation == 'FOLLOWED' ? handleFollow(event) :
                                    profile.relation == 'BOTH' ? showPopupConfirm(event) :
                                        handleFollow(event)
                    }
                    }
                >
                    <img
                        src={profile.relation == 'ME' ? "/src/assets/null_user.png" :
                            profile.relation == 'FOLLOWING' ? "/src/assets/ic_following.png" :
                                profile.relation == 'FOLLOWED' ? "/src/assets/ic_followed.png" :
                                    profile.relation == 'BOTH' ? "/src/assets/ic_follow_each_other.png" :
                                        "/src/assets/ic_add_follow.png"}
                        className={`me-1 bg-transparent ${styles['follow-icon']}`}
                        alt="Follow Icon"
                        style={{ width: '18px', height: '18px' }}
                    />
                    {profile.relation == 'ME' ? "Tôi " :
                        profile.relation == 'FOLLOWING' ? "Đang theo dõi " :
                            profile.relation == 'FOLLOWED' ? "Theo dõi lại " :
                                profile.relation == 'BOTH' ? "Theo dõi nhau " :
                                    "Theo dõi "}
                </button>
            ) : ("")
            }


            {/* pop up confirm will show when unfollowing */}
            {
                isShowPopupConfirm ?
                    (<PopupConfirm
                        title="Huỷ follow?"
                        content={`Bạn có chắc chắn muốn huỷ follow với ${profile.name}?`}
                        isShow={isShowPopupConfirm}
                        actionCancel={(event) => { unShowPopupConfirm(event) }}
                        actionOk={handleUnfollow}>
                    </PopupConfirm>) :
                    ""
            }
        </div>
    );
}