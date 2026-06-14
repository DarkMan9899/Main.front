import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import "../styles/TelegramLoginModal.css";

const BACKEND_URL =
    process.env.NODE_ENV === "production"
        ? "https://main-api.academy-polyglot.site"
        : "http://localhost:5001";

function TelegramLoginModal({ onClose }) {
    const { t } = useTranslation();

    useEffect(() => {
        const container = document.getElementById("telegram-login-container");
        if (!container) return;

        // մաքրում ենք հինը
        container.innerHTML = "";

        const script = document.createElement("script");
        script.src = "https://telegram.org/js/telegram-widget.js?22";
        script.async = true;

        // ⚠️ առանց @
        script.setAttribute("data-telegram-login", "polya2_bot");

        script.setAttribute("data-size", "large");
        script.setAttribute("data-userpic", "false");
        script.setAttribute("data-request-access", "write");

        // ✅ ՊԱՐՏԱԴԻՐ /api/auth/telegram
        script.setAttribute(
            "data-auth-url",
            `${BACKEND_URL}/api/auth/telegram`
        );

        container.appendChild(script);

        return () => {
            container.innerHTML = "";
        };
    }, []);

    return (
        <div className="telegram-modal-overlay">
            <div className="telegram-modal">
                <button className="telegram-close" onClick={onClose}>
                    ×
                </button>

                <h3>{t("telegram.login_title")}</h3>
                <p>{t("telegram.login_desc")}</p>

                <div id="telegram-login-container" />
            </div>
        </div>
    );
}

export default TelegramLoginModal;
