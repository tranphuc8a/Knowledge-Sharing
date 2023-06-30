import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './visible-display.module.scss';

export default function (props) {

    return (
        <div className={`1p-2 w-auto ${styles['visible-display']} py-1 px-2 rounded`}>
            <img
                src={props.type == 2 ? "/src/assets/ic_public.png" : props.type == 1 ? "/src/assets/ic_followed.png" : "/src/assets/ic_private.png"}
                className={`me-1 bg-transparent ${styles['follow-icon']}`}
                alt="Icon"
                style={{ width: '16px', height: '16px' }}
            />
            <p className="fw-bold text-dark w-auto bg-transparent" style={{ whiteSpace: 'nowrap', fontSize: '14px' }}>
                {props.type == 2 ? "Công khai" : props.type == 1 ? "Mặc định" : "Chỉ mình tôi"}
            </p>
        </div>
    );
}