import React from 'react';
import { useTranslation } from 'react-i18next';

export function OrderConfirmationModal({
                                           modalOpen,
                                           customerInfo,
                                           totalAmount,
                                           confirmPayment,
                                           cancelPayment,
                                           isLoading
                                       }) {
    const { t } = useTranslation();

    if (!modalOpen) return null;

    const getPaymentLabel = () => {
        switch (customerInfo.paymentType) {
            case 'idram':
                return t("cart.payment.idram");
            case 'card':
                return t("cart.payment.card");
            case 'ameriapay':
                return t("cart.payment.ameriapay");
            case 'telcell':
                return t("cart.payment.telcell");
            default:
                return '';
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-box">
                <h3>{t("orderConfirm.title")}</h3>

                <p className="modal-subtitle">
                    {t("orderConfirm.subtitle")}
                </p>

                <div className="confirmation-details">
                    <div className="confirm-row">
                        <span>{t("orderConfirm.name")}</span>
                        <strong>{customerInfo.name} {customerInfo.surname}</strong>
                    </div>

                    <div className="confirm-row">
                        <span>{t("orderConfirm.phone")}</span>
                        <strong>{customerInfo.phone}</strong>
                    </div>

                    <div className="confirm-row">
                        <span>{t("orderConfirm.payment")}</span>
                        <strong>{getPaymentLabel()}</strong>
                    </div>

                    <div className="confirm-row total">
                        <span>{t("orderConfirm.total")}</span>
                        <strong>{totalAmount} ֏</strong>
                    </div>
                </div>

                <div className="modal-buttons">
                    <button
                        className="confirm-button"
                        onClick={confirmPayment}
                        disabled={isLoading}
                    >
                        {isLoading
                            ? t("orderConfirm.processing")
                            : t("orderConfirm.confirm")}
                    </button>

                    <button
                        className="cancel-button"
                        onClick={cancelPayment}
                        disabled={isLoading}
                    >
                        {t("orderConfirm.cancel")}
                    </button>
                </div>
            </div>
        </div>
    );
}
