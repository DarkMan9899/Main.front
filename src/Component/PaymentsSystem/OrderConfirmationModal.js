import React from 'react';

export function OrderConfirmationModal({
                                           modalOpen,
                                           customerInfo,
                                           totalAmount,
                                           confirmPayment,
                                           cancelPayment,
                                           isLoading
                                       }) {
    if (!modalOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-box">
                <h3>Order Confirmation</h3>
                <p>
                    Please confirm your order details:
                </p>
                <div className="confirmation-details">
                    <p><strong>Name:</strong> {customerInfo.name} {customerInfo.surname}</p>
                    <p><strong>Phone:</strong> {customerInfo.phone}</p>
                    <p><strong>Payment Method:</strong> {customerInfo.paymentType === 'idram' ? 'Idram' :
                        customerInfo.paymentType === 'card' ? 'Card (Ameria)' : 'MyAmeria Pay'}</p>
                    <p><strong>Total Amount:</strong> {totalAmount} AMD</p>
                </div>
                <div className="modal-buttons">
                    <button
                        className="confirm-button"
                        onClick={confirmPayment}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Processing...' : 'Confirm Order'}
                    </button>
                    <button
                        className="cancel-button"
                        onClick={cancelPayment}
                        disabled={isLoading}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}