import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { API_URL_Certificates } from "../api";
import "../styles/CertificateForm.css";

export default function CertificateForm() {
    const { t, i18n } = useTranslation();

    const defaultProgram = t("certificateForm.programOptions.cambridge");

    const [form, setForm] = useState({
        fullName: "",
        courseName: "",
        level: "",
        program: defaultProgram,
        attendance: "",
        course_format: "",
        certificateCode: "",
        issueDate: "",
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    // ✅ եթե լեզուն փոխվեց՝ program-ը թարմանա
    useEffect(() => {
        setForm((prev) => ({
            ...prev,
            program: t("certificateForm.programOptions.cambridge"),
        }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [i18n.language]);

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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

            // ✅ reset + պահում ենք defaultProgram-ը
            setForm({
                fullName: "",
                courseName: "",
                level: "",
                program: t("certificateForm.programOptions.cambridge"),
                attendance: "",
                course_format: "",
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

                    <select name="level" value={form.level} onChange={handleChange} required>
                        <option value="">{t("certificateForm.selectLevel")}</option>

                        <option value="English Level 0-A1">
                            {t("certificateForm.levelOptions.en_0_a1")}
                        </option>
                        <option value="English Level A1-A2">
                            {t("certificateForm.levelOptions.en_a1_a2")}
                        </option>
                        <option value="English Level A2-B1">
                            {t("certificateForm.levelOptions.en_a2_b1")}
                        </option>
                        <option value="English Level B1-B2">
                            {t("certificateForm.levelOptions.en_b1_b2")}
                        </option>
                        <option value="English Level B2-C1">
                            {t("certificateForm.levelOptions.en_b2_c1")}
                        </option>
                        <option value="English Level C1-C2">
                            {t("certificateForm.levelOptions.en_c1_c2")}
                        </option>

                        <option value="Speaking club A1-A2">
                            {t("certificateForm.levelOptions.speaking_a1_a2")}
                        </option>
                        <option value="Speaking club B1-B2">
                            {t("certificateForm.levelOptions.speaking_b1_b2")}
                        </option>
                        <option value="Speaking club C1">
                            {t("certificateForm.levelOptions.speaking_c1")}
                        </option>

                        <option value="Armenian easy">
                            {t("certificateForm.levelOptions.hy_easy")}
                        </option>

                        <option value="Russian Level 0-A1">
                            {t("certificateForm.levelOptions.ru_0_a1")}
                        </option>
                        <option value="Russian Level A1-A2">
                            {t("certificateForm.levelOptions.ru_a1_a2")}
                        </option>
                        <option value="Russian Level A2-B1">
                            {t("certificateForm.levelOptions.ru_a2_b1")}
                        </option>
                        <option value="Russian Level B1-B2">
                            {t("certificateForm.levelOptions.ru_b1_b2")}
                        </option>
                        <option value="Russian Level B2-C1">
                            {t("certificateForm.levelOptions.ru_b2_c1")}
                        </option>

                        <option value="German Level 0-A1">
                            {t("certificateForm.levelOptions.de_0_a1")}
                        </option>
                        <option value="German Level A1-A2">
                            {t("certificateForm.levelOptions.de_a1_a2")}
                        </option>
                        <option value="German Level A2-B1">
                            {t("certificateForm.levelOptions.de_a2_b1")}
                        </option>
                        <option value="German Level B1-B2">
                            {t("certificateForm.levelOptions.de_b1_b2")}
                        </option>

                        <option value="Spanish Level 0-A1">
                            {t("certificateForm.levelOptions.es_0_a1")}
                        </option>
                        <option value="Spanish Level A1-A2">
                            {t("certificateForm.levelOptions.es_a1_a2")}
                        </option>
                        <option value="Spanish Level A2-B1">
                            {t("certificateForm.levelOptions.es_a2_b1")}
                        </option>

                        <option value="French Level 0-A1">
                            {t("certificateForm.levelOptions.fr_0_a1")}
                        </option>
                        <option value="French Level A1-A2">
                            {t("certificateForm.levelOptions.fr_a1_a2")}
                        </option>
                        <option value="French Level A2-B1">
                            {t("certificateForm.levelOptions.fr_a2_b1")}
                        </option>
                        <option value="French Level A1-A2">
                            {t("certificateForm.levelOptions.IELTS—advanced")}
                        </option>
                        <option value="French Level A2-B1">
                            {t("certificateForm.levelOptions.IELTS Easy")}
                        </option>
                    </select>
                </div>

                <div className="form-group">
                    <label>{t("certificateForm.program")}</label>
                    <input
                        type="text"
                        name="program"
                        value={form.program}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>{t("certificateForm.attendance")}</label>
                    <input
                        type="text"
                        name="attendance"
                        value={form.attendance}
                        onChange={handleChange}
                        placeholder="29 / 48"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>{t("certificateForm.format")}</label>

                    <select
                        name="course_format"
                        value={form.course_format}
                        onChange={handleChange}
                        required
                    >
                        <option value="">{t("certificateForm.selectFormat")}</option>

                        <option value={t("certificateForm.formatOptions.individual")}>
                            {t("certificateForm.formatOptions.individual")}
                        </option>

                        <option value={t("certificateForm.formatOptions.online")}>
                            {t("certificateForm.formatOptions.online")}
                        </option>
                    </select>
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
