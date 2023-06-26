import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './intro.module.scss';

export default function (props) {

    return (
        <div className="card mb-4 mb-lg-0">
            <div className="card-body p-0">
                <ul className="list-group list-group-flush rounded-3">
                    <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                        <img
                            src="/src/assets/ic_birthday.png"
                            className={`me-1 bg-transparent ${styles['follow-icon']} me-4`}
                            alt="Follow Icon"
                            style={{ width: '32px', height: '32px' }}
                        />
                        <p className="justify-content-start ms-4 mb-0 fw-bold">11-11-2001</p>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                        <img
                            src="/src/assets/ic_phone.png"
                            className={`me-1 bg-transparent ${styles['follow-icon']} me-4`}
                            alt="Follow Icon"
                            style={{ width: '32px', height: '32px' }}
                        />
                        <p className="justify-content-start ms-4 mb-0 fw-bold">0987.654.321</p>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                        <img
                            src="/src/assets/ic_gender.png"
                            className={`me-1 bg-transparent ${styles['follow-icon']} me-4`}
                            alt="Follow Icon"
                            style={{ width: '32px', height: '32px' }}
                        />
                        <p className="justify-content-start ms-4 mb-0 fw-bold">Nam</p>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                        <img
                            src="/src/assets/ic_address.png"
                            className={`me-1 bg-transparent ${styles['follow-icon']} me-4`}
                            alt="Follow Icon"
                            style={{ width: '32px', height: '32px' }}
                        />
                        <p className="justify-content-start ms-4 mb-0 fw-bold">Số 1, Đại Cồ Việt, Hai Bà Trưng, Hà Nội</p>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                        <img
                            src="/src/assets/ic_job.png"
                            className={`me-1 bg-transparent ${styles['follow-icon']} me-4`}
                            alt="Follow Icon"
                            style={{ width: '32px', height: '32px' }}
                        />
                        <p className="justify-content-start ms-4 mb-0 fw-bold">Sinh viên SOICT-HUST</p>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                        <img
                            src="/src/assets/ic_global.png"
                            className={`me-1 bg-transparent ${styles['follow-icon']} me-4`}
                            alt="Follow Icon"
                            style={{ width: '32px', height: '32px' }}
                        />
                        <p className="justify-content-start ms-4 mb-0 fw-bold">https://www.onlinepianist.com/virtual-piano</p>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                        <img
                            src="/src/assets/ic_description.png"
                            className={`me-1 bg-transparent ${styles['follow-icon']} me-4`}
                            alt="Follow Icon"
                            style={{ width: '32px', height: '32px' }}
                        />
                        <p className="justify-content-start ms-4 mb-0 fw-bold">
                            Chào tất cả mọi người, anh chị có thể gọi em là Thủy. Năm nay em 23 tuổi, em học chuyên ngành thiết kế đồ họa trường Đại học Mở Hà Nội và đang là nhân viên mới của phòng thiết kế của công ty mình. Rất mong sắp tới nhận được sự giúp đỡ từ anh chị và hy vọng em sẽ có những trải nghiệm tốt đẹp tại đây.
                        </p>
                    </li>
                </ul>
            </div>
        </div>
    );
}