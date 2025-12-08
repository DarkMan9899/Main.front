import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { API_URL_Certificates } from "../api";
import "../styles/CertificateForm.css";

export default function CertificateForm() {
    const { t } = useTranslation();

    const [form, setForm] = useState({
        fullName: "",
        courseName: "",
        level: "",
        certificateCode: "",
        issueDate: "",
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            const res = await fetch(API_URL_Certificates, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!data.ok) throw new Error(data.message);

            setMessage(t("certificateForm.success"));
            setForm({
                fullName: "",
                courseName: "",
                level: "",
                certificateCode: "",
                issueDate: "",
            });
        } catch (err) {
            setError(t("certificateForm.error"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="certificate-container">
            <h1 className="certificate-title">{t("certificateForm.title")}</h1>

            <form className="certificate-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>{t("certificateForm.fullName")}</label>
                    <input
                        type="text"
                        name="fullName"
                        value={form.fullName}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>{t("certificateForm.courseName")}</label>
                    <input
                        type="text"
                        name="courseName"
                        value={form.courseName}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>{t("certificateForm.level")}</label>
                    <input
                        type="text"
                        name="level"
                        value={form.level}
                        onChange={handleChange}
                        placeholder="A1 / Beginner / …"
                    />
                </div>

                <div className="form-group">
                    <label>{t("certificateForm.code")}</label>
                    <input
                        type="text"
                        name="certificateCode"
                        value={form.certificateCode}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>{t("certificateForm.date")}</label>
                    <input
                        type="date"
                        name="issueDate"
                        value={form.issueDate}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button className="button" type="submit" disabled={loading}>
                    {loading ? t("certificateForm.sending") : t("certificateForm.submit")}
                </button>
            </form>

            {message && <p className="success">{message}</p>}
            {error && <p className="error">{error}</p>}
        </div>
    );
}
