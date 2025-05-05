import React, { useEffect } from 'react';

export function PaymentRedirectHandler({ paymentType, paymentLink }) {
    useEffect(() => {
        if (paymentLink && (paymentType === 'card' || paymentType === 'ameria_pay')) {
            window.location.href = paymentLink;
        }
    }, [paymentType, paymentLink]);

    return null;
}