import React, { useEffect, useRef } from 'react';
import { BASE_URL, IDRAM_ACCOUNT_ID, CUSTOMER_EMAIL, PAYMENT_CONFIG } from './PaymentConfig';

export function IdramPaymentForm({ amount, billNo, orderId, successUrl, failUrl, resultUrl }) {
    const formRef = useRef(null);

    useEffect(() => {
        // Ավտոմատ ներկայացնել ֆորմը, երբ այն մոնտաժվում է
        if (formRef.current) {
            console.log('Submitting Idram form automatically');
            formRef.current.submit();
        }
    }, []);

    return (
        <form
            ref={formRef}
            action={PAYMENT_CONFIG.idram.formAction}
            method="POST"
            id="idramPaymentForm"
        >
            <input type="hidden" name="EDP_LANGUAGE" value={PAYMENT_CONFIG.idram.language} />
            <input type="hidden" name="EDP_REC_ACCOUNT" value={IDRAM_ACCOUNT_ID} />
            <input type="hidden" name="EDP_DESCRIPTION" value="Polyglot Academy Purchase" />
            <input type="hidden" name="EDP_AMOUNT" value={amount} />
            <input type="hidden" name="EDP_BILL_NO" value={billNo || orderId || ''} />
            <input type="hidden" name="EDP_EMAIL" value={CUSTOMER_EMAIL} />
            <input type="hidden" name="SUCCESS_URL" value={successUrl || `${BASE_URL}/payment/success?orderId=${orderId}`} />
            <input type="hidden" name="FAIL_URL" value={failUrl || `${BASE_URL}/payment/fail?orderId=${orderId}`} />
            <input type="hidden" name="RESULT_URL" value={resultUrl || `${BASE_URL}/api/payment/result`} />
        </form>
    );
}

export function IdramPaymentProcessor({ paymentData, setPaymentStatus }) {
    useEffect(() => {
        // Ստուգում, որ paymentData-ն գոյություն ունի և վավեր է
        if (!paymentData || (!paymentData.billNo && !paymentData.orderId)) {
            console.error('Missing required payment data for Idram');
            setPaymentStatus({
                success: false,
                error: 'Order ID or bill number is required for Idram payments'
            });
            return;
        }

        console.log('Idram payment processor initialized with:', paymentData);
        // Ոչինչ չենք անում այստեղ, քանի որ IdramPaymentForm-ը արդեն կատարում է ավտոմատ ներկայացում
    }, [paymentData, setPaymentStatus]);

    return (
        <IdramPaymentForm
            amount={paymentData.amount}
            billNo={paymentData.billNo}
            orderId={paymentData.orderId}
            successUrl={`${BASE_URL}/payment/success?orderId=${paymentData.orderId}`}
            failUrl={`${BASE_URL}/payment/fail?orderId=${paymentData.orderId}`}
        />
    );
}