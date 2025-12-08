// CartPage.js - Main checkout component - PRODUCTION READY
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/CartPage.css';

import { API_URL_Cart_Page } from '../api';

import { CartItemsList } from '../Component/PaymentsSystem/CartItemsList';
import { OrderConfirmationModal } from '../Component/PaymentsSystem/OrderConfirmationModal';
import { PaymentProcessor } from '../Component/PaymentsSystem/PaymentProcessor';
import { PaymentStatusChecker } from '../Component/PaymentsSystem/PaymentStatusChecker';
import { PaymentRedirectHandler } from '../Component/PaymentsSystem/PaymentRedirectHandler';

function CartPage({ cart, updateQuantity, removeItem }) {
    const navigate = useNavigate();

    // Customer information state
    const [customerInfo, setCustomerInfo] = useState({
        name: '',
        surname: '',
        phone: '',
        paymentType: 'idram',
    });

    // UI states
    const [modalOpen, setModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});

    // Payment states
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

    // API client
    const apiClient = axios.create({
        timeout: 15000,
        headers: { 'Content-Type': 'application/json' }
    });

    // Calculate total amount
    const totalAmount = useMemo(() => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
    }, [cart]);

    const isCartEmpty = cart.length === 0;

    // Form validation
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

        if (!customerInfo.name.trim()) errors.name = 'Name is required';
        if (!customerInfo.surname.trim()) errors.surname = 'Surname is required';

        if (!customerInfo.phone.trim()) {
            errors.phone = 'Phone number is required';
        } else if (!/^\+374\d{8}$/.test(customerInfo.phone.trim())) {
            errors.phone = 'Please enter a valid Armenian phone number (e.g., +37499123456)';
        }

        if (isCartEmpty) errors.cart = 'Your cart is empty';
        if (parseFloat(totalAmount) <= 0) errors.amount = 'Total amount must be greater than 0';

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCustomerInfo(prev => ({ ...prev, [name]: value }));

        if (validationErrors[name]) {
            setValidationErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    // Show confirmation modal
    const handlePayment = () => {
        if (validateForm()) setModalOpen(true);
    };

    // ✅ ENHANCED PAYMENT CONFIRMATION WITH IMMEDIATE REDIRECT
    const confirmPayment = async () => {
        console.log("🟡 CONFIRM PAYMENT STARTED");

        try {
            setIsLoading(true);
            setPaymentStatus({ success: false, error: null });

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

            console.log("🟡 Sending order data:", orderData);

            const response = await apiClient.post(API_URL_Cart_Page, orderData);

            console.log("🟡 Server response:", response.data);

            if (!response.data) throw new Error('No data from server');

            // ✅ CORRECT DATA EXTRACTION
            const { orderId, payment } = response.data;
            const paymentLink = payment?.paymentLink;
            const billNo = orderId;

            console.log("🟡 Extracted payment data:", { orderId, billNo, paymentLink });

            // ✅ SET PAYMENT DATA
            setPaymentData({
                orderId,
                billNo,
                paymentLink,
                amount: totalAmount
            });

            // ⭐ IMMEDIATE REDIRECT FOR CARD AND AMERIAPAY PAYMENTS
            if (paymentLink && (customerInfo.paymentType === 'card' || customerInfo.paymentType === 'ameriapay')) {
                console.log("🔵 IMMEDIATE REDIRECT TO:", paymentLink);

                // Small delay to ensure state is set before redirect
                setTimeout(() => {
                    window.location.href = paymentLink;
                }, 100);

                return; // Exit function to prevent further processing
            }

            // ✅ FOR IDRAM/TELCELL - Let PaymentProcessor handle it
            if (paymentLink && (customerInfo.paymentType === 'idram' || customerInfo.paymentType === 'telcell')) {
                console.log("💳 Payment data set for processor:", {
                    paymentType: customerInfo.paymentType,
                    paymentLink: paymentLink
                });
            }

            // ✅ SUCCESS STATE
            setPaymentStatus({
                success: true,
                message: `${customerInfo.paymentType.toUpperCase()} payment initiated successfully`
            });

        } catch (error) {
            console.error("🔴 PAYMENT ERROR:", error);

            setPaymentStatus({
                success: false,
                error: error.response?.data?.message || error.message || 'Payment initialization failed'
            });
        } finally {
            setIsLoading(false);
            setModalOpen(false);
        }
    };

    const cancelPayment = () => setModalOpen(false);

    /** ------------------------
     *  COMPONENT RENDER SECTIONS
     ---------------------------*/

    const renderCustomerForm = () => (
        <div className="customer-info">
            <h3>Customer Information</h3>

            <div className={`input-group ${validationErrors.name ? 'has-error' : ''}`}>
                <label>Name *</label>
                <input
                    name="name"
                    value={customerInfo.name}
                    onChange={handleInputChange}
                    placeholder="Enter your first name"
                />
                {validationErrors.name && <div className="error-text">{validationErrors.name}</div>}
            </div>

            <div className={`input-group ${validationErrors.surname ? 'has-error' : ''}`}>
                <label>Surname *</label>
                <input
                    name="surname"
                    value={customerInfo.surname}
                    onChange={handleInputChange}
                    placeholder="Enter your last name"
                />
                {validationErrors.surname && <div className="error-text">{validationErrors.surname}</div>}
            </div>

            <div className={`input-group ${validationErrors.phone ? 'has-error' : ''}`}>
                <label>Phone *</label>
                <input
                    name="phone"
                    value={customerInfo.phone}
                    onChange={handleInputChange}
                    placeholder="+37477123456"
                />
                {validationErrors.phone && <div className="error-text">{validationErrors.phone}</div>}
            </div>

            <div className="input-group">
                <label>Payment Method *</label>
                <select name="paymentType" value={customerInfo.paymentType} onChange={handleInputChange}>
                    <option value="idram">💳 Idram Digital Wallet</option>
                    <option value="card">🏦 Bank Card (Ameria Bank)</option>
                    <option value="ameriapay">📱 MyAmeria Pay</option>
                    <option value="telcell">📞 Telcell Payment</option>
                </select>
            </div>
        </div>
    );

    const renderOrderSummary = () => (
        <div className="cart-totals">
            <h3>Order Summary</h3>

            <div className="total-row">
                <span>Subtotal</span>
                <span>{totalAmount} AMD</span>
            </div>

            <div className="total-row total-amount">
                <span>Total</span>
                <span>{totalAmount} AMD</span>
            </div>

            <button
                className="proceed-to-checkout"
                onClick={handlePayment}
                disabled={!isFormValid || isLoading || isCartEmpty}
            >
                {isLoading ? 'Processing...' : 'Proceed To Checkout'}
            </button>

            {validationErrors.cart && <div className="error-text center">{validationErrors.cart}</div>}
            {validationErrors.amount && <div className="error-text center">{validationErrors.amount}</div>}
        </div>
    );

    const renderPaymentStatusMessages = () => {
        if (paymentStatus.error) {
            return (
                <div className="payment-message error">
                    <p className="error-message">❌ {paymentStatus.error}</p>
                    <button
                        onClick={() => setPaymentStatus({ success: false, error: null, message: null })}
                        className="retry-button"
                    >
                        Try Again
                    </button>
                </div>
            );
        }

        if (paymentStatus.success) {
            return (
                <div className="payment-message success">
                    <p className="success-message">
                        ✅ {paymentStatus.message || 'Payment Successful!'}
                    </p>
                </div>
            );
        }

        return null;
    };

    const renderPaymentProcessor = () => {
        // Only show PaymentProcessor for Idram/Telcell (non-redirect payments)
        if (!paymentData.paymentLink || !paymentData.orderId) return null;

        if (customerInfo.paymentType === 'card' || customerInfo.paymentType === 'ameriapay') {
            // These are handled by immediate redirect, no processor needed
            return null;
        }

        return (
            <PaymentProcessor
                paymentType={customerInfo.paymentType}
                paymentData={paymentData}
                setPaymentStatus={setPaymentStatus}
            />
        );
    };

    return (
        <>
            <div className="cart-page">
                <h2>Your Cart</h2>
            </div>

            <div className="container">
                <div className="cart-page-container">
                    {isCartEmpty ? (
                        <div className="empty-cart-message">
                            <h3>Your cart is empty</h3>
                            <p>Add some courses to get started with your learning journey!</p>
                            <button className="continue-shopping" onClick={() => navigate('/products')}>
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        <CartItemsList cart={cart} updateQuantity={updateQuantity} removeItem={removeItem} />
                    )}

                    <div className="checkout-section">
                        {renderCustomerForm()}
                        {renderOrderSummary()}
                        {renderPaymentStatusMessages()}
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