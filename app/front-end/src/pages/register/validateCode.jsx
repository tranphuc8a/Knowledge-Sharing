import styles from './register.module.scss';
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import PostAPI from '../../services/api/post-api';
import Spinner from 'react-bootstrap/Spinner';
import { useNavigate } from 'react-router-dom';

export default function (props) {
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false); // loading
    const [error, setError] = useState('Hãy check email để nhận mã code'); // errors come
    const [countDown, setCountDown] = useState(5); // count down for re sending code
    const [isCounting, setIsCounting] = useState(true);

    const navigate = useNavigate();

    // for counting
    useEffect(() => {
        const timerId = setInterval(() => {
            setCountDown(preState => {
                if (preState > 0)
                    return preState - 1;
                else {
                    setIsCounting(false);
                    clearInterval(timerId);
                }
                return 0;
            });
        }, 1000);

        return () => clearInterval(timerId);
    }, [isCounting]);

    const handleValidate = async () => {
        try {
            setLoading(true);

            // temporily wait 2s for developing
            await new Promise((resolve) => setTimeout(resolve, 2000));

            // call api
            await PostAPI.getInstance().setURL("http://localhost:3000/api/auth/register")
                .setData({
                    email: props.email,
                    password: props.password,
                    code: code
                })
                .execute()
                .then(res => {
                    if (res.code == 200) { // success
                        // toast success

                        // navigate to fill form for profile
                        navigate('/login');
                    } else if (res.code == 400 || res.code == 404) { // bad request
                        setError(res.message);
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

    const handleReSendCode = async () => {

        await PostAPI.getInstance().setURL("http://localhost:3000/api/auth/getRegisterCode")
            .setData({
                email: props.email
            })
            .execute()
            .then(res => {
                if (res.code == 200) { // success
                    setCountDown(5);
                    setIsCounting(true);
                } else if (res.code == 400 || res.code == 404) { // bad request
                    setError(res.message);
                } else { // server error
                    setError('Xin lỗi, server của chúng tôi đang gặp trục trặc');
                }
            });
    }

    return (
        <div className={`${styles['Auth-form-content']} form-group mt-3`}>
            <h3 className={styles['Auth-form-title']}>Đăng ký</h3>
            <label className={`${styles['label']} label`}>Mã code</label>
            <input
                type="email"
                className={`form-control mt-1`}
                placeholder="Nhập code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
            />

            <button className={`btn ${styles['btn-gray']} mt-2`} onClick={handleReSendCode}>
                {
                    (countDown == 0) ? (
                        <p className='bg-transparent'>Gửi lại</p>
                    ) : (
                        <p className='bg-transparent'>Gửi lại sau: ({countDown})</p>
                    )
                }

            </button>

            <div className={`d-flex gap-2 mt-3`}>
                {loading ? (
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                ) : (
                    <button className={`btn btn-primary ${styles['btn-primary']}`} onClick={handleValidate}>Xác nhận</button>
                )}
            </div>

            {error && <p className={`error-message text-danger mt-4`}>{error}</p>}

        </div>
    );
}