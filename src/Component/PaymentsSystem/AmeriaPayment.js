import React, { useEffect } from 'react';

export function AmeriaCardPaymentRedirect({ paymentLink }) {
    useEffect(() => {
        if (paymentLink) {
            window.location.href = paymentLink;
        }
    }, [paymentLink]);

    return null;
}

export function AmeriaPaymentProcessor({ paymentData, setPaymentStatus }) {
    useEffect(() => {
        if (!paymentData.paymentLink) {
            setPaymentStatus({
                success: false,
                error: 'Payment link is required for Ameria card payments'
            });
            return;
        }

        window.location.href = paymentData.paymentLink;
    }, [paymentData, setPaymentStatus]);

    return null;
}
