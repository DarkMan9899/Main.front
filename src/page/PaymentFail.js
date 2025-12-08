import React from "react";
import "../styles/PaymentResult.css"

export default function PaymentFail() {
    return (
        <div className="payment-result fail">
            <h1>Վճարումը չհաջողվեց ❌</h1>
            <p>Խնդրում ենք փորձել կրկին կամ կապվել մեզ հետ։</p>
            <a href="/" className="btn">Վերադառնալ գլխավոր էջ</a>
        </div>
    );
}
