import React, { useEffect, useRef, useState } from 'react';
import { BASE_URL } from './PaymentConfig';
import CryptoJS from 'crypto-js';


const TELCELL_CONFIG = {
    formAction: 'https://telcellmoney.am/invoices',
    issuer: 'davitkirakosyan99@gmail.com',
    currency: '֏',
    valid_days: 10,
    shop_key: process.env.REACT_APP_TELCELL_SHOP_KEY || 'YOUR_TELCELL_SHOP_KEY'
};

console.log('SHOP KEY:', process.env.REACT_APP_TELCELL_SHOP_KEY);

// Base64 encoding function
const base64encode = (str) => {
    try {
        return typeof window !== 'undefined' ?
            window.btoa(unescape(encodeURIComponent(str))) :
            Buffer.from(str).toString('base64');
    } catch (error) {
        console.error('Base64 encoding error:', error);
        return '';
    }
};

// Telcell security code generation with MD5
const getTelcellSecurityCode = (shop_key, issuer, currency, price, product, issuer_id, valid_days) => {
    if (!shop_key || !issuer || !currency || !price || !product || !issuer_id || !valid_days) {
        console.error('Missing required parameters for security code generation:', {
            shop_key: !!shop_key,
            issuer: !!issuer,
            currency: !!currency,
            price: !!price,
            product: !!product,
            issuer_id: !!issuer_id,
            valid_days: !!valid_days
        });
        return '';
    }

    try {
        // Create the hash string according to Telcell documentation
        const hashString = shop_key + issuer + currency + price + product + issuer_id + valid_days;
        console.log('Security code hash string:', hashString);

        // Generate MD5 hash
        const securityCode = CryptoJS.MD5(hashString).toString();
        console.log('Generated security code:', securityCode);

        return securityCode;
    } catch (error) {
        console.error('Error generating security code:', error);
        return '';
    }
};

export function TelcellPaymentForm({
                                       amount,
                                       billNo,
                                       orderId,
                                       successUrl,
                                       failUrl,
                                       resultUrl,
                                       product = "Polyglot Academy Purchase"
                                   }) {
    const formRef = useRef(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isValidAmount = amount && amount > 0;
    const isConfigured = TELCELL_CONFIG.shop_key !== 'YOUR_TELCELL_SHOP_KEY';

    const encodedProduct = isValidAmount ? base64encode(product) : '';
    const encodedOrderId = isValidAmount ? base64encode(billNo || orderId || '') : '';
    const normalizedAmount = isValidAmount ? Math.round(parseFloat(amount)) : 0;

    const securityCode = (isValidAmount && isConfigured) ? getTelcellSecurityCode(
        TELCELL_CONFIG.shop_key,
        TELCELL_CONFIG.issuer,
        TELCELL_CONFIG.currency,
        normalizedAmount.toString(),
        encodedProduct,
        encodedOrderId,
        TELCELL_CONFIG.valid_days.toString()
    ) : '';

    useEffect(() => {
        if (formRef.current && isValidAmount && isConfigured && securityCode && !isSubmitting) {
            console.log('Submitting Telcell form automatically');
            console.log('Form data:', {
                action: 'PostInvoice',
                issuer: TELCELL_CONFIG.issuer,
                currency: TELCELL_CONFIG.currency,
                price: normalizedAmount,
                product: encodedProduct,
                issuer_id: encodedOrderId,
                valid_days: TELCELL_CONFIG.valid_days,
                lang: 'en',
                security_code: securityCode,
                success_url: successUrl || `${BASE_URL}/payment/success?orderId=${orderId}`,
                fail_url: failUrl || `${BASE_URL}/payment/fail?orderId=${orderId}`,
                result_url: resultUrl || `${BASE_URL}/api/payment/result`
            });

            setIsSubmitting(true);
            // Small delay to ensure form is fully rendered
            setTimeout(() => {
                formRef.current.submit();
            }, 100);
        }
    }, [isValidAmount, isConfigured, securityCode, normalizedAmount, encodedProduct, encodedOrderId, isSubmitting, successUrl, failUrl, resultUrl, orderId]);

    if (!isValidAmount) {
        return (
            <div style={{ padding: '20px', textAlign: 'center', color: '#d32f2f' }}>
                <h3>Payment Error</h3>
                <p>Invalid payment amount: {amount}</p>
            </div>
        );
    }

    if (!isConfigured) {
        return (
            <div style={{ padding: '20px', textAlign: 'center', color: '#d32f2f' }}>
                <h3>Payment System Not Configured</h3>
                <p>Please contact support to resolve this issue.</p>
                <div style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
                    Error: REACT_APP_TELCELL_SHOP_KEY not configured
                </div>
            </div>
        );
    }

    if (!securityCode) {
        return (
            <div style={{ padding: '20px', textAlign: 'center', color: '#d32f2f' }}>
                <h3>Payment Error</h3>
                <p>Failed to generate payment security code. Please try again.</p>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h3>Processing Payment...</h3>
            <p>Redirecting to Telcell payment gateway...</p>
            <div style={{ margin: '20px 0' }}>
                <div style={{
                    display: 'inline-block',
                    width: '40px',
                    height: '40px',
                    border: '4px solid #f3f3f3',
                    borderTop: '4px solid #3498db',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }}></div>
            </div>
            <p style={{ fontSize: '14px', color: '#666' }}>
                Amount: {normalizedAmount} {TELCELL_CONFIG.currency}<br/>
                Order ID: {orderId || billNo}
            </p>

            <form
                ref={formRef}
                action={TELCELL_CONFIG.formAction}
                method="POST"
                id="telcellPaymentForm"
                style={{ display: 'none' }}
            >
                <input type="hidden" name="action" value="PostInvoice" />
                <input type="hidden" name="issuer" value={TELCELL_CONFIG.issuer} />
                <input type="hidden" name="currency" value={TELCELL_CONFIG.currency} />
                <input type="hidden" name="price" value={normalizedAmount} />
                <input type="hidden" name="product" value={encodedProduct} />
                <input type="hidden" name="issuer_id" value={encodedOrderId} />
                <input type="hidden" name="valid_days" value={TELCELL_CONFIG.valid_days} />
                <input type="hidden" name="lang" value="en" />
                <input type="hidden" name="security_code" value={securityCode} />

                <input type="hidden" name="success_url" value={successUrl || `${BASE_URL}/payment/success?orderId=${orderId}`} />
                <input type="hidden" name="fail_url" value={failUrl || `${BASE_URL}/payment/fail?orderId=${orderId}`} />
                <input type="hidden" name="result_url" value={resultUrl || `${BASE_URL}/api/payment/result`} />
            </form>

            <style jsx>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}

export function TelcellPaymentProcessor({ paymentData, setPaymentStatus }) {
    const [processingStatus, setProcessingStatus] = useState('initializing');

    useEffect(() => {
        console.log('TelcellPaymentProcessor received paymentData:', paymentData);

        if (!paymentData) {
            console.error('No payment data provided');
            setPaymentStatus({
                success: false,
                error: 'No payment data provided'
            });
            setProcessingStatus('error');
            return;
        }

        if (!paymentData.billNo && !paymentData.orderId) {
            console.error('Missing required payment data for Telcell: orderId or billNo');
            setPaymentStatus({
                success: false,
                error: 'Order ID or bill number is required for Telcell payments'
            });
            setProcessingStatus('error');
            return;
        }

        if (!paymentData.amount || parseFloat(paymentData.amount) <= 0) {
            console.error('Invalid amount in payment data:', paymentData.amount);
            setPaymentStatus({
                success: false,
                error: 'Invalid payment amount'
            });
            setProcessingStatus('error');
            return;
        }

        console.log('Telcell payment processor initialized successfully with:', {
            orderId: paymentData.orderId,
            billNo: paymentData.billNo,
            amount: paymentData.amount,
            type: paymentData.type
        });

        setProcessingStatus('ready');

        // Set initial status as processing
        setPaymentStatus({
            success: false,
            processing: true,
            message: 'Initializing Telcell payment...'
        });

    }, [paymentData, setPaymentStatus]);

    if (processingStatus === 'error') {
        return (
            <div style={{ padding: '20px', textAlign: 'center', color: '#d32f2f' }}>
                <h3>Payment Processing Error</h3>
                <p>Unable to process payment. Please try again.</p>
            </div>
        );
    }

    if (processingStatus === 'initializing') {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <h3>Initializing Payment...</h3>
                <p>Please wait while we prepare your payment.</p>
            </div>
        );
    }

    return (
        <TelcellPaymentForm
            amount={paymentData.amount}
            billNo={paymentData.billNo}
            orderId={paymentData.orderId}
            successUrl={`${BASE_URL}/payment/success?orderId=${paymentData.orderId}`}
            failUrl={`${BASE_URL}/payment/fail?orderId=${paymentData.orderId}`}
            resultUrl={`${BASE_URL}/api/payment/result`}
            product="Polyglot Academy Purchase"
        />
    );
}

// Helper function to validate Telcell configuration
export const validateTelcellConfig = () => {
    const issues = [];

    if (!TELCELL_CONFIG.shop_key || TELCELL_CONFIG.shop_key === 'YOUR_TELCELL_SHOP_KEY') {
        issues.push('Shop key not configured');
    }

    if (!TELCELL_CONFIG.issuer || !TELCELL_CONFIG.issuer.includes('@')) {
        issues.push('Invalid issuer email');
    }

    if (!TELCELL_CONFIG.formAction || !TELCELL_CONFIG.formAction.startsWith('https://')) {
        issues.push('Invalid form action URL');
    }

    return {
        isValid: issues.length === 0,
        issues: issues
    };
};

// Export configuration for debugging
export const getTelcellConfig = () => ({
    ...TELCELL_CONFIG,
    shop_key: TELCELL_CONFIG.shop_key ? '[CONFIGURED]' : '[NOT CONFIGURED]'
});

export default TelcellPaymentProcessor;