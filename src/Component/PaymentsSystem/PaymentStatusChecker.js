import { useEffect } from 'react';

export function PaymentStatusChecker({ setPaymentStatus }) {
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);

        // ----- MyAmeria Pay -----
        const status = urlParams.get('status');
        const transactionId = urlParams.get('transactionId');
        const paymentId = urlParams.get('paymentId');
        const errorMessage = urlParams.get('errorMessage');
        const orderIdFromQuery = urlParams.get('orderId');

        if (status) {
            if (status === 'success') {
                setPaymentStatus({
                    success: true,
                    error: null,
                    message: `MyAmeria Pay: Payment successful!\nTransaction ID: ${transactionId || ''}\nPayment ID: ${paymentId || ''}\nOrder ID: ${orderIdFromQuery || ''}`
                });
            } else if (status === 'failure') {
                setPaymentStatus({
                    success: false,
                    error: `MyAmeria Pay: Payment failed. ${errorMessage || ''}`
                });
            }
        }

        // ----- Ameriabank vPOS 3.1 -----
        const responseCode = urlParams.get('responseCode');
        const vposOrderId = urlParams.get('orderID');
        const vposPaymentId = urlParams.get('paymentID');

        if (responseCode) {
            if (responseCode === '00') {
                setPaymentStatus({
                    success: true,
                    error: null,
                    message: `Ameriabank vPOS: Payment successful!\nOrder ID: ${vposOrderId || ''}\nPayment ID: ${vposPaymentId || ''}`
                });
            } else {
                setPaymentStatus({
                    success: false,
                    error: `Ameriabank vPOS: Payment failed with response code ${responseCode}`
                });
            }
        }

        // Clean up the URL so params aren't visible anymore
        if (window.history && window.history.replaceState) {
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, [setPaymentStatus]);

    return null;
}