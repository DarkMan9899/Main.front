// CartPage.js — FULL I18N PRODUCTION VERSION
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { track } from '../utils/analytics';


import '../styles/CartPage.css';
import { API_URL_Cart_Page } from '../api';

import { CartItemsList } from '../Component/PaymentsSystem/CartItemsList';
import { OrderConfirmationModal } from '../Component/PaymentsSystem/OrderConfirmationModal';
import { PaymentProcessor } from '../Component/PaymentsSystem/PaymentProcessor';
import { PaymentStatusChecker } from '../Component/PaymentsSystem/PaymentStatusChecker';
import { PaymentRedirectHandler } from '../Component/PaymentsSystem/PaymentRedirectHandler';
import logoPay1 from "../Img/logoPay/logoner 120x35px 1.png";
import logoPay2 from "../Img/logoPay/logoner 120x35px 2.png";
import logoPay3 from "../Img/logoPay/logoner 120x35px 3.png";
import logoPay4 from "../Img/logoPay/logoner 120x35px 4.png";
import logoPay5 from "../Img/logoPay/logoner 120x35px 5.png";
import logoPay6 from "../Img/logoPay/logoner 120x35px 6.png";
import logoPay7 from "../Img/logoPay/MyAmeria.svg";




function CartPage({ cart, updateQuantity, removeItem }) {
    const { t } = useTranslation();
    const navigate = useNavigate();

    /* ---------------- CUSTOMER INFO ---------------- */
    const [customerInfo, setCustomerInfo] = useState({
        name: '',
        surname: '',
        phone: '',
        paymentType: 'idram'
    });

    /* ---------------- UI STATES ---------------- */
    const [modalOpen, setModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});

    /* ---------------- PAYMENT STATES ---------------- */
    const [paymentStatus, setPaymentStatus] = useState({
        success: false,
        error: null,
        message: null
    });

    const [paymentData, setPaymentData] = useState({
        orderId: null,
        billNo: null,
        paymentLink: null,
        amount: 0
    });

    /* ---------------- API CLIENT ---------------- */
    const apiClient = axios.create({
        timeout: 15000,
        headers: { 'Content-Type': 'application/json' }
    });

    /* ---------------- TOTAL AMOUNT ---------------- */
    const totalAmount = useMemo(() => {
        return cart
            .reduce((total, item) => total + item.price * item.quantity, 0)
            .toFixed(2);
    }, [cart]);

    const isCartEmpty = cart.length === 0;

    /* ---------------- FORM VALIDATION ---------------- */
    const isFormValid = useMemo(() => {
        return (
            customerInfo.name.trim() &&
            customerInfo.surname.trim() &&
            customerInfo.phone.trim() &&
            parseFloat(totalAmount) > 0
        );
    }, [customerInfo, totalAmount]);

    const validateForm = () => {
        const errors = {};

        if (!customerInfo.name.trim()) errors.name = t("cart.errors.name");
        if (!customerInfo.surname.trim()) errors.surname = t("cart.errors.surname");

        const phone = customerInfo.phone.trim();

        if (!phone) {
            errors.phone = t("cart.errors.phone_required");
        } else if (!/^\+\d{8,15}$/.test(phone)) {
            errors.phone = t("cart.errors.phone_invalid");
        }

        if (isCartEmpty) errors.cart = t("cart.errors.cart_empty");
        if (parseFloat(totalAmount) <= 0) errors.amount = t("cart.errors.amount");

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };


    /* ---------------- INPUT HANDLER ---------------- */
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCustomerInfo(prev => ({ ...prev, [name]: value }));

        if (validationErrors[name]) {
            setValidationErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    /* ---------------- PAYMENT FLOW ---------------- */
    const handlePayment = () => {

        if (!validateForm()) return;

        // 📊 GOOGLE ANALYTICS — USER STARTED PAYMENT
        track("begin_checkout", {
            value: totalAmount,
            currency: "AMD",
            items: cart.map(item => ({
                item_id: item.id,
                item_name: item.name,
                price: item.price,
                quantity: item.quantity,
                tariff: item.displayType,
                billing: item.billing
            }))
        });

        setModalOpen(true);
    };


    const confirmPayment = async () => {
        try {
            setIsLoading(true);
            setPaymentStatus({ success: false, error: null, message: null });

            const orderData = {
                customer_name: customerInfo.name,
                customer_surname: customerInfo.surname,
                customer_phone: customerInfo.phone,
                cart: cart.map(item => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    selectedType: item.selectedType
                })),
                type: customerInfo.paymentType
            };

            const response = await apiClient.post(API_URL_Cart_Page, orderData);
            if (!response.data) throw new Error('No data from server');

            const { orderId, payment } = response.data;
            const paymentLink = payment?.paymentLink;

            setPaymentData({
                orderId,
                billNo: orderId,
                paymentLink,
                amount: totalAmount
            });

            if (
                paymentLink &&
                (customerInfo.paymentType === 'card' ||
                    customerInfo.paymentType === 'ameriapay')
            ) {
                setTimeout(() => {
                    window.location.href = paymentLink;
                }, 100);
                return;
            }

            setPaymentStatus({
                success: true,
                message: t("cart.payment_started")
            });

        } catch (error) {
            setPaymentStatus({
                success: false,
                error: error.response?.data?.message || error.message
            });
        } finally {
            setIsLoading(false);
            setModalOpen(false);
        }
    };

    const cancelPayment = () => setModalOpen(false);

    /* ---------------- RENDER HELPERS ---------------- */

    const renderCustomerForm = () => (
        <div className="customer-info">
            <h3>{t("cart.customer.title")}</h3>

            <div className={`input-group ${validationErrors.name ? 'has-error' : ''}`}>
                <label>{t("cart.customer.name")} *</label>
                <input
                    name="name"
                    value={customerInfo.name}
                    onChange={handleInputChange}
                    placeholder={t("cart.customer.name_placeholder")}
                />
                {validationErrors.name && <div className="error-text">{validationErrors.name}</div>}
            </div>

            <div className={`input-group ${validationErrors.surname ? 'has-error' : ''}`}>
                <label>{t("cart.customer.surname")} *</label>
                <input
                    name="surname"
                    value={customerInfo.surname}
                    onChange={handleInputChange}
                    placeholder={t("cart.customer.surname_placeholder")}
                />
                {validationErrors.surname && <div className="error-text">{validationErrors.surname}</div>}
            </div>

            <div className={`input-group ${validationErrors.phone ? 'has-error' : ''}`}>
                <label>{t("cart.customer.phone")} *</label>

                <PhoneInput
                    country={'am'}              // default Armenia
                    value={customerInfo.phone}
                    onChange={(value) =>
                        setCustomerInfo(prev => ({ ...prev, phone: `+${value}` }))
                    }
                    enableSearch
                    disableSearchIcon
                    countryCodeEditable={false}
                    inputProps={{
                        name: 'phone',
                        required: true,
                        autoFocus: false
                    }}
                    containerClass="phone-input-container"
                    inputClass="phone-input"
                    buttonClass="phone-input-flag"
                />

                {validationErrors.phone && (
                    <div className="error-text">{validationErrors.phone}</div>
                )}
            </div>

            <div className="input-group">
                <label>{t("cart.customer.payment_method")} *</label>
                <select name="paymentType" value={customerInfo.paymentType} onChange={handleInputChange}>
                    <option value="idram">💳 {t("cart.payment.idram")}</option>
                    <option value="card">🏦 {t("cart.payment.card")}</option>
                    <option value="ameriapay">📱 {t("cart.payment.ameriapay")}</option>
                    <option value="telcell">📞 {t("cart.payment.telcell")}</option>
                </select>
            </div>
        </div>
    );

    const renderOrderSummary = () => (
        <div className="cart-totals">
            <h3>{t("cart.summary.title")}</h3>

            <div className="total-row">
                <span>{t("cart.summary.subtotal")}</span>
                <span>{totalAmount} ֏</span>
            </div>

            <div className="total-row total-amount">
                <span>{t("cart.summary.total")}</span>
                <span>{totalAmount} ֏</span>
            </div>

            <button
                className="proceed-to-checkout"
                onClick={handlePayment}
                disabled={!isFormValid || isLoading || isCartEmpty}
            >
                {isLoading ? t("cart.processing") : t("cart.checkout")}
            </button>

            {validationErrors.cart && <div className="error-text center">{validationErrors.cart}</div>}
            {validationErrors.amount && <div className="error-text center">{validationErrors.amount}</div>}
        </div>
    );



    const renderPaymentMethods = () => (
        <div className="payment-methods">
            <h4>{t("cart.payment_methods.title")}</h4>

            <div className="payment-logos">
                <img src={logoPay1} alt="Mastercard" />
                <img src={logoPay2} alt="Visa" />
                <img src={logoPay3} alt="ArCa" />
                <img src={logoPay4} alt="Idram" />
                <img src={logoPay5} alt="PayLater" />
                <img src={logoPay7} alt="MyAmeria առցանց վճարում " />
                <img src={logoPay6} alt="Telcell Wallet" />
            </div>
        </div>
    );


    const renderPaymentProcessor = () => {
        if (!paymentData.paymentLink || !paymentData.orderId) return null;
        if (customerInfo.paymentType === 'card' || customerInfo.paymentType === 'ameriapay') return null;

        return (
            <PaymentProcessor
                paymentType={customerInfo.paymentType}
                paymentData={paymentData}
                setPaymentStatus={setPaymentStatus}
            />
        );
    };

    /* ---------------- RENDER ---------------- */

    return (
        <>
            <div className="cart-page">
                <h2>{t("cart.title")}</h2>
            </div>

            <div className="container">
                <div className="cart-page-container">
                    {isCartEmpty ? (
                        <div className="empty-cart-message">
                            <h3>{t("cart.empty.title")}</h3>
                            <p>{t("cart.empty.description")}</p>
                            <button
                                className="continue-shopping"
                                onClick={() => navigate('/products')}
                            >
                                {t("cart.empty.button")}
                            </button>
                        </div>
                    ) : (
                        <CartItemsList
                            cart={cart}
                            updateQuantity={updateQuantity}
                            removeItem={removeItem}
                        />
                    )}

                    <div className="checkout-section">
                        {renderCustomerForm()}
                        {renderOrderSummary()}
                        {renderPaymentMethods()}
                    </div>
                </div>
            </div>

            <OrderConfirmationModal
                modalOpen={modalOpen}
                customerInfo={customerInfo}
                totalAmount={totalAmount}
                confirmPayment={confirmPayment}
                cancelPayment={cancelPayment}
                isLoading={isLoading}
            />

            <PaymentStatusChecker setPaymentStatus={setPaymentStatus} />

            <PaymentRedirectHandler
                paymentType={customerInfo.paymentType}
                paymentLink={paymentData.paymentLink}
            />

            {renderPaymentProcessor()}
        </>
    );
}

export default CartPage;
