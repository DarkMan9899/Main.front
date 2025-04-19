import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/CartPage.css';
import { API_URL_Cart_Page } from '../api';

const BASE_URL = process.env.REACT_APP_BASE_URL || 'https://polyglotacademy.am';
const IDRAM_ACCOUNT_ID = '100049302';
const PAYMENT_DESCRIPTION = 'Your purchase description';
const CUSTOMER_EMAIL = 'academy.polyglott@gmail.com';

// Payment configuration
const PAYMENT_CONFIG = {
    idram: {
        formAction: 'https://banking.idram.am/Payment/GetPayment',
        language: 'EN',
    },
    ameria: {
        merchantId: process.env.REACT_APP_AMERIA_MERCHANT_ID,
        terminalId: process.env.REACT_APP_AMERIA_TERMINAL_ID,
        merchantName: "PolyglotAcademy",
        appIdentifier: process.env.REACT_APP_AMERIA_APP_IDENTIFIER,
    }
};

// Separate component for Idram payment form
const IdramPaymentForm = ({ amount, billNo, orderId, successUrl, failUrl, resultUrl }) => {
    return (
        <form
            action={PAYMENT_CONFIG.idram.formAction}
            method="POST"
            id="idramPaymentForm"
        >
            <input type="hidden" name="EDP_LANGUAGE" value={PAYMENT_CONFIG.idram.language} />
            <input type="hidden" name="EDP_REC_ACCOUNT" value={IDRAM_ACCOUNT_ID} />
            <input type="hidden" name="EDP_DESCRIPTION" value="Polyglot Academy Purchase" />
            <input type="hidden" name="EDP_AMOUNT" value={amount} />
            <input type="hidden" name="EDP_BILL_NO" value={billNo || orderId || ''} />
            <input type="hidden" name="EDP_EMAIL" value={CUSTOMER_EMAIL} />
            <input type="hidden" name="SUCCESS_URL" value={successUrl || `${BASE_URL}/success`} />
            <input type="hidden" name="FAIL_URL" value={failUrl || `${BASE_URL}/fail`} />
            <input type="hidden" name="RESULT_URL" value={resultUrl || `${BASE_URL}/api/payment/result`} />
        </form>
    );
};

// Separate component for Ameria Card payment redirect
const AmeriaCardPaymentRedirect = ({ paymentLink }) => {
    useEffect(() => {
        if (paymentLink) {
            window.location.href = paymentLink;
        }
    }, [paymentLink]);

    return null;
};


// Main Cart Page Component
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
        paymentLink: null
    });

    // Reference for Idram form
    const idramFormRef = useRef(null);

    // API client with timeout
    const apiClient = axios.create({
        timeout: 15000, // 15 seconds timeout
        headers: {
            'Content-Type': 'application/json',
        }
    });

    // Check URL params for payment callback on mount
    useEffect(() => {
        const checkPaymentStatus = () => {
            const urlParams = new URLSearchParams(window.location.search);
            const status = urlParams.get('status');
            const transactionId = urlParams.get('transactionId');
            const paymentId = urlParams.get('paymentId');
            const errorMessage = urlParams.get('errorMessage');
            const orderId = urlParams.get('orderId');

            if (status) {
                // Handle payment callbacks
                if (status === 'success') {
                    setPaymentStatus({
                        success: true,
                        error: null,
                        message: `Payment successful! Transaction ID: ${transactionId || ''}, Payment ID: ${paymentId || ''}, Order ID: ${orderId || ''}`
                    });

                    // You might want to clear the cart here
                    // clearCart();
                } else if (status === 'failure') {
                    setPaymentStatus({
                        success: false,
                        error: errorMessage || 'Payment failed. Please try again.'
                    });
                }

                // Clean URL after processing
                if (window.history && window.history.replaceState) {
                    window.history.replaceState({}, document.title, window.location.pathname);
                }
            }
        };

        checkPaymentStatus();
    }, []);

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
    }, [customerInfo, isCartEmpty, totalAmount]);


    // Form validation
    const validateForm = () => {
        const errors = {};

        if (!customerInfo.name.trim()) {
            errors.name = 'Name is required';
        }

        if (!customerInfo.surname.trim()) {
            errors.surname = 'Surname is required';
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

            // Prepare order data - Updated to match backend requirements
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
                // Use 'type' instead of 'payment_type' to match backend
                type: customerInfo.paymentType
            };

            // Send order data to backend
            const response = await apiClient.post(API_URL_Cart_Page, orderData);

            if (!response.data) {
                throw new Error('No data received from server');
            }

            const { orderId, billNo, paymentLink } = response.data;

            setPaymentData({
                orderId,
                billNo: billNo || orderId,
                paymentLink
            });

            // Process according to payment type
            switch (customerInfo.paymentType) {
                case 'idram':
                    if (!billNo && !orderId) {
                        throw new Error('Order ID or bill number is required for Idram payments');
                    }

                    // Use setTimeout to ensure the DOM is ready
                    setTimeout(() => {
                        if (idramFormRef.current) {
                            const formElement = idramFormRef.current.querySelector('#idramPaymentForm');
                            if (formElement) {
                                formElement.submit();
                            } else {
                                throw new Error('Idram form element not found');
                            }
                        } else {
                            throw new Error('Idram form reference not found');
                        }
                    }, 100);
                    break;

                case 'card':
                    if (!paymentLink) {
                        throw new Error('Payment link is required for card payments');
                    }
                    // Redirect will be handled by AmeriaCardPaymentRedirect component
                    break;

                case 'ameria_pay':
                    // Process AmeriaPay payment - simplify to just use paymentLink from backend
                    if (!paymentLink) {
                        throw new Error('Payment link is required for AmeriaPay payments');
                    }
                    window.location.href = paymentLink;
                    break;

                default:
                    throw new Error('Invalid payment method selected');
            }

            setPaymentStatus({ success: true, error: null });
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

    // Cancel payment and close modal
    const cancelPayment = () => {
        setModalOpen(false);
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
                        <div className="cart-table">
                            <table>
                                <thead>
                                <tr>
                                    <th>Image</th>
                                    <th>Product</th>
                                    <th>Unit Price</th>
                                    <th>Quantity</th>
                                    <th>Total</th>
                                    <th>Remove</th>
                                </tr>
                                </thead>
                                <tbody>
                                {cart.map((item) => (
                                    <tr key={`${item.id}-${item.selectedType}`} className="cart-item">
                                        <td>
                                            <img
                                                src={item.image || '/assets/placeholder.png'}
                                                alt={item.name}
                                                className="cart-item-image"
                                            />
                                        </td>
                                        <td>
                                            <div className="product-info">
                                                <div className="product-name">{item.name}</div>
                                                {item.selectedType && (
                                                    <div className="product-type">Type: {item.selectedType}</div>
                                                )}
                                            </div>
                                        </td>
                                        <td>{item.price} AMD</td>
                                        <td>
                                            <div className="quantity-controls">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.selectedType, Math.max(item.quantity - 1, 1))}
                                                    aria-label="Decrease quantity"
                                                    className="quantity-btn"
                                                >
                                                    -
                                                </button>
                                                <input
                                                    type="number"
                                                    value={item.quantity}
                                                    min="1"
                                                    onChange={(e) => {
                                                        const value = parseInt(e.target.value);
                                                        if (!isNaN(value) && value >= 1) {
                                                            updateQuantity(item.id, item.selectedType, value);
                                                        } else {
                                                            updateQuantity(item.id, item.selectedType, 1);
                                                        }
                                                    }}
                                                    aria-label="Quantity"
                                                    className="quantity-input"
                                                />
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.selectedType, item.quantity + 1)}
                                                    aria-label="Increase quantity"
                                                    className="quantity-btn"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </td>
                                        <td>{(item.price * item.quantity).toFixed(2)} AMD</td>
                                        <td>
                                            <button
                                                onClick={() => removeItem(item.id, item.selectedType)}
                                                className="remove-button"
                                                aria-label="Remove item"
                                            >
                                                ×
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    <div className="checkout-section">
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
                                    <option value="card">Card (Ameria)</option>
                                    <option value="ameria_pay">MyAmeria Pay</option>
                                </select>
                            </div>
                        </div>

                        <div className="cart-totals">
                            <h3>Order Summary</h3>
                            <div className="total-row">
                                <span>Subtotal</span>
                                <span>{totalAmount} AMD</span>
                            </div>
                            {/* You can add shipping costs here if needed */}
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

                        {/* Payment status messages */}
                        {paymentStatus.error && (
                            <div className="payment-message error">
                                <p className="error-message">{paymentStatus.error}</p>
                                <button
                                    className="try-again-btn"
                                    onClick={() => setPaymentStatus({ success: false, error: null })}
                                >
                                    Try Again
                                </button>
                            </div>
                        )}

                        {paymentStatus.success && (
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
                        )}
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            {modalOpen && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <h3>Order Confirmation</h3>
                        <p>
                            Please confirm your order details:
                        </p>
                        <div className="confirmation-details">
                            <p><strong>Name:</strong> {customerInfo.name} {customerInfo.surname}</p>
                            <p><strong>Phone:</strong> {customerInfo.phone}</p>
                            <p><strong>Payment Method:</strong> {customerInfo.paymentType === 'idram' ? 'Idram' :
                                customerInfo.paymentType === 'card' ? 'Card (Ameria)' : 'MyAmeria Pay'}</p>
                            <p><strong>Total Amount:</strong> {totalAmount} AMD</p>
                        </div>
                        <div className="modal-buttons">
                            <button className="confirm-button" onClick={confirmPayment} disabled={isLoading}>
                                {isLoading ? 'Processing...' : 'Confirm Order'}
                            </button>
                            <button className="cancel-button" onClick={cancelPayment} disabled={isLoading}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Hidden forms and redirects */}
            <div style={{ display: 'none' }} ref={idramFormRef}>
                <IdramPaymentForm
                    amount={totalAmount}
                    billNo={paymentData.billNo}
                    orderId={paymentData.orderId}
                    successUrl={`${BASE_URL}/payment/success?orderId=${paymentData.orderId}`}
                    failUrl={`${BASE_URL}/payment/fail?orderId=${paymentData.orderId}`}
                />
            </div>

            {customerInfo.paymentType === 'card' && paymentData.paymentLink && (
                <AmeriaCardPaymentRedirect paymentLink={paymentData.paymentLink} />
            )}
        </>
    );
}

export default CartPage;