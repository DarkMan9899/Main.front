import React from 'react';
import Modal from 'react-modal';
import '../styles/ModalContact.css'

Modal.setAppElement('#root');

const ModalComponent = ({ isOpen, onClose, message }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Notification Modal"
            className="Modal"
            overlayClassName="Overlay"
        >
            <div>
                <h2>Notification</h2>
                <p>{message}</p>
                <button onClick={onClose}>Close</button>
            </div>
        </Modal>
    );
};

export default ModalComponent;
