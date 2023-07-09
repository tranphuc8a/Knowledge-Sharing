import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import styles from './popup-confirm.module.scss'

export default function (props) {
    const [showModal, setShowModal] = useState(props.isShow);

    return (
        <div>
            <Modal
                show={showModal}
                className={`${styles['modal']}`}
                onHide={(event) => {
                    // event.stopPropagation();
                    props.actionCancel();
                    setShowModal(false);

                }}>
                <Modal.Header closeButton>
                    <Modal.Title className={`${styles['modal-text']}`}>{props.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body className={`${styles['modal-text']}`}>
                    {props.content}
                </Modal.Body>
                <Modal.Footer className={`${styles['modal-footer']}`}>
                    <Button variant="secondary" onClick={(event) => {
                        event.stopPropagation();
                        props.actionCancel();
                        setShowModal(false);
                    }}>
                        Hủy
                    </Button>
                    <Button
                        className={`${styles['btn-primary']}`}
                        variant="primary"
                        onClick={(event) => {
                            event.stopPropagation();
                            props.actionOk();
                        }}>
                        Xác nhận
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};