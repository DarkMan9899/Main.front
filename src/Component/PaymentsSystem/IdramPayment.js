import React, { useEffect, useRef } from 'react';
import { IDRAM_ACCOUNT_ID, CUSTOMER_EMAIL, PAYMENT_CONFIG } from './PaymentConfig';


// ======================================================
// AUTO-SUBMIT FORM (Idram Request)
// ======================================================
export function IdramPaymentForm({ amount, billNo }) {
    const formRef = useRef(null);

    useEffect(() => {
        if (formRef.current) {
            console.log("🚀 Submitting Idram form automatically");
            formRef.current.submit();
        }
    }, []);

    return (
        <form
            ref={formRef}
            action={PAYMENT_CONFIG.idram.formAction}
            method="POST"
        >
            <input type="hidden" name="EDP_LANGUAGE" value={PAYMENT_CONFIG.idram.language} />
            <input type="hidden" name="EDP_REC_ACCOUNT" value={IDRAM_ACCOUNT_ID} />
            <input type="hidden" name="EDP_DESCRIPTION" value="Polyglot Academy Purchase" />
            <input type="hidden" name="EDP_AMOUNT" value={amount} />
            <input type="hidden" name="EDP_BILL_NO" value={billNo} />

            {/* optional */}
            <input type="hidden" name="EDP_EMAIL" value={CUSTOMER_EMAIL} />
        </form>
    );
}


// ======================================================
// PROCESSOR COMPONENT (wrapper for PaymentProcessor.js)
// ======================================================
export function IdramPaymentProcessor({ paymentData, setPaymentStatus }) {

    useEffect(() => {
        console.log("🔵 IdramPaymentProcessor INIT:", paymentData);

        if (!paymentData || !paymentData.orderId) {
            console.error("❌ Missing order ID for Idram payment");
            setPaymentStatus({
                success: false,
                error: "Missing Idram orderId"
            });
        }
    }, [paymentData, setPaymentStatus]);

    return (
        <IdramPaymentForm
            amount={paymentData.amount}
            billNo={paymentData.billNo || paymentData.orderId}
        />
    );
}
