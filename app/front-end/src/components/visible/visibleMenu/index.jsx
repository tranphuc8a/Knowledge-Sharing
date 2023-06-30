import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from "./visible-menu.module.scss"

export default function (props) {

    return (
        <div className="btn-group w-auto">
            <button type="button"
                className={`d-flex btn ${styles['btn']} dropdown-toggle fw-bold`} data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                style={{ whiteSpace: 'nowrap', fontSize: '14px' }}
            >
                <img
                    src={props.currentState == 2 ? "/src/assets/ic_public.png" : props.currentState == 1 ? "/src/assets/ic_followed.png" : "/src/assets/ic_private.png"}
                    className={`me-2 bg-transparent  ${styles['follow-icon']}`}
                    alt="Icon"
                    style={{ width: '16px', height: '16px' }}
                />
                {props.currentState == 2 ?
                    "Công khai" : props.currentState == 1 ?
                        "Mặc định" : "Chỉ mình tôi"
                }
            </button>
            <ul className="dropdown-menu">
                <li><button className={`dropdown-item  ${styles['dropdown-item']}`} type="button" value="2" onClick={props.changeVisible}>Công khai</button></li>
                <li><button className={`dropdown-item  ${styles['dropdown-item']}`} type="button" value="1" onClick={props.changeVisible}>Mặc định</button></li>
                <li><button className={`dropdown-item  ${styles['dropdown-item']}`} type="button" value="0" onClick={props.changeVisible}>Chỉ mình tôi</button></li>
            </ul>
        </div>
    );
}