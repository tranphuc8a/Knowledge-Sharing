import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Separate from '../../components/separate/separate';
import GetAPI from '../../services/api/get-api';
import Session from '../../session/session';
import UserCard from '../../components/user/user-card';

export default function (props) {

    const [listUser, setListUser] = useState([]);
    const [numUser, setUser] = useState(0);
    const [isLoading, setIsloading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        try {
            async function fetchAPI() {
                const token = Session.getInstance().token;

                let api = GetAPI.getInstance().setURL("http://localhost:3000/api/search/account/*");
                if (token != null && token.length > 0) {
                    api.setToken(token);
                }
                await api.execute()
                    .then(res => {
                        console.log(res);
                        if (res.code == 200) {
                            setListUser(res.data);
                            setUser(res.data.length);
                        } else {
                            throw new Error(res.message);
                        }

                    });

            }
            setIsloading(true);
            fetchAPI();
        } catch (error) {
            setError(error.message);
        } finally {
            setIsloading(false);
        }
    }, []);


    return (
        <div style={{ margin: '0px 0px 0px 0px', flexDirection: 'column' }}>
            <div style={{ justifyContent: 'space-between', fontSize: '24px', fontWeight: '500', margin: '0px 0px 12px 0px', whiteSpace: 'nowrap' }}>
                {"Top người dùng"}
            </div>
            <Separate />
            {
                numUser <= 0 ? (
                    "Không có người dùng nổi bật"
                ) : (
                    <div style={{ flexWrap: 'wrap', justifyContent: 'flex-start' }}>
                        {
                            listUser.map((user, index) => {
                                return <div style={{ margin: '16px', width: 'auto' }} key={index}>
                                    <UserCard width={150} user={user} />
                                </div>
                            })
                        }
                    </div>
                )
            }
        </div>
    );
}