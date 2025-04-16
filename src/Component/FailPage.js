import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

function FailPage() {
    const [modalOpen, setModalOpen] = useState(true);
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('orderId');

    useEffect(() => {
        const timer = setTimeout(() => setModalOpen(false), 5000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="fail-page">
            {modalOpen && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <h2>❌ Payment Failed</h2>
                        <p>Your payment could not be completed. Please try again.</p>
                        {orderId && <p>Order ID: {orderId}</p>}
                    </div>
                </div>
            )}
        </div>
    );
}

export default FailPage;
