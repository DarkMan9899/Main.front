import { useEffect, useRef } from 'react';
import { track } from '../../utils/analytics';


export function PaymentStatusChecker({ setPaymentStatus }) {
    const hasChecked = useRef(false);

    useEffect(() => {
        if (hasChecked.current) return;
        hasChecked.current = true;

        const urlParams = new URLSearchParams(window.location.search);

        // ----- MyAmeria Pay -----
        const status = urlParams.get('status');
        const transactionId = urlParams.get('transactionId');
        const paymentId = urlParams.get('paymentId');
        const errorMessage = urlParams.get('errorMessage');
        const orderIdFromQuery = urlParams.get('orderId');

        if (status) {
            if (status === 'success') {

                // 📊 FINAL PURCHASE EVENT
                track("purchase", {
                    transaction_id: orderIdFromQuery || paymentId || transactionId,
                    currency: "AMD",
                    payment_system: "ameria",
                    value: 1 // արժեքը հետո կկապենք backend-ից
                });

                setPaymentStatus({
                    success: true,
                    error: null,
                    message: `MyAmeria Pay: Payment successful!\nTransaction ID: ${transactionId || ''}\nPayment ID: ${paymentId || ''}\nOrder ID: ${orderIdFromQuery || ''}`
                });
            }
            else if (status === 'failure') {
                setPaymentStatus({
                    success: false,
                    error: `MyAmeria Pay: Payment failed. ${errorMessage || ''}`
                });
            }

            window.history.replaceState({}, document.title, window.location.pathname);
            return;
        }

        // ----- Ameriabank vPOS -----
        const responseCode = urlParams.get('responseCode');
        const vposOrderId = urlParams.get('orderID');
        const vposPaymentId = urlParams.get('paymentID');

        if (responseCode) {
            if (responseCode === '00') {

                // 📊 FINAL PURCHASE EVENT
                track("purchase", {
                    transaction_id: vposOrderId || vposPaymentId,
                    currency: "AMD",
                    payment_system: "ameria_vpos",
                    value: 1
                });

                setPaymentStatus({
                    success: true,
                    error: null,
                    message: `Ameriabank vPOS: Payment successful!\nOrder ID: ${vposOrderId || ''}\nPayment ID: ${vposPaymentId || ''}`
                });
            }
            else {
                setPaymentStatus({
                    success: false,
                    error: `Ameriabank vPOS: Payment failed with response code ${responseCode}`
                });
            }

            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, []); // ← FIXED

    return null;
}
