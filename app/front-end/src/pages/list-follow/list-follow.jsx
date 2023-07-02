import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './list-follow.module.scss';
import ItemFollow from './item-follow';
import GetAPI from '../../services/api/get-api';
import Session from '../../session/session';
import { Spinner } from 'react-bootstrap';

export default function (props) {

    const [listFollow, setListFollow] = useState([]);
    const [isLoading, setIsloading] = useState(false);

    useEffect(() => {
        try {
            async function fetchAPI() {
                // call get profile api
                let mainUser = Session.getInstance().mainUser;
                await GetAPI.getInstance()
                    .setURL("http://localhost:3000/api/follow/" + props.email + "/" + props.type +
                        "?myEmail=" + mainUser.email + "&offset=0&length=100")
                    .execute()
                    .then(res => {
                        console.log(res);
                        if (res.code == 200) {
                            setListFollow(res.data);
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
        <div className='flex-column'>
            {/* <h3 className={`align-self-start w-auto px-1 text-dark ${styles['custom-underline-text']}`}>
                Người theo dõi
            </h3> */}
            {
                isLoading ? (
                    <Spinner className='bg-transparent mt-2 text-dark' animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                ) : (
                    listFollow.map((follow, index) => (
                        <ItemFollow data={follow} key={index}>

                        </ItemFollow>
                    ))
                )
            }

        </div>
    );
}