import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './register.module.scss';
import ValidateCode from './validateCode';
import Account from './account';

export default function (props) {
    // email and password state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const [period, setPeriod] = useState(1);

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
                            <div>
                                <ValidateCode email={email} password={password} setPeriod={setPeriod}>
                                </ValidateCode>
                            </div>


                        ) : period == 1 ? (
                            <Account email={email} password={password} rePassword={rePassword}
                                setEmail={setEmail} setPassword={setPassword} setRePassword={setRePassword}
                                setPeriod={setPeriod}>

                            </Account>
                        ) : (
                            <h1>Empty screen</h1>
                        )
                    }

                </form>
            </div>
        </div>
    );
}
