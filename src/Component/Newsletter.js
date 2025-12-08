import React, { useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import "../styles/Newsletter.css";
import ModalNewsletter from "./ModalNewsletter";
import { API_URL_Newsletter } from "../api";

const Newsletter = () => {
    const { t } = useTranslation();
    const { lang } = useParams();

    const [email, setEmail] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [responseMessage, setResponseMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email.trim()) {
            setResponseMessage(t("newsletter.error_invalid"));
            setModalOpen(true);
            return;
        }

        try {
            const response = await axios.post(API_URL_Newsletter, { email });
            setResponseMessage(
                response.data?.message || t("newsletter.success")
            );
            setEmail("");
        } catch (error) {
            setResponseMessage(t("newsletter.error_general"));
        } finally {
            setModalOpen(true);
        }
    };

    return (
        <section className="newsletter-section">
            <div className="newsletter-container ">
                {/* 📰 Text Section */}
                <div className="newsletter-text">
                    <h4 className="newsletter-title">{t("newsletter.title")}</h4>
                    {/*<p className="newsletter-subtitle">{t("newsletter.subtitle")}</p>*/}
                </div>

                {/* 📩 Form Section */}
                <form className="newsletter-form" onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder={t("newsletter.placeholder")}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <button type="submit" className="button">
                        {t("newsletter.button")}
                    </button>
                </form>

                {/* ✅ Modal for Feedback */}
                <ModalNewsletter
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                    message={responseMessage}
                />
            </div>
        </section>
    );
};

export default Newsletter;
