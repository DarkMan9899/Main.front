import { IdramPaymentProcessor } from './IdramPayment';
import { AmeriaPaymentProcessor, AmeriaCardPaymentRedirect } from './AmeriaPayment';
import { TelcellPaymentProcessor } from './TelcellPayment';

export function PaymentProcessor({ paymentType, paymentData, setPaymentStatus }) {
    console.log("🟣 PAYMENT PROCESSOR TRIGGERED");
    console.log("🟣 TYPE:", paymentType);
    console.log("🟣 DATA:", paymentData);

    // Redirect for external payment pages
    if (
        (paymentType === "card" || paymentType === "ameriapay") &&
        paymentData?.paymentLink
    ) {
        console.log("🔵 REDIRECTING TO:", paymentData.paymentLink);
        window.location.href = paymentData.paymentLink;
        return null;
    }

    // Processors that stay inside website
    switch (paymentType) {
        case "idram":
            return (
                <IdramPaymentProcessor
                    paymentData={paymentData}
                    setPaymentStatus={setPaymentStatus}
                />
            );

        case "ameriapay":
            return (
                <AmeriaPaymentProcessor
                    paymentData={paymentData}
                    setPaymentStatus={setPaymentStatus}
                />
            );

        case "card":
            return <AmeriaCardPaymentRedirect paymentLink={paymentData.paymentLink} />;

        case "telcell":
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
