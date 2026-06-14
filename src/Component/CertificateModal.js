import React, { useMemo } from "react";
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

    const formatDate = (dateString) => {
        if (!dateString) return "";
        return String(dateString).split("T")[0];
    };

    // ✅ attendance safe parsing (DB-ից ինչ էլ գա՝ number դարձնում ենք)
    const attendedHours = useMemo(() => {
        const raw = certificateData?.attendance ?? 0;
        const cleaned = String(raw).replace(/[^\d.]/g, "");
        const num = parseFloat(cleaned);
        return Number.isFinite(num) ? num : 0;
    }, [certificateData]);

    // ✅ REQUIRED HOURS: միայն 32 կամ 48
    const REQUIRED_HOURS = useMemo(() => {
        if (attendedHours === 48) return 48;
        return 32;
    }, [attendedHours]);

    const attendancePassed = attendedHours >= REQUIRED_HOURS;

    const checkCertificate = async () => {
        const code = certificateCode.trim();
        if (!code) return;

        setLoading(true);
        setErrorMessage("");
        setCertificateData(null);

        try {
            const res = await fetch(`${API_URL_Certificates}/check/${code}`);

            if (!res.ok) {
                setErrorMessage(t("certificateCheck.error"));
                return;
            }

            const data = await res.json();

            if (!data?.ok) {
                setErrorMessage(t("certificateCheck.notFound"));
                return;
            }

            setCertificateData(data.certificate);
        } catch (err) {
            setErrorMessage(t("certificateCheck.error"));
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") checkCertificate();
    };

    // ✅ Hook-երը արդեն կանչվել են, հիմա կարող ենք փակել
    if (!open) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose} aria-label="Close modal">
                    ×
                </button>

                {!certificateData && (
                    <>
                        <div className="modal_header1">
                            <h2>{t("certificateCheck.checkTitle")}</h2>

                            <input
                                type="text"
                                placeholder={t("certificateCheck.enterCode")}
                                value={certificateCode}
                                onChange={(e) => setCertificateCode(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />

                            <button
                                className="button"
                                onClick={checkCertificate}
                                disabled={loading || !certificateCode.trim()}
                            >
                                {loading ? t("certificateCheck.checking") : t("certificateCheck.check")}
                            </button>
                        </div>

                        {errorMessage && <p className="error">{errorMessage}</p>}
                    </>
                )}

                {certificateData && (
                    <>
                        <div className="certificate-status success">
                            ✔ {t("certificateCheck.verified")}
                        </div>

                        <section className="cert-section">
                            <h3 className="section-title">
                                <span className="icon">🎓</span>
                                {t("certificateView.studentData")}
                            </h3>

                            <p>
                                <strong>{t("certificateCheck.fullName")}:</strong>{" "}
                                {certificateData.full_name}
                            </p>

                            <p>
                                <strong>{t("certificateView.language")}:</strong>{" "}
                                {certificateData.course_name}
                            </p>

                            <p>
                                <strong>{t("certificateCheck.level")}:</strong>{" "}
                                {certificateData.level}
                            </p>

                            <p>
                                <strong>{t("certificateForm.format")}:</strong>{" "}
                                {certificateData.course_format}
                            </p>

                            <p>
                                <strong>{t("certificateForm.program")}:</strong>{" "}
                                {certificateData.program}
                            </p>
                        </section>

                        <section className="cert-section">
                            <h3 className="section-title">
                                <span className="icon">📄</span>
                                {t("certificateView.attendanceTitle")}
                            </h3>

                            <p>
                                <strong>{t("certificateForm.attendance")}:</strong> {attendedHours}
                            </p>



                        </section>

                        <section className="cert-section">
                            <p>
                                <strong>{t("certificateCheck.date")}:</strong>{" "}
                                {formatDate(certificateData.issue_date)}
                            </p>

                            <p>
                                <strong>{t("certificateCheck.code")}:</strong>{" "}
                                {certificateData.certificate_code}
                            </p>

                            <p>
                                <strong>{t("certificateView.validity")}:</strong>{" "}
                                {t("certificateView.unlimited")}
                            </p>
                        </section>

                        <section className="cert-section note-section">
                            <h3 className="section-title white">{t("certificateView.noteTitle")}</h3>

                            <p>{t("certificateView.speakingNote")}</p>

                            <p className="note-warning">{t("certificateView.notDiploma")}</p>
                        </section>

                        <section className="cert-section">
                            <h3>{t("certificateView.legal")}</h3>

                            <p>{t("certificateView.issuedBy")}</p>
                            <p>{t("certificateView.ministry")}</p>

                            <a
                                href="https://drive.google.com/drive/folders/15_Bebve7qXHKQczycD4XLqJ1X3JQ7Wi-?usp=sharing"
                                target="_blank"
                                rel="noreferrer"
                            >
                                {t("certificateView.viewOrders")}
                            </a>

                            <button className="button bt1" onClick={onClose}>
                                OK
                            </button>
                        </section>
                    </>
                )}
            </div>
        </div>
    );
}
