import React from 'react';
import { IdramPaymentProcessor } from './IdramPayment';
import { AmeriaPaymentProcessor } from './AmeriaPayment';
import { TelcellPaymentProcessor } from './TelcellPayment';

export function PaymentProcessor({ paymentType, paymentData, setPaymentStatus }) {
    switch (paymentType) {
        case 'idram':
            return <IdramPaymentProcessor paymentData={paymentData} setPaymentStatus={setPaymentStatus} />;
        case 'card':
        case 'ameria_pay':
            return <AmeriaPaymentProcessor paymentData={paymentData} setPaymentStatus={setPaymentStatus} />;
        case 'telcell':
            return <TelcellPaymentProcessor paymentData={paymentData} setPaymentStatus={setPaymentStatus} />;
        default:
            return null;
    }
}