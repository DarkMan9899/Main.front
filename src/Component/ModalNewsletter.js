import React, { useEffect } from "react";
import "../styles/ModalNewsletter.css";

const ModalNewsletter = ({ isOpen, onClose, message }) => {
    useEffect(() => {
        if (!isOpen) return;

        // Auto-close after 3s if success
        if (message.startsWith("✅")) {
            const timer = setTimeout(() => onClose(), 3000);
            return () => clearTimeout(timer);
        }
    }, [isOpen, message, onClose]);

    if (!isOpen) return null;

    return (
        <div className="newsletter-modal-overlay" onClick={onClose}>
            <div
                className={`newsletter-modal ${
                    message.startsWith("✅") ? "success" : "error"
                }`}
                onClick={(e) => e.stopPropagation()}
            >
        <span className="close-btn" onClick={onClose}>
          &times;
        </span>
                <p className="newsletter-modal-message">{message}</p>
            </div>
        </div>
    );
};

export default ModalNewsletter;
