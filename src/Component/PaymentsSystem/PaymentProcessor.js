import { IdramPaymentProcessor } from './IdramPayment';
import { AmeriaPaymentProcessor, AmeriaCardPaymentRedirect } from './AmeriaPayment';
import { TelcellPaymentProcessor } from './TelcellPayment';

export function PaymentProcessor({ paymentType, paymentData, setPaymentStatus }) {
    console.log("🟣 PAYMENT PROCESSOR TRIGGERED");
    console.log("🟣 TYPE:", paymentType);
    console.log("🟣 DATA:", paymentData);

    // 🔥 Redirect happens ONLY here — not in CartPage
    if (
        (paymentType === "card" || paymentType === "ameria_pay") &&
        paymentData?.paymentLink
    ) {
        console.log("🔵 REDIRECTING TO:", paymentData.paymentLink);
        window.location.href = paymentData.paymentLink;
        return null;
    }

    // 🔥 For processors that stay inside the website
    switch (paymentType) {
        case 'idram':
            return (
                <IdramPaymentProcessor
                    paymentData={paymentData}
                    setPaymentStatus={setPaymentStatus}
                />
            );

        case 'ameria_pay':
            return (
                <AmeriaPaymentProcessor
                    paymentData={paymentData}
                    setPaymentStatus={setPaymentStatus}
                />
            );

        case 'card':
            return (
                <AmeriaCardPaymentRedirect
                    paymentLink={paymentData.paymentLink}
                />
            );

        case 'telcell':
            return (
                <TelcellPaymentProcessor
                    paymentData={paymentData}
                    setPaymentStatus={setPaymentStatus}
                />
            );

        default:
            return null;
    }
}
