import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Spinner from 'react-bootstrap/Spinner';
import styles from './register.module.scss';
import PostAPI from '../../services/api/post-api';
import Toast from '../../utils/toast';

export default function (props) {
    const [loading, setLoading] = useState(false); // loading
    const [error, setError] = useState(''); // errors come
    const [showPassword, setShowPassword] = useState(false); // show/hide password

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // loading -> true
            setLoading(true);

            // check password length
            if (props.password.length < 8) {
                throw new Error('Mật khẩu phải nhiều hơn 8 ký tự');
            }

            // check re-password
            if (props.password != props.rePassword) {
                throw new Error('Mật khẩu không trùng khớp');
            }

            // temporily wait 2s for developing
            await new Promise((resolve) => setTimeout(resolve, 2000));

            // call getRegisterCode api
            await PostAPI.getInstance().setURL("http://localhost:3000/api/auth/getRegisterCode")
                .setBody({
                    email: props.email
                })
                .execute()
                .then(res => {
                    if (res.code == 200) { // success
                        Toast.getInstance().success("Đã thêm đánh giá", 3000);
                        props.setPeriod(2);
                    } else if (res.code == 400) { // bad request
                        if (res.detail || res.detail.length <= 0)
                            setError('Tài khoản hoặc mật khẩu không chính xác.');
                        else
                            setError(res.detail);
                    } else { // server error
                        setError('Xin lỗi, server của chúng tôi đang gặp trục trặc');
                    }
                });
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={styles['Auth-form-content']}>

            <h3 className={styles['Auth-form-title']}>Đăng ký</h3>
            <div className={`${styles['form-group']} form-group mt-3`}>
                <label className={`${styles['label']} label`}>Địa chỉ email</label>
                <input
                    type="email"
                    className={`form-control mt-1`}
                    placeholder="Nhập email"
                    value={props.email}
                    onChange={(e) => props.setEmail(e.target.value)}
                />
            </div>

            <div className={`${styles['form-group']} form-group mt-3`}>
                <label className={`${styles['label']} label`}>Mật khẩu</label>
                <div className={' input-group flex-row'}>
                    <div className="position-relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            className={`${styles['form-control']} form-control mt-1`}
                            placeholder="Nhập mật khẩu"
                            value={props.password}
                            onChange={(e) => props.setPassword(e.target.value)}
                        />
                        <span className={`w-auto position-absolute top-50 end-0 translate-middle-y ${styles['input-eye']}`}>
                            <button
                                className={`${styles['btn']} btn mx-2 my-0 px-1 py-0 ${styles['eye-button']}`}
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                <img
                                    className={`${styles['eye-icon']} ${showPassword ? styles['show'] : ''}`}
                                    src={showPassword ? "/src/assets/ic_eye_open.png" : "/src/assets/ic_eye_closed.png"}
                                    alt="Toggle Password Visibility"
                                />
                            </button>
                        </span>
                    </div>
                </div>
            </div>

            <div className={`${styles['form-group']} form-group mt-1`}>
                <input
                    type="password"
                    className={`form-control mt-1`}
                    placeholder="Nhập lại mật khẩu"
                    value={props.rePassword}
                    onChange={(e) => props.setRePassword(e.target.value)}
                />
            </div>

            <div className={`d-flex gap-2 mt-3`}>
                {loading ? (
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                ) : (
                    <button type="submit" className={`btn btn-primary ${styles['btn-primary']}`} onClick={handleSubmit}>Đăng ký</button>
                )}
            </div>

            {error && <p className={`error-message text-danger mt-4`}>{error}</p>}

            <div className={`${styles['divider']} divider my-4`}>
                <p className={`or-text text-center fw-bold mx-3 mb-0 text-muted w-auto`}>OR</p>
            </div>
            <a className={`text-primary text-center`} href="/login" role="button">
                Quay lại đăng nhập
            </a>
        </div>
    );
}