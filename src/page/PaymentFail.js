import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../styles/PaymentResult.css";

export default function PaymentFail() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const orderId = searchParams.get("orderId");
    const paymentId = searchParams.get("paymentID");

    return (
        <div className="payment-result fail">
            <h1>❌ Վճարումը չհաջողվեց</h1>

            <p>
                Վճարումը չի ավարտվել կամ հաստատումը չի ստացվել։
                Եթե ձեր քարտից գումար է գանձվել, խնդրում ենք կապվել մեզ հետ։
            </p>

            {orderId && (
                <p className="meta">
                    <strong>Պատվերի համար:</strong> #{orderId}
                </p>
            )}

            {paymentId && (
                <p className="meta">
                    <strong>Payment ID:</strong> {paymentId}
                </p>
            )}

            <div className="actions">
                <button className="btn primary" onClick={() => navigate("/")}>
                    Գլխավոր էջ
                </button>

                <a
                    className="btn secondary"
                    href={`mailto:support@polyglotacademy.am?subject=Payment issue order ${orderId || ""}`}
                >
                    Կապ աջակցման հետ
                </a>
            </div>
        </div>
    );
}
