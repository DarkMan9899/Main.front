import React, { useState, useMemo, useRef, useEffect } from 'react';
import axios from 'axios';
import '../styles/CartPage.css';
import { API_URL_Cart_Page } from '../api';

const BASE_URL = process.env.REACT_APP_BASE_URL || 'https://polyglotacademy.am';
const IDRAM_ACCOUNT_ID = '100049302';
const PAYMENT_DESCRIPTION = 'Your purchase description';
const CUSTOMER_EMAIL = 'academy.polyglott@gmail.com';

// MyAmeria Pay configuration
const APP_IDENTIFIER = 'your.app.identifier'; // Your app identifier for web integration

function IdramPaymentForm({ amount, billNo }) {
    return (
        <form
            action="https://banking.idram.am/Payment/GetPayment"
            method="POST"
            id="idramPaymentForm"
        >
            <input type="hidden" name="EDP_LANGUAGE" value="EN" />
            <input type="hidden" name="EDP_REC_ACCOUNT" value={IDRAM_ACCOUNT_ID} />
            <input type="hidden" name="EDP_DESCRIPTION" value={PAYMENT_DESCRIPTION} />
            <input type="hidden" name="EDP_AMOUNT" value={amount} />
            <input type="hidden" name="EDP_BILL_NO" value={billNo || ''} />
            <input type="hidden" name="EDP_EMAIL" value={CUSTOMER_EMAIL} />
            <input type="hidden" name="SUCCESS_URL" value={`${BASE_URL}/success`} />
            <input type="hidden" name="FAIL_URL" value={`${BASE_URL}/fail`} />
            <input type="hidden" name="RESULT_URL" value="https://main-api.academy-polyglot.site/result" />
        </form>
    );
}

function AmeriaCardPaymentRedirect({ paymentLink }) {
    useEffect(() => {
        if (paymentLink) {
            window.location.href = paymentLink;
        }
    }, [paymentLink]);

    return null;
}

function CartPage({ cart, updateQuantity, removeItem }) {
    const [customerInfo, setCustomerInfo] = useState({
        name: '',
        surname: '',
        phone: '',
        paymentType: 'idram',
    });
    const [modalOpen, setModalOpen] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState({ success: false, error: null });
    const [paymentData, setPaymentData] = useState({
        orderId: null,
        billNo: null,
        paymentLink: null
    });
    const [isLoading, setIsLoading] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});

    // Reference for Idram form
    const idramFormRef = useRef(null);

    // Check URL params for payment callback
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const status = urlParams.get('status');
        const transactionId = urlParams.get('transactionId');
        const paymentId = urlParams.get('paymentId');
        const errorMessage = urlParams.get('errorMessage');

        if (status && transactionId) {
            // Handle MyAmeria Pay callback
            if (status === 'success') {
                setPaymentStatus({
                    success: true,
                    error: null,
                    message: `Payment successful! Transaction ID: ${transactionId}, Payment ID: ${paymentId}`
                });
            } else if (status === 'failure') {
                setPaymentStatus({
                    success: false,
                    error: errorMessage || 'Payment failed'
                });
            }

            // Clean URL after processing
            if (window.history && window.history.replaceState) {
                window.history.replaceState({}, document.title, window.location.pathname);
            }
        }
    }, []);

    const isFormValid = useMemo(() => {
        return (
            customerInfo.name.trim() &&
            customerInfo.surname.trim() &&
            customerInfo.phone.trim() &&
            cart.length > 0
        );
    }, [customerInfo, cart]);

    const totalAmount = useMemo(() => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
    }, [cart]);

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
        } else if (!/^(\+374|0)([0-9]{8})$/.test(customerInfo.phone.trim())) {
            errors.phone = 'Please enter a valid Armenian phone number';
        }

        if (cart.length === 0) {
            errors.cart = 'Your cart is empty';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCustomerInfo((prevInfo) => ({ ...prevInfo, [name]: value }));

        // Clear validation error when user starts typing
        if (validationErrors[name]) {
            setValidationErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handlePayment = () => {
        if (validateForm()) {
            setModalOpen(true);
        }
    };

    const handleMyAmeriaPay = (orderId, amount) => {
        // For web integration, we redirect to the MyAmeria Pay URL
        // According to the documentation, the URL structure is:
        const callbackScheme = APP_IDENTIFIER;
        const merchantName = encodeURIComponent("PolyglotAcademy"); // Use your registered merchant name
        const merchantId = process.env.REACT_APP_AMERIA_MERCHANT_ID || "yourMerchantId";
        const terminalId = process.env.REACT_APP_AMERIA_TERMINAL_ID || "yourTerminalId";

        const myAmeriaPayUrl = `https://app.myameria.am/pay/getpaymentoptions?merchantName=${merchantName}&transactionAmount=${amount}&transactionId=${orderId}&merchantId=${merchantId}&terminalId=${terminalId}&callbackscheme=${callbackScheme}`;

        // Redirect to MyAmeria Pay
        window.location.href = myAmeriaPayUrl;
    };

    const confirmPayment = async () => {
        try {
            setIsLoading(true);
            setPaymentStatus({ success: false, error: null });

            const orderData = {
                customer_name: customerInfo.name,
                customer_surname: customerInfo.surname,
                customer_phone: customerInfo.phone,
                cart,
                type: customerInfo.paymentType || 'idram',
            };

            // Send order data to backend
            const response = await axios.post(API_URL_Cart_Page, orderData);

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
                        throw new Error('Bill number is required for Idram payments');
                    }

                    // Use setTimeout to ensure the DOM is ready
                    setTimeout(() => {
                        if (idramFormRef.current) {
                            const formElement = idramFormRef.current.querySelector('#idramPaymentForm');
                            const billNoInput = formElement.querySelector('input[name="EDP_BILL_NO"]');

                            if (formElement && billNoInput) {
                                billNoInput.value = billNo || orderId;
                                formElement.submit();
                            } else {
                                throw new Error('Idram form elements not found');
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
                    // Process AmeriaPay payment
                    if (paymentLink) {
                        window.location.href = paymentLink;
                    } else if (orderId) {
                        // If backend doesn't provide a payment link, use our implementation
                        handleMyAmeriaPay(orderId, totalAmount);
                    } else {
                        throw new Error('Order ID is required for AmeriaPay payments');
                    }
                    break;

                default:
                    throw new Error('Invalid payment method selected');
            }

            setPaymentStatus({ success: true, error: null });
        } catch (error) {
            console.error('🔴 Error Confirming Payment:', error);
            setPaymentStatus({
                success: false,
                error: error.message || 'There was an issue submitting your order. Please try again.',
            });
        } finally {
            setIsLoading(false);
            setModalOpen(false);
        }
    };

    const cancelPayment = () => {
        setModalOpen(false);
    };

    // Check for empty cart
    const isCartEmpty = cart.length === 0;

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
                        </div>
                    ) : (
                        <div className="cart-table">
                            <table>
                                <thead>
                                <tr>
                                    <th>Images</th>
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
                                            <img src={item.image} alt={item.name} className="cart-item-image" />
                                        </td>
                                        <td>{item.name}</td>
                                        <td>{item.price} AMD</td>
                                        <td>
                                            <div className="quantity-controls">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.selectedType, Math.max(item.quantity - 1, 1))}
                                                    aria-label="Decrease quantity"
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
                                                />
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.selectedType, item.quantity + 1)}
                                                    aria-label="Increase quantity"
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
                                <label htmlFor="name">Name</label>
                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    placeholder="Name"
                                    value={customerInfo.name}
                                    onChange={handleInputChange}
                                />
                                {validationErrors.name && <div className="error-text">{validationErrors.name}</div>}
                            </div>
                            <div className={`input-group ${validationErrors.surname ? 'has-error' : ''}`}>
                                <label htmlFor="surname">Surname</label>
                                <input
                                    id="surname"
                                    type="text"
                                    name="surname"
                                    placeholder="Surname"
                                    value={customerInfo.surname}
                                    onChange={handleInputChange}
                                />
                                {validationErrors.surname && <div className="error-text">{validationErrors.surname}</div>}
                            </div>
                            <div className={`input-group ${validationErrors.phone ? 'has-error' : ''}`}>
                                <label htmlFor="phone">Phone Number</label>
                                <input
                                    id="phone"
                                    type="text"
                                    name="phone"
                                    placeholder="Phone Number (e.g., +37499123456)"
                                    value={customerInfo.phone}
                                    onChange={handleInputChange}
                                />
                                {validationErrors.phone && <div className="error-text">{validationErrors.phone}</div>}
                            </div>
                            <div className="input-group">
                                <label htmlFor="paymentType">Payment Method</label>
                                <select
                                    id="paymentType"
                                    name="paymentType"
                                    value={customerInfo.paymentType}
                                    onChange={handleInputChange}
                                >
                                    <option value="idram">Idram</option>
                                    <option value="card">Card (Ameria)</option>
                                    <option value="ameria_pay">MyAmeria Pay</option>
                                </select>
                            </div>
                        </div>

                        <div className="cart-totals">
                            <h3>Cart Totals</h3>
                            <div className="total-row">
                                <span>Subtotal</span>
                                <span>{totalAmount} AMD</span>
                            </div>
                            <div className="total-row">
                                <span>Total</span>
                                <span>{totalAmount} AMD</span>
                            </div>
                            <button
                                className="proceed-to-checkout"
                                onClick={handlePayment}
                                disabled={!isFormValid || isLoading}
                            >
                                {isLoading ? 'Processing...' : 'Proceed To Checkout'}
                            </button>
                            {validationErrors.cart && <div className="error-text center">{validationErrors.cart}</div>}
                        </div>

                        {paymentStatus.error && <p className="error-message">{paymentStatus.error}</p>}
                        {paymentStatus.success && (
                            <p className="success-message">
                                {paymentStatus.message || 'Payment Successful!'}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {modalOpen && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <p>
                            Please confirm your details, and our specialists will get in touch
                            with you.
                        </p>
                        <div className="modal-buttons">
                            <button className="button" onClick={confirmPayment} disabled={isLoading}>
                                {isLoading ? 'Processing...' : 'Yes'}
                            </button>
                            <button className="button" onClick={cancelPayment} disabled={isLoading}>
                                No
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Hidden forms and redirects */}
            <div style={{ display: 'none' }} ref={idramFormRef}>
                <IdramPaymentForm amount={totalAmount} billNo={paymentData.billNo} />
            </div>

            {customerInfo.paymentType === 'card' && paymentData.paymentLink && (
                <AmeriaCardPaymentRedirect paymentLink={paymentData.paymentLink} />
            )}
        </>
    );
}

export default CartPage;