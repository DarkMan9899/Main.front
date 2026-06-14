import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "../styles/PaymentResult.css";

export default function PaymentSuccess() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const orderId = searchParams.get("orderId");
    const paymentId = searchParams.get("paymentID");
    const paymentType = searchParams.get("paymentType");

    return (
        <div className="payment-result success">
            <div className="icon">✅</div>

            <h1>Վճարումը հաջողվեց</h1>
            <p>Ձեր վճարումը հաջողությամբ կատարվել է։</p>

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

            {paymentType && (
                <p className="meta">
                    <strong>Վճարման տեսակ:</strong> {paymentType}
                </p>
            )}

            <div className="actions">
                <button className="btn primary" onClick={() => navigate("/")}>
                    Գլխավոր էջ
                </button>

                <button className="btn secondary" onClick={() => navigate("/orders")}>
                    Իմ պատվերները
                </button>
            </div>
        </div>
    );
}
