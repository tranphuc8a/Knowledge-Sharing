import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './profile-update.module.scss';
import VisibleMenu from '../../components/visible/visibleMenu';
import Layout from '../../components/layout/layout';
import PutAPI from '../../services/api/put-api';
import Session from '../../session/session';
import { useLocation, useNavigate } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';


export default function (props) {

    const location = useLocation();
    const _profile = location.state.profile;

    let profile = {
        email: _profile.email,
        name: _profile.name,
        avatar: _profile.avatar,
        dob: _profile.dob,
        phone: _profile.phone,
        gender: _profile.gender,
        address: _profile.address,
        job: _profile.job,
        social_link: _profile.social_link,
        description: _profile.description,
        visible: _profile.visible
    };

    // let profile = {
    //     "email": "manacoto123@gmail.com",
    //     "name": "Trịnh Đức Tiệp",
    //     "avatar": "https://storage.googleapis.com/bksnet-e46a7.appspot.com/knowledge-sharing/manacoto123%40gmail.com2023-06-29%2023%3A03%3A19?GoogleAccessId=firebase-adminsdk-7bnab%40bksnet-e46a7.iam.gserviceaccount.com&Expires=1893456000&Signature=q3RRPq3%2FZFsu4PRWhxLe%2F2%2BTZxCeMpgG7U61au8%2BI6tmhsicpaaUVXtPEtcQcsgOrQh131rF7M44scCp4KqH%2B7JcA6XjYS74iiiTZpHv8b8X2KLmNTgwToeVPFnhojas%2FXx90EzKlkU50kBd1kY6Vj3hj9X6jzUjRTGVswPt9AS4IDqxRkQ7%2FJDYdpJ9b3TnM5aSAHaEmf54zRTiFUdjG2ZSwqEiCLP10CHagOSaKhh6uq7XmbXcdJxxU0xZ2xh81DHY145QllsvEMz4m9ZTsDqv4wCYpvjj2Z%2BM2hDaaBR%2FWNtaYl7OaMa6tLonYQM%2Fci7m90IGdPslrcH0n4Tp9g%3D%3D",
    //     "dob": "11-11-2001",
    //     "phone": "0987654321",
    //     "gender": "other",
    //     "address": "Hai Bà Trưng, Hà Nội",
    //     "job": "Quản lý nhà hàng",
    //     "social_link": null,
    //     "description": "Tôi đang quan tâm tới các lĩnh vực như web, big data, AI",
    //     "visible": "2222211002"
    // }

    const [myProfile, setMyprofile] = useState(profile);
    const [visible, setVisible] = useState(profile.visible);
    const [isLoading, setIsloading] = useState(false);
    const [error, setError] = useState(''); // errors come

    const navigate = useNavigate();

    const handleGenderChange = (e) => {
        setMyprofile(prev => ({
            ...prev,
            gender: e.target.value
        }));
    };

    const changeVisible = (e, index) => {
        setVisible(prevVisible => {
            const newValue = prevVisible.slice(0, index) + e.target.value + prevVisible.slice(index + 1);
            return newValue;
        });
    };

    const handleUpdateProfile = async () => {
        try {
            setIsloading(true);

            // temporily wait 2s for developing
            await new Promise((resolve) => setTimeout(resolve, 2000));

            let newProfile = {
                ...myProfile,
                visible: visible
            }
            // call update profile api
            await PutAPI.getInstance().setURL("http://localhost:3000/api/profile")
                .setToken(Session.getInstance().token)
                .setBody(newProfile)
                .execute()
                .then(res => {
                    console.log(res);
                    if (res.code == 200) { // success
                        navigate('/profile?email=' + myProfile.email); // todo
                    } else if (res.code == 400 || res.code == 404) { // bad request
                        throw new Error(res.message);
                    } else {
                        throw new Error("Server đang gặp lỗi");
                    }
                });

        } catch (error) {
            setError(error);
        } finally {
            setIsloading(false);
        }
    }

    return (
        <Layout>
            <div className='mt-5'>
                <h5 className={`w-auto px-1 text-dark ${styles['custom-underline-text']}`}>

                    Chỉnh sửa profile
                </h5>
            </div>

            <div className='d-flex flex-lg-row flex-column align-items-start container-fluid my-4'>
                <div className={`card mb-4 mb-lg-0 ${styles['card']} col m-2`}>
                    <div className="card-body p-0">
                        <ul className="list-group list-group-flush rounded-3">


                            {/* list field */}
                            <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                                <img
                                    src="/src/assets/ic_birthday.png"
                                    className={`me-1 bg-transparent ${styles['access-icon']} me-4`}
                                    alt="Follow Icon"
                                    style={{ width: '32px', height: '32px' }}
                                />

                                <input
                                    type="text"
                                    className={`form-control mt-1 me-4`}
                                    placeholder="Nhập ngày sinh"
                                    value={myProfile.dob || ''}
                                    onChange={(e) => setMyprofile(prev => ({ ...prev, dob: e.target.value }))}
                                />


                                <div className='ms-auto w-auto'>
                                    <VisibleMenu
                                        currentState={visible[3]}
                                        changeVisible={(e) => changeVisible(e, 3)}
                                    >
                                    </VisibleMenu>
                                </div>

                            </li>
                            <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                                <img
                                    src="/src/assets/ic_phone.png"
                                    className={`me-1 bg-transparent ${styles['access-icon']} me-4`}
                                    alt="Follow Icon"
                                    style={{ width: '32px', height: '32px' }}
                                />

                                <input
                                    type="text"
                                    pattern="[0-9]{10,12}"
                                    className={`form-control mt-1 me-4`}
                                    placeholder="Nhập sđt"
                                    value={myProfile.phone || ''}
                                    onChange={(e) => setMyprofile(prev => ({ ...prev, phone: e.target.value }))}
                                />


                                <div className='ms-auto w-auto'>
                                    <VisibleMenu
                                        currentState={visible[4]}
                                        changeVisible={(e) => changeVisible(e, 4)}
                                    >
                                    </VisibleMenu>
                                </div>

                            </li>
                            <li className="list-group-item d-flex p-3 justify-content-start">
                                <img
                                    src="/src/assets/ic_gender.png"
                                    className={`bg-transparent ${styles['access-icon']} me-4`}
                                    alt="Follow Icon"
                                    style={{ width: '32px', height: '32px' }}
                                />

                                <div className="btn-group w-auto">
                                    <button type="button" className="btn btn-outline-dark dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        {myProfile.gender == 'male' ?
                                            "Nam" : myProfile.gender == 'female' ?
                                                "Nữ" :
                                                "Khác"
                                        }
                                    </button>
                                    <ul className="dropdown-menu">
                                        <li><button className="dropdown-item" type="button" value="male" onClick={handleGenderChange}>Nam</button></li>
                                        <li><button className="dropdown-item" type="button" value="female" onClick={handleGenderChange}>Nữ</button></li>
                                        <li><button className="dropdown-item" type="button" value="other" onClick={handleGenderChange}>Khác</button></li>
                                    </ul>
                                </div>

                                <div className='ms-auto w-auto'>
                                    <VisibleMenu
                                        currentState={visible[5]}
                                        changeVisible={(e) => changeVisible(e, 5)}
                                    >
                                    </VisibleMenu>
                                </div>



                            </li>
                            <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                                <img
                                    src="/src/assets/ic_address.png"
                                    className={`me-1 bg-transparent ${styles['access-icon']} me-4`}
                                    alt="Follow Icon"
                                    style={{ width: '32px', height: '32px' }}
                                />

                                <input
                                    type="text"
                                    className={`form-control mt-1 me-4`}
                                    placeholder="Nhập địa chỉ"
                                    value={myProfile.address || ''}
                                    onChange={(e) => setMyprofile(prev => ({ ...prev, address: e.target.value }))}
                                />

                                <div className='ms-auto w-auto'>
                                    <VisibleMenu
                                        currentState={visible[6]}
                                        changeVisible={(e) => changeVisible(e, 6)}
                                    >
                                    </VisibleMenu>
                                </div>

                            </li>
                            <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                                <img
                                    src="/src/assets/ic_job.png"
                                    className={`me-1 bg-transparent ${styles['access-icon']} me-4`}
                                    alt="Follow Icon"
                                    style={{ width: '32px', height: '32px' }}
                                />

                                <input
                                    type="text"
                                    className={`form-control mt-1 me-4`}
                                    placeholder="Nhập công việc"
                                    value={myProfile.job || ''}
                                    onChange={(e) => setMyprofile(prev => ({ ...prev, job: e.target.job }))}
                                />

                                <div className='ms-auto w-auto'>
                                    <VisibleMenu
                                        currentState={visible[7]}
                                        changeVisible={(e) => changeVisible(e, 7)}
                                    >
                                    </VisibleMenu>
                                </div>

                            </li>
                            <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                                <img
                                    src="/src/assets/ic_global.png"
                                    className={`me-1 bg-transparent ${styles['access-icon']} me-4`}
                                    alt="Follow Icon"
                                    style={{ width: '32px', height: '32px' }}
                                />

                                <input
                                    type="text"
                                    className={`form-control mt-1 me-4`}
                                    placeholder="Nhập liên kết xã hội"
                                    value={myProfile.social_link || ''}
                                    onChange={(e) => setMyprofile(prev => ({ ...prev, social_link: e.target.value }))}
                                />

                                <div className='ms-auto w-auto'>
                                    <VisibleMenu
                                        currentState={visible[8]}
                                        changeVisible={(e) => changeVisible(e, 8)}
                                    >
                                    </VisibleMenu>
                                </div>

                            </li>

                        </ul>


                    </div>
                </div>

                {/* description */}
                <div className={`card mb-4 mb-lg-0 ${styles['card']} col m-2`} style={{ width: 'auto', height: '100%' }}>
                    <h5 className='text-dark'>Mô tả</h5>
                    <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                        <img
                            src="/src/assets/ic_description.png"
                            className={`me-1 bg-transparent ${styles['access-icon']}`}
                            alt="Follow Icon"
                            style={{ width: '32px', height: '32px' }}
                        />

                        <textarea
                            type="text"
                            className={`form-control mt-1 ${styles['des-input']}`}
                            placeholder="Nhập mô tả"
                            value={myProfile.description}
                            onChange={(e) => setMyprofile(prev => ({ ...prev, description: e.target.value }))}
                        />



                    </li>

                    <div className='w-auto'>
                        <VisibleMenu
                            currentState={visible[9]}
                            changeVisible={(e) => changeVisible(e, 9)}
                        >
                        </VisibleMenu>
                    </div>
                </div>
            </div>


            {isLoading ? (
                <Spinner className='m-2' animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            ) : (
                <button
                    onClick={handleUpdateProfile}
                    className={`btn btn-primary mb-3 ${styles['btn-primary']}`}>
                    Cập nhật
                </button>
            )}

            {error && <p className={`error-message text-danger mb-4`} style={{ fontSize: 32 }}>{error}</p>}

        </Layout>

    );
}