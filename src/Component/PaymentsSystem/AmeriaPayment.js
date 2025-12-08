import React, { useEffect } from 'react';

export function AmeriaCardPaymentRedirect({ paymentLink }) {
    useEffect(() => {
        console.log("🔵 AmeriaCardPaymentRedirect activated");
        console.log("🔵 paymentLink:", paymentLink);

        if (paymentLink) {
            console.log("🔵 Redirecting to:", paymentLink);
            window.location.href = paymentLink;
        } else {
            console.log("🔴 NO paymentLink RECEIVED");
        }
    }, [paymentLink]);


    return null;
}

export function AmeriaPaymentProcessor({ paymentData, setPaymentStatus }) {
    useEffect(() => {
        console.log("🟢 AmeriaPaymentProcessor triggered");
        console.log("🟢 paymentData:", paymentData);

        if (!paymentData.paymentLink) {
            console.log("🔴 NO paymentLink in AmeriaPaymentProcessor");
            setPaymentStatus({ success: false, error: "paymentLink missing" });
            return;
        }

        console.log("🟢 Redirecting to:", paymentData.paymentLink);
        window.location.href = paymentData.paymentLink;

    }, [paymentData]);


    return null;
}
