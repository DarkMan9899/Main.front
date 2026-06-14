
import React, { useState } from "react";
import axios from "axios";
import "../styles/ContactPage.css";
import { API_URL_Contact_Page } from "../api";
import Modal from "react-modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "react-i18next";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useParams } from "react-router-dom";

Modal.setAppElement("#root");

function ContactPage() {
    const { t } = useTranslation();
    const { lang } = useParams();

    // ✅ Language-based data
    const isGeorgian = lang === "ka";

    const email = isGeorgian
        ? "polyglotgeacademy@gmail.com"
        : "academy.polyglott@gmail.com";

    const instagram = isGeorgian
        ? "https://www.instagram.com/polya.academy?igsh=eW9oNHNzcm9lMzE3"
        : "https://www.instagram.com/academy.polyglot/";

    const facebook = isGeorgian
        ? "https://www.facebook.com/share/1HQY22cApR/?mibextid=wwXIfr"
        : "https://www.facebook.com/academypolyglot";

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [message, setMessage] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    /* =========================
       SUBMIT
    ========================= */
    const handleSubmit = async (e) => {
        e.preventDefault();

        const trimmedName = name.trim();
        const trimmedPhone = phone.trim();
        const trimmedMessage = message.trim();

        if (!trimmedName || !trimmedPhone) {
            toast.error(t("contact.toast.error"));
            return;
        }

        if (!/^\+\d{8,15}$/.test(trimmedPhone)) {
            toast.error(t("contact.toast.phone_invalid"));
            return;
        }

        setLoading(true);

        try {
            await axios.post(API_URL_Contact_Page, {
                name: trimmedName,
                phone: trimmedPhone,
                message: trimmedMessage,
            });

            setName("");
            setPhone("");
            setMessage("");
            setModalOpen(true);
        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                    t("contact.toast.error")
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="contact2">
                <div className="contact-title">
                    <h1>{t("contact.title")}</h1>
                    <p>{t("contact.description")}</p>
                </div>
            </div>

            <div className="contact-page">
                <ToastContainer />

                <div className="contact-wrapper">
                    <div className="contact-grid">

                        {/* LEFT INFO */}
                        <div className="contact-info">
                            <h3>{t("contact.info_title")}</h3>
                            <p>{t("contact.info_text")}</p>

                            <div className="contact-row">
                                <i className="fa-solid fa-phone"></i>
                                <span>{t("contact.phone")}</span>
                            </div>

                            <div className="contact-row">
                                <i className="fa-solid fa-location-dot"></i>
                                <span>{t("contact.address")}</span>
                            </div>

                            <div className="contact-row">
                                <i className="fa-solid fa-envelope"></i>
                                <span>{t("contact.email")}</span>
                            </div>

                            {/* ✅ Gmail */}
                            <a
                                href={`https://mail.google.com/mail/?view=cm&fs=1&to=${email}`}
    target="_blank"
rel="noopener noreferrer"
className="gmail-btn"
    >
    {t("contact.send_gmail")}
</a>

{/* ✅ Socials */}
<div className="contact-socials">
    <i
        className="fa-brands fa-facebook-f"
        onClick={() => window.open(facebook, "_blank")}
    />
    <i
        className="fa-brands fa-instagram"
        onClick={() => window.open(instagram, "_blank")}
    />
    <i
        className="fa-brands fa-telegram"
        onClick={() =>
            window.open("https://salebot.site/TG_1", "_blank")
        }
    />
    <i
        className="fa-brands fa-linkedin-in"
        onClick={() =>
            window.open(
                "https://www.linkedin.com/company/academy-polyglot/",
                "_blank"
            )
        }
    />
</div>
</div>

{/* RIGHT FORM */}
<form
    className="contact-form"
    onSubmit={handleSubmit}
    autoComplete="off"
>
    <div className="form-group">
        <label>{t("contact.form.name")}</label>
        <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
        />
    </div>

    <div className="form-group">
        <label>{t("contact.form.phone")}</label>
        <PhoneInput
            country="am"
            value={phone}
            onChange={(value) => setPhone(`+${value}`)}
            enableSearch
            countryCodeEditable={false}
            inputProps={{ required: true }}
            containerClass="phone-input-container"
            inputClass="phone-input"
            buttonClass="phone-input-flag"
        />
    </div>

    <div className="form-group">
        <label>{t("contact.form.message")}</label>
        <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
        />
    </div>

    <button
        type="submit"
        className="contact-submit"
        disabled={loading}
    >
        {loading
            ? t("contact.form.sending")
            : t("contact.form.submit")}
    </button>
</form>
</div>
</div>

{/* SUCCESS MODAL */}
<Modal
    isOpen={modalOpen}
    onRequestClose={() => setModalOpen(false)}
    className="modal_contact"
    overlayClassName="modal-overlay"
>
    <p className="modal-text">
        {t("contact.modal.success")}
    </p>

    <div className="modal-buttons">
        <button onClick={() => setModalOpen(false)}>
            {t("contact.modal.close")}
        </button>
    </div>
</Modal>
</div>
</div>
);
}

export default ContactPage;

