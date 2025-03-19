import React from 'react';
import '../styles/ModalNewsletter.css';

const ModalNewsletter = ({ isOpen, onClose, message }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-content">
                    <p>Thank you for reaching out! We've received your message and will keep you updated with our latest news and updates.</p>
                    <button onClick={onClose} className="button">Close</button>
                </div>
            </div>
        </div>
    );
};

export default ModalNewsletter;
