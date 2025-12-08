import React from "react";
import { useTranslation } from "react-i18next";
import "../styles/CertificateModal.css";
import { API_URL_Certificates } from "../api";

export default function CertificateModal({
                                             open,
                                             onClose,
                                             certificateCode,
                                             setCertificateCode,
                                             certificateData,
                                             setCertificateData,
                                             loading,
                                             setLoading,
                                             errorMessage,
                                             setErrorMessage,
                                         }) {
    const { t } = useTranslation();

    if (!open) return null; // ⛔ եթե փակ է՝ չենք նկարում մոդալը

    const checkCertificate = async () => {
        if (!certificateCode.trim()) return;

        setLoading(true);
        setErrorMessage("");
        setCertificateData(null);

        try {
            const res = await fetch(`${API_URL_Certificates}/check/${certificateCode}`);
            const data = await res.json();

            if (!data.ok) {
                setErrorMessage(t("certificateCheck.notFound"));
            } else {
                setCertificateData(data.certificate);
            }
        } catch (err) {
            setErrorMessage(t("certificateCheck.error"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>

                {/* ՄՈԴԱԼԻ գլուխ */}
                {!certificateData && (
                    <>
                        <h2>{t("certificateCheck.checkTitle")}</h2>

                        <input
                            type="text"
                            placeholder={t("certificateCheck.enterCode")}
                            value={certificateCode}
                            onChange={(e) => setCertificateCode(e.target.value)}
                        />

                        <button className="button" onClick={checkCertificate}>
                            {loading ? t("certificateCheck.checking") : t("certificateCheck.check")}
                        </button>

                        {errorMessage && <p className="error">{errorMessage}</p>}
                    </>
                )}

                {/* Արդյունքը */}
                {certificateData && (
                    <>
                        <h2>{t("certificateCheck.valid")}</h2>

                        <p><strong>{t("certificateCheck.fullName")}:</strong> {certificateData.full_name}</p>

                        <p><strong>{t("certificateCheck.course")}:</strong> {certificateData.course_name}</p>

                        <p><strong>{t("certificateCheck.level")}:</strong> {certificateData.level}</p>

                        <p><strong>{t("certificateCheck.date")}:</strong> {certificateData.issue_date}</p>

                        <p><strong>{t("certificateCheck.code")}:</strong> {certificateData.certificate_code}</p>

                        <div className="approved-box">
                            {t("certificateCheck.approved")}
                        </div>

                        <button className="button" onClick={onClose}>OK</button>
                    </>
                )}

            </div>
        </div>
    );
}
