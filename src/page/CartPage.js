// CartPage.js - Main checkout component
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/CartPage.css';
import { API_URL_Cart_Page } from '../api';
import { BASE_URL } from '../Component/PaymentsSystem/PaymentConfig';

// Import our components
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

    // API client with timeout
    const apiClient = axios.create({
        timeout: 15000, // 15 seconds timeout
        headers: {
            'Content-Type': 'application/json',
        }
    });

    // Calculate total amount - memoized to avoid recalculation on every render
    const totalAmount = useMemo(() => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
    }, [cart]);

    // Check if cart is empty
    const isCartEmpty = cart.length === 0;

    // Check if the form is valid before proceeding
    const isFormValid = useMemo(() => {
        return (
            customerInfo.name.trim() &&
            customerInfo.surname.trim() &&
            customerInfo.phone.trim() &&
            parseFloat(totalAmount) > 0
        );
    }, [customerInfo, totalAmount]);

    // Form validation
    const validateForm = () => {
        const errors = {};

        if (!customerInfo.name.trim()) {
            errors.name = 'Name is required';
        }

        if (!customerInfo.surname.trim()) {
            errors.surname = 'Surname is required';
        }

        if (!customerInfo.phone.trim()) {
            errors.phone = 'Phone number is required';
        } else if (!/^\+374\d{8}$/.test(customerInfo.phone.trim())) {
            errors.phone = 'Please enter a valid Armenian phone number (e.g., +37499123456)';
        }

        if (isCartEmpty) {
            errors.cart = 'Your cart is empty';
        }

        if (parseFloat(totalAmount) <= 0) {
            errors.amount = 'Total amount must be greater than 0';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Handle input changes for form fields
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCustomerInfo(prevInfo => ({ ...prevInfo, [name]: value }));

        // Clear validation error when user starts typing
        if (validationErrors[name]) {
            setValidationErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    // Handle initial payment button click - open confirmation modal
    const handlePayment = () => {
        if (validateForm()) {
            setModalOpen(true);
        }
    };

    // Process the payment after confirmation
    const confirmPayment = async () => {
        try {
            setIsLoading(true);
            setPaymentStatus({ success: false, error: null });

            // Prepare order data
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

            console.log('Sending order data:', orderData);

            const response = await apiClient.post(API_URL_Cart_Page, orderData);
            console.log('Server response:', response.data);

            if (!response.data) {
                throw new Error('No data received from server');
            }

            const { orderId, billNo, paymentLink } = response.data;

            setPaymentData({
                orderId,
                billNo: billNo || orderId,
                paymentLink,
                amount: totalAmount
            });

        } catch (error) {
            console.error('🔴 Error Confirming Payment:', error);
            setPaymentStatus({
                success: false,
                error: error.response?.data?.message || error.message || 'There was an issue submitting your order. Please try again.',
            });
        } finally {
            setIsLoading(false);
            setModalOpen(false);
        }
    };

    const cancelPayment = () => {
        setModalOpen(false);
    };

    // Render payment processor when payment data is available
    const renderPaymentProcessor = () => {
        if (paymentData.orderId || paymentData.billNo || paymentData.paymentLink) {
            return (
                <PaymentProcessor
                    paymentType={customerInfo.paymentType}
                    paymentData={paymentData}
                    setPaymentStatus={setPaymentStatus}
                />
            );
        }
        return null;
    };

    const renderCustomerForm = () => {
        return (
            <div className="customer-info">
                <h3>Customer Information</h3>
                <div className={`input-group ${validationErrors.name ? 'has-error' : ''}`}>
                    <label htmlFor="name">Name *</label>
                    <input
                        id="name"
                        type="text"
                        name="name"
                        placeholder="Your name"
                        value={customerInfo.name}
                        onChange={handleInputChange}
                    />
                    {validationErrors.name && <div className="error-text">{validationErrors.name}</div>}
                </div>
                <div className={`input-group ${validationErrors.surname ? 'has-error' : ''}`}>
                    <label htmlFor="surname">Surname *</label>
                    <input
                        id="surname"
                        type="text"
                        name="surname"
                        placeholder="Your surname"
                        value={customerInfo.surname}
                        onChange={handleInputChange}
                    />
                    {validationErrors.surname && <div className="error-text">{validationErrors.surname}</div>}
                </div>
                <div className={`input-group ${validationErrors.phone ? 'has-error' : ''}`}>
                    <label htmlFor="phone">Phone Number *</label>
                    <input
                        id="phone"
                        type="text"
                        name="phone"
                        placeholder="Armenian phone number (e.g., +37499123456)"
                        value={customerInfo.phone}
                        onChange={handleInputChange}
                    />
                    {validationErrors.phone && <div className="error-text">{validationErrors.phone}</div>}
                </div>
                <div className="input-group">
                    <label htmlFor="paymentType">Payment Method *</label>
                    <select
                        id="paymentType"
                        name="paymentType"
                        value={customerInfo.paymentType}
                        onChange={handleInputChange}
                        className="payment-select"
                    >
                        <option value="idram">Idram</option>
                        <option value="card">Card</option>
                        <option value="ameria_pay">MyAmeria Pay</option>
                        <option value="telcell">Telcell</option>
                    </select>
                </div>
            </div>
        );
    };

    const renderOrderSummary = () => {
        return (
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
    };

    const renderPaymentStatusMessages = () => {
        if (paymentStatus.error) {
            return (
                <div className="payment-message error">
                    <p className="error-message">{paymentStatus.error}</p>
                    <button
                        className="try-again-btn"
                        onClick={() => {
                            setPaymentStatus({ success: false, error: null });
                            setPaymentData({
                                orderId: null,
                                billNo: null,
                                paymentLink: null,
                                amount: 0
                            });
                        }}
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
                        {paymentStatus.message || 'Payment Successful!'}
                    </p>
                    <button
                        className="continue-shopping"
                        onClick={() => navigate('/products')}
                    >
                        Continue Shopping
                    </button>
                </div>
            );
        }

        return null;
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
                            <p>Please add some products to your cart before checkout.</p>
                            <button
                                className="continue-shopping"
                                onClick={() => navigate('/products')}
                            >
                                Continue Shopping
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