import React, {useState, useMemo} from 'react';
import axios from 'axios';
import '../styles/CartPage.css';
import {API_URL_Cart_Page} from '../api';

const BASE_URL = process.env.REACT_APP_BASE_URL || 'https://polyglotacademy.am';
const IDRAM_ACCOUNT_ID = '100049302';
const PAYMENT_DESCRIPTION = 'Your purchase description';
const CUSTOMER_EMAIL = 'academy.polyglott@gmail.com';
console.log('-------',BASE_URL)
// function IdramPaymentForm({ amount, billNo }) {
//     const userId = localStorage.getItem('userId');
//
//     return (
//         <form
//             action="https://banking.idram.am/Payment/GetPayment"
//             method="POST"
//             id="idramPaymentForm"
//         >
//             <input type="hidden" name="EDP_LANGUAGE" value="EN" />
//             <input type="hidden" name="EDP_REC_ACCOUNT" value={IDRAM_ACCOUNT_ID} />
//             <input type="hidden" name="EDP_DESCRIPTION" value={PAYMENT_DESCRIPTION} />
//             <input type="hidden" name="EDP_AMOUNT" value={amount} />
//             <input type="hidden" name="EDP_BILL_NO" value={billNo || userId} />
//             <input type="hidden" name="EDP_EMAIL" value={CUSTOMER_EMAIL} />
//             <input type="hidden" name="SUCCESS_URL" value={`${BASE_URL}/success`} />
//             <input type="hidden" name="FAIL_URL" value={`${BASE_URL}/fail`} />
//             <input type="hidden" name="RESULT_URL" value="https://main-api.academy-polyglot.site/result" />
//         </form>
//     );
// }

function IdramPaymentForm({ amount, billNo }) {
    console.log('🟡 Idram Payment Form Values:', { amount, billNo });

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
            <input type="hidden" name="EDP_BILL_NO" value={billNo} />
            <input type="hidden" name="EDP_EMAIL" value={CUSTOMER_EMAIL} />
            <input type="hidden" name="SUCCESS_URL" value={`${BASE_URL}/success`} />
            <input type="hidden" name="FAIL_URL" value={`${BASE_URL}/fail`} />
            <input type="hidden" name="RESULT_URL" value="https://main-api.academy-polyglot.site/result" />
        </form>
    );
}



function CartPage({cart, updateQuantity, removeItem}) {
    const [customerInfo, setCustomerInfo] = useState({
        name: '',
        surname: '',
        phone: '',
    });
    const [modalOpen, setModalOpen] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState({
        success: false,
        error: null,
    });

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

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setCustomerInfo((prevInfo) => ({...prevInfo, [name]: value}));
    };

    const handlePayment = () => {
        setModalOpen(true);
    };

    // const confirmPayment = async () => {
    //     try {
    //         const userId = localStorage.getItem('userId');
    //
    //         const orderData = {
    //             customer_name: customerInfo.name,
    //             customer_surname: customerInfo.surname,
    //             customer_phone: customerInfo.phone,
    //             cart,
    //             userId,
    //         };
    //
    //         const response = await axios.post(API_URL_Cart_Page, orderData);
    //         const billNo = response.data.billNo;
    //
    //         setPaymentStatus({ success: true, error: null });
    //
    //         document.getElementById('idramPaymentForm').submit();
    //     } catch (error) {
    //         setPaymentStatus({
    //             success: false,
    //             error: 'There was an issue submitting your order. Please try again.',
    //         });
    //     } finally {
    //         setModalOpen(false);
    //     }
    // };

    const confirmPayment = async () => {
        try {
            const orderData = {
                customer_name: customerInfo.name,
                customer_surname: customerInfo.surname,
                customer_phone: customerInfo.phone,
                cart,
            };

            console.log('🟡 Sending Order Data to Backend:', orderData);

            const response = await axios.post(API_URL_Cart_Page, orderData);
            const billNo = response.data.billNo; // Expecting bill number from the backend

            console.log('🟢 Backend Response:', response.data);

            setPaymentStatus({ success: true, error: null });

            document.getElementById('idramPaymentForm').submit();
        } catch (error) {
            console.error('🔴 Error Confirming Payment:', error);
            setPaymentStatus({
                success: false,
                error: 'There was an issue submitting your order. Please try again.',
            });
        } finally {
            setModalOpen(false);
        }
    };





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
                                        <img src={item.image} alt={item.name} className="cart-item-image"/>
                                    </td>
                                    <td>{item.name}</td>
                                    <td>{item.price} AMD</td>
                                    <td>
                                        <div className="quantity-controls">
                                            <button
                                                onClick={() =>
                                                    updateQuantity(
                                                        item.id,
                                                        item.selectedType,
                                                        Math.max(item.quantity - 1, 1)
                                                    )
                                                }
                                            >
                                                -
                                            </button>
                                            <input
                                                type="number"
                                                value={item.quantity}
                                                min="1"
                                                onChange={(e) =>
                                                    updateQuantity(
                                                        item.id,
                                                        item.selectedType,
                                                        parseInt(e.target.value) || 1
                                                    )
                                                }
                                            />
                                            <button
                                                onClick={() =>
                                                    updateQuantity(item.id, item.selectedType, item.quantity + 1)
                                                }
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
                                        >
                                            ×
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="checkout-section">
                        <div className="customer-info">
                            <h3>Customer Information</h3>
                            <div className="input-group">
                                <label>Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Name"
                                    value={customerInfo.name}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="input-group">
                                <label>Surname</label>
                                <input
                                    type="text"
                                    name="surname"
                                    placeholder="Surname"
                                    value={customerInfo.surname}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="input-group">
                                <label>Phone Number</label>
                                <input
                                    type="text"
                                    name="phone"
                                    placeholder="Phone Number"
                                    value={customerInfo.phone}
                                    onChange={handleInputChange}
                                />
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
                                disabled={!isFormValid}
                            >
                                Proceed To Checkout
                            </button>
                        </div>

                        {paymentStatus.error && (
                            <p className="error-message">{paymentStatus.error}</p>
                        )}
                        {paymentStatus.success && (
                            <p className="success-message">Payment Successful!</p>
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
                            <button className="button" onClick={confirmPayment}>
                                Yes
                            </button>
                            <button className="button" onClick={cancelPayment}>
                                No
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <IdramPaymentForm amount={totalAmount} billNo="GENERATED_BILL_NO"/>
        </>
    );
}

export default CartPage;
