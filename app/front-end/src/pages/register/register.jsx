import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import PostAPI from '../../services/api/post-api';
import Spinner from 'react-bootstrap/Spinner';
import { useNavigate } from 'react-router-dom';
import styles from './register.module.scss';
import ValidateCode from './validateCode';
import Account from './account';
import Toast from '../../utils/toast';

export default function (props) {
    // email and password state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const [loading, setLoading] = useState(false); // loading
    const [error, setError] = useState(''); // errors come
    const [showPassword, setShowPassword] = useState(false); // show/hide password
    const [period, setPeriod] = useState(2);

    console.log(period);

    // for navigating screen
    const navigate = useNavigate();



    return (
        <div className={styles['Auth-form-container']}>
            <div className="vh-100" style={{
                backgroundPosition: 'center 20%',
                backgroundSize: 'auto',
                background: 'linear-gradient(to bottom, rgba(212, 63, 141, 0.9), rgba(2, 80, 197, 0.5))'
            }}>
                <form className={styles['Auth-form']}>
                    {
                        (period == 2) ? (
                            <ValidateCode email={email} password={password} setPeriod={setPeriod}>

                            </ValidateCode>
                        ) : period == 1 ? (
                            <Account email={email} password={password} rePassword={rePassword}
                                setEmail={setEmail} setPassword={setPassword} setRePassword={setRePassword}
                                setPeriod={setPeriod}>

                            </Account>
                        ) : (
                            <h1>còn lại</h1>
                        )
                    }

                </form>
            </div>
        </div>
    );
}
