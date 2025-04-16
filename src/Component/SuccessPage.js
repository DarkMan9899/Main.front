import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
function SuccessPage() {
    const [modalOpen, setModalOpen] = useState(true);
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('orderId');

    useEffect(() => {
        const timer = setTimeout(() => setModalOpen(false), 5000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="success-page">
            {modalOpen && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <h2>✅ Payment Confirmed</h2>
                        <p>Your payment was successful. Thank you!</p>
                        {orderId && <p>Order ID: {orderId}</p>}
                    </div>
                </div>
            )}
        </div>
    );
}

export default SuccessPage;
