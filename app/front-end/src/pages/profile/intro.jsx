import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './intro.module.scss';
import VisibleDisplay from '../../components/visible/visible-display';
import VisibleMenu from '../../components/visible/visibleMenu';

export default function (props) {

    return (
        <div className={`card mb-4 mb-lg-0 ${styles['card']}`}>
            <div className="card-body p-0">
                <ul className="list-group list-group-flush rounded-3">

                    {/* update button */}
                    {
                        props.profile.relation == "ME"
                            ?
                            <div className={`align-self-start mb-4 1p-2 w-auto ${styles['update-button']} py-1 px-2 rounded border border-dark shadow`}>
                                <img
                                    src="/src/assets/ic_update.png"
                                    className={`me-1 bg-transparent`}
                                    alt="Icon"
                                    style={{ width: '20px', height: '20px' }}
                                />
                                <p className="fw-bold text-dark w-auto bg-transparent" style={{ whiteSpace: 'nowrap', fontSize: '14px' }}>
                                    Chỉnh sửa chi tiết
                                </p>
                            </div>
                            : ""
                    }


                    {/* list field */}
                    <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                        <img
                            src="/src/assets/ic_birthday.png"
                            className={`me-1 bg-transparent ${styles['access-icon']} me-4`}
                            alt="Follow Icon"
                            style={{ width: '32px', height: '32px' }}
                        />

                        <p className="justify-content-start me-3 ms-4 mb-0 fw-bold">
                            {
                                props.profile.dob || props.profile.relation == 'ME' ? props.profile.dob : "Thông tin riêng tư"
                            }
                        </p>

                        {
                            props.profile.relation == "ME" ?
                                <VisibleDisplay type={props.profile.visible[3]}></VisibleDisplay>
                                : ""
                        }

                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                        <img
                            src="/src/assets/ic_phone.png"
                            className={`me-1 bg-transparent ${styles['access-icon']} me-4`}
                            alt="Follow Icon"
                            style={{ width: '32px', height: '32px' }}
                        />

                        <p className="justify-content-start me-3 ms-4 mb-0 fw-bold">
                            {
                                props.profile.phone || props.profile.relation == 'ME' ? props.profile.phone : "Thông tin riêng tư"
                            }
                        </p>

                        {
                            props.profile.relation == "ME" ?
                                <VisibleDisplay type={props.profile.visible[4]}></VisibleDisplay>
                                : ""
                        }
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                        <img
                            src="/src/assets/ic_gender.png"
                            className={`me-1 bg-transparent ${styles['access-icon']} me-4`}
                            alt="Follow Icon"
                            style={{ width: '32px', height: '32px' }}
                        />

                        <p className="justify-content-start me-3 ms-4 mb-0 fw-bold">
                            {
                                props.profile.gender || props.profile.relation == 'ME' ?
                                    (props.profile.gender == 'female' ? "Nữ" : props.profile.gender == 'male' ? "Nam" : "Khác")
                                    : "Thông tin riêng tư"
                            }
                        </p>

                        {
                            props.profile.relation == "ME" ?
                                <VisibleDisplay type={props.profile.visible[5]}></VisibleDisplay>
                                : ""
                        }
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                        <img
                            src="/src/assets/ic_address.png"
                            className={`me-1 bg-transparent ${styles['access-icon']} me-4`}
                            alt="Follow Icon"
                            style={{ width: '32px', height: '32px' }}
                        />

                        <p className="justify-content-start me-3 ms-4 mb-0 fw-bold">
                            {
                                props.profile.address || props.profile.relation == 'ME' ? props.profile.address : "Thông tin riêng tư"
                            }
                        </p>

                        {
                            props.profile.relation == "ME" ?
                                <VisibleDisplay type={props.profile.visible[6]}></VisibleDisplay>
                                : ""
                        }
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                        <img
                            src="/src/assets/ic_job.png"
                            className={`me-1 bg-transparent ${styles['access-icon']} me-4`}
                            alt="Follow Icon"
                            style={{ width: '32px', height: '32px' }}
                        />

                        <p className="justify-content-start me-3 ms-4 mb-0 fw-bold">
                            {
                                props.profile.job || props.profile.relation == 'ME' ? props.profile.job : "Thông tin riêng tư"
                            }
                        </p>

                        {
                            props.profile.relation == "ME" ?
                                <VisibleDisplay type={props.profile.visible[7]}></VisibleDisplay>
                                : ""
                        }
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                        <img
                            src="/src/assets/ic_global.png"
                            className={`me-1 bg-transparent ${styles['access-icon']} me-4`}
                            alt="Follow Icon"
                            style={{ width: '32px', height: '32px' }}
                        />

                        <p className="justify-content-start me-3 ms-4 mb-0 fw-bold">
                            {
                                props.profile.social_link || props.profile.relation == 'ME' ? props.profile.social_link : "Thông tin riêng tư"
                            }
                        </p>

                        {
                            props.profile.relation == "ME" ?
                                <VisibleDisplay type={props.profile.visible[8]}></VisibleDisplay>
                                : ""
                        }
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                        <img
                            src="/src/assets/ic_description.png"
                            className={`me-1 bg-transparent ${styles['access-icon']} me-4`}
                            alt="Follow Icon"
                            style={{ width: '32px', height: '32px' }}
                        />

                        <p className="justify-content-start me-3 ms-4 mb-0 fw-bold">
                            {
                                props.profile.description || props.profile.relation == 'ME' ? props.profile.description : "Thông tin riêng tư"
                            }
                        </p>

                        {
                            props.profile.relation == "ME" ?
                                <VisibleDisplay type={props.profile.visible[9]}></VisibleDisplay>
                                : ""
                        }
                    </li>

                </ul>


            </div>
        </div>
    );
}