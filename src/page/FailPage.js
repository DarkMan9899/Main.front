import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../styles/FailPage.css";

function FailPage() {
    const { t } = useTranslation("paymentFail");
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const orderId = searchParams.get("orderId");

    const contactSupport = () => {
        window.open("mailto:support@polyglotacademy.am");
    };

    return (
        <div className="payment-fail-container">
            <div className="modal-overlay">
                <div className="modal-box fail-modal">
                    <div className="fail-icon">❌</div>

                    <h2>{t("fail.title")}</h2>
                    <p>{t("fail.subtitle")}</p>

                    {orderId && (
                        <div className="payment-details">
                            <div className="detail-item">
                                <strong>{t("fail.order")}</strong>
                                <span>#{orderId}</span>
                            </div>
                        </div>
                    )}

                    <div className="action-buttons">
                        <button
                            className="btn-retry"
                            onClick={() => navigate(-1)}
                        >
                            {t("fail.tryAgain")}
                        </button>

                        <button
                            className="btn-primary"
                            onClick={() => navigate("/")}
                        >
                            {t("fail.home")}
                        </button>

                        <button
                            className="btn-secondary"
                            onClick={contactSupport}
                        >
                            {t("fail.contact")}
                        </button>
                    </div>

                    <p className="hint">
                        {t("fail.hint")}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default FailPage;
