import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

function PaymentSuccess() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Extract URL parameters
    const orderId = searchParams.get("orderId");
    const paymentID = searchParams.get("paymentID"); // Ameria VPOS only
    const paymentType = searchParams.get("paymentType") || 'unknown';

    // Component state
    const [status, setStatus] = useState("loading");
    const [details, setDetails] = useState(null);
    const [error, setError] = useState(null);
    const [retryCount, setRetryCount] = useState(0);

    // Enhanced payment verification with timeout and retry logic
    const verifyPayment = async (attempt = 1) => {
        // For non-card payments (Idram, Telcell, AmeriaPay), assume success
        if (!paymentID || paymentType !== 'card') {
            console.log(`Payment type: ${paymentType}, no verification needed`);
            setStatus("success");
            return;
        }

        try {
            console.log(`🔍 Verifying payment (attempt ${attempt}):`, paymentID);

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

            const response = await fetch("/api/payment/ameria/details", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ paymentId: paymentID }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log("📥 Payment verification response:", data);

            if (data.ok && data.data) {
                setDetails(data.data);

                // Enhanced payment validation using the validation from backend
                const isSuccessful = data.validation
                    ? data.validation.isSuccessful
                    : validatePaymentState(data.data);

                if (isSuccessful) {
                    console.log("✅ Payment verified successfully");
                    setStatus("success");
                } else {
                    console.log("❌ Payment verification failed:", data.validation);
                    setStatus("error");
                    setError(`Payment failed: ${data.data.ResponseMessage || 'Payment not completed'}`);
                }
            } else {
                throw new Error(data.message || "Invalid response from payment verification");
            }

        } catch (err) {
            console.error("🔴 Payment verification error:", err);

            if (err.name === 'AbortError') {
                setError("Payment verification timed out. Please try again.");
            } else if (attempt < 3) {
                // Retry logic with exponential backoff
                console.log(`🔄 Retrying payment verification (${attempt + 1}/3)...`);
                setRetryCount(attempt);
                const delay = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
                setTimeout(() => verifyPayment(attempt + 1), delay);
                return;
            } else {
                setError(err.message || "Failed to verify payment after 3 attempts");
            }

            setStatus("error");
        }
    };

    // Enhanced payment state validation based on VPOS documentation
    const validatePaymentState = (paymentData) => {
        const paymentState = String(paymentData.PaymentState || '');
        const responseCode = String(paymentData.ResponseCode || '');

        // Based on Ameria Bank VPOS documentation
        const successStates = ['1', '2', '5'];  // preauth, authorized, auto-auth
        const successResponseCodes = ['00', '1'];

        return successStates.includes(paymentState) || successResponseCodes.includes(responseCode);
    };

    useEffect(() => {
        // Add delay to avoid immediate calls and allow UI to render
        const timer = setTimeout(() => {
            verifyPayment();
        }, 1000);

        return () => clearTimeout(timer);
    }, [paymentID]);

    // Manual retry function
    const handleRetry = () => {
        setStatus("loading");
        setError(null);
        setRetryCount(0);
        verifyPayment();
    };

    // Navigation functions
    const goHome = () => navigate('/');
    const goToOrders = () => navigate('/orders');
    const contactSupport = () => {
        const subject = encodeURIComponent('Payment Issue - Order #' + orderId);
        const body = encodeURIComponent(
            `Order ID: ${orderId}\n` +
            `Payment ID: ${paymentID}\n` +
            `Payment Type: ${paymentType}\n` +
            `Error: ${error}\n\n` +
            'Please help me resolve this payment issue.'
        );
        window.open(`mailto:support@polyglotacademy.am?subject=${subject}&body=${body}`);
    };

    // Format currency
    const formatAmount = (amount) => {
        if (!amount) return '';
        return `${parseFloat(amount).toFixed(2)} ՀՀ դրամ`;
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleString('hy-AM');
    };

    return (
        <div className="payment-success-container">
            {/* Loading State */}
            {status === "loading" && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <div className="loading-spinner"></div>
                        <h2>🔍 Վճարման ստուգում...</h2>
                        <p>Խնդրում ենք սպասել, մինչ մենք ստուգում ենք ձեր վճարումը:</p>

                        {retryCount > 0 && (
                            <div className="retry-info">
                                <p>Նորից փորձ: {retryCount}/3</p>
                            </div>
                        )}

                        {paymentID && (
                            <div className="payment-id">
                                Վճարման ID: {paymentID}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Success State */}
            {status === "success" && (
                <div className="modal-overlay">
                    <div className="modal-box success-modal">
                        <div className="success-icon">✅</div>
                        <h2>Վճարումը հաջողվեց!</h2>
                        <p>Ձեր վճարումը բարեհաջող ավարտվել է:</p>

                        <div className="payment-details">
                            {orderId && (
                                <div className="detail-item">
                                    <strong>Պատվերի համար:</strong>
                                    <span>#{orderId}</span>
                                </div>
                            )}

                            {paymentID && (
                                <div className="detail-item">
                                    <strong>Վճարման ID:</strong>
                                    <span>{paymentID}</span>
                                </div>
                            )}

                            {details?.Amount && (
                                <div className="detail-item">
                                    <strong>Գումար:</strong>
                                    <span>{formatAmount(details.Amount)}</span>
                                </div>
                            )}

                            {details?.DateTime && (
                                <div className="detail-item">
                                    <strong>Ամսաթիվ:</strong>
                                    <span>{formatDate(details.DateTime)}</span>
                                </div>
                            )}

                            {paymentType && (
                                <div className="detail-item">
                                    <strong>Վճարման տեսակ:</strong>
                                    <span>{getPaymentTypeName(paymentType)}</span>
                                </div>
                            )}

                            {details?.CardNumber && (
                                <div className="detail-item">
                                    <strong>Քարտ:</strong>
                                    <span>{details.CardNumber}</span>
                                </div>
                            )}
                        </div>

                        <div className="action-buttons">
                            <button className="btn-primary" onClick={goHome}>
                                Գլխավոր էջ
                            </button>
                            <button className="btn-secondary" onClick={goToOrders}>
                                Իմ պատվերները
                            </button>
                        </div>

                        <div className="success-message">
                            <p>📧 Հաստատման նամակ է ուղարկվել ձեր էլ-փոստին:</p>
                            <p>📱 Կարող եք հետևել ձեր պատվերի կարգավիճակին ձեր հաշվում:</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Error State */}
            {status === "error" && (
                <div className="modal-overlay">
                    <div className="modal-box error-modal">
                        <div className="error-icon">❌</div>
                        <h2>Վճարման ստուգման խնդիր</h2>
                        <p>Մենք խնդիր ենք հանդիպել ձեր վճարման ստուգման ժամանակ:</p>

                        {error && (
                            <div className="error-message">
                                <strong>Սխալ:</strong> {error}
                            </div>
                        )}

                        <div className="payment-details">
                            {orderId && (
                                <div className="detail-item">
                                    <strong>Պատվերի համար:</strong>
                                    <span>#{orderId}</span>
                                </div>
                            )}

                            {paymentID && (
                                <div className="detail-item">
                                    <strong>Վճարման ID:</strong>
                                    <span>{paymentID}</span>
                                </div>
                            )}

                            {paymentType && (
                                <div className="detail-item">
                                    <strong>Վճարման տեսակ:</strong>
                                    <span>{getPaymentTypeName(paymentType)}</span>
                                </div>
                            )}
                        </div>

                        <div className="action-buttons">
                            <button className="btn-retry" onClick={handleRetry}>
                                🔄 Նորից փորձել
                            </button>
                            <button className="btn-primary" onClick={goHome}>
                                Գլխավոր էջ
                            </button>
                            <button className="btn-secondary" onClick={contactSupport}>
                                Կապ մեր հետ
                            </button>
                        </div>

                        <div className="support-info">
                            <p><strong>Մի՛ անհանգստացեք!</strong> Եթե ձեզ գումար է գանձվել, մենք ձեր պատվերը կկանոնակարգենք ձեռքով:</p>
                            <p>Խնդրում ենք կապվել մեր աջակցության թիմի հետ ձեր պատվերի համարով:</p>
                            <p>📞 Հեռ.: +374 77 123 456 | 📧 Էլ-փոստ: support@polyglotacademy.am</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Styles */}
            <style jsx>{`
                .payment-success-container {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
                }

                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    padding: 1rem;
                }

                .modal-box {
                    background: white;
                    padding: 2rem;
                    border-radius: 12px;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
                    text-align: center;
                    max-width: 500px;
                    width: 100%;
                    max-height: 90vh;
                    overflow-y: auto;
                }

                .success-icon, .error-icon {
                    font-size: 4rem;
                    margin-bottom: 1rem;
                    display: block;
                }

                .loading-spinner {
                    width: 50px;
                    height: 50px;
                    border: 4px solid #f3f3f3;
                    border-top: 4px solid #007bff;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 1.5rem;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                .payment-details {
                    background: #f8f9fa;
                    padding: 1.5rem;
                    border-radius: 8px;
                    margin: 1.5rem 0;
                    text-align: left;
                    border: 1px solid #e9ecef;
                }

                .detail-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 0.75rem;
                    padding: 0.5rem 0;
                    border-bottom: 1px solid #e9ecef;
                }

                .detail-item:last-child {
                    border-bottom: none;
                    margin-bottom: 0;
                }

                .detail-item strong {
                    color: #495057;
                    font-weight: 600;
                    margin-right: 1rem;
                    flex-shrink: 0;
                }

                .detail-item span {
                    color: #212529;
                    text-align: right;
                    word-break: break-word;
                }

                .action-buttons {
                    display: flex;
                    gap: 1rem;
                    justify-content: center;
                    flex-wrap: wrap;
                    margin: 2rem 0 1rem;
                }

                .btn-primary, .btn-secondary, .btn-retry {
                    padding: 0.75rem 1.5rem;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 0.9rem;
                    min-width: 120px;
                    transition: all 0.2s ease;
                }

                .btn-primary {
                    background: #007bff;
                    color: white;
                }

                .btn-primary:hover {
                    background: #0056b3;
                    transform: translateY(-1px);
                }

                .btn-secondary {
                    background: #6c757d;
                    color: white;
                }

                .btn-secondary:hover {
                    background: #545b62;
                    transform: translateY(-1px);
                }

                .btn-retry {
                    background: #28a745;
                    color: white;
                }

                .btn-retry:hover {
                    background: #1e7e34;
                    transform: translateY(-1px);
                }

                .error-message {
                    background: #f8d7da;
                    color: #721c24;
                    padding: 1rem;
                    border-radius: 6px;
                    margin: 1rem 0;
                    border: 1px solid #f5c6cb;
                    text-align: left;
                }

                .retry-info {
                    background: #e3f2fd;
                    color: #1565c0;
                    padding: 0.75rem;
                    border-radius: 6px;
                    margin-top: 1rem;
                    font-size: 0.9rem;
                }

                .payment-id {
                    background: #f8f9fa;
                    color: #6c757d;
                    font-size: 0.85rem;
                    font-family: 'Monaco', 'Menlo', monospace;
                    padding: 0.75rem;
                    border-radius: 4px;
                    margin-top: 1rem;
                    word-break: break-all;
                    border: 1px solid #e9ecef;
                }

                .support-info {
                    margin-top: 1.5rem;
                    padding-top: 1.5rem;
                    border-top: 2px solid #e9ecef;
                    color: #6c757d;
                    font-size: 0.9rem;
                    text-align: left;
                    line-height: 1.5;
                }

                .support-info p {
                    margin: 0.5rem 0;
                }

                .success-message {
                    margin-top: 1.5rem;
                    padding-top: 1.5rem;
                    border-top: 2px solid #e9ecef;
                    color: #28a745;
                    font-size: 0.9rem;
                }

                .success-message p {
                    margin: 0.5rem 0;
                }

                /* Mobile responsiveness */
                @media (max-width: 768px) {
                    .modal-box {
                        padding: 1.5rem;
                        margin: 0.5rem;
                    }

                    .action-buttons {
                        flex-direction: column;
                        align-items: center;
                    }

                    .btn-primary, .btn-secondary, .btn-retry {
                        width: 100%;
                        max-width: 250px;
                    }

                    .detail-item {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 0.25rem;
                    }

                    .detail-item span {
                        text-align: left;
                    }

                    .success-icon, .error-icon {
                        font-size: 3rem;
                    }
                }

                /* Dark mode support */
                @media (prefers-color-scheme: dark) {
                    .modal-box {
                        background: #2d3748;
                        color: #e2e8f0;
                    }

                    .payment-details {
                        background: #4a5568;
                        border-color: #2d3748;
                    }

                    .detail-item {
                        border-color: #4a5568;
                    }
                }

                /* Print styles */
                @media print {
                    .modal-overlay {
                        position: static;
                        background: none;
                    }

                    .modal-box {
                        box-shadow: none;
                        max-width: none;
                    }

                    .action-buttons {
                        display: none;
                    }
                }
            `}</style>
        </div>
    );
}

// Helper function to get payment type display name
function getPaymentTypeName(type) {
    const names = {
        card: 'Բանկային քարտ',
        idram: 'Idram',
        ameriapay: 'MyAmeria',
        telcell: 'Telcell',
        unknown: 'Անհայտ'
    };
    return names[type] || names.unknown;
}

export default PaymentSuccess;