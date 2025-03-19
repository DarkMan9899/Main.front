import React from 'react';
import "../styles/ModalContactPage.css"

function ModalContact({ onConfirm, onCancel }) {
    return (
        <div className="modal">
            <div className="modal-content">
                <h3>Confirm Payment</h3>
                <p>Are you sure you want to proceed with the payment?</p>
                <button onClick={onConfirm} className="confirm-button">Confirm</button>
                <button onClick={onCancel} className="cancel-button">Cancel</button>
            </div>
        </div>
    );
}

export default ModalContact;
