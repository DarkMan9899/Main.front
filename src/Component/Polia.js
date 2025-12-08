import React from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import "../styles/Polia.css";

const Polia = () => {
    const { t } = useTranslation();
    const { lang } = useParams();

    const openSocialMedia = (url) =>
        window.open(url, "_blank", "noopener,noreferrer");

    const features = [
        {
            title: t("polia.feature1.title"),
            description: t("polia.feature1.description"),
        },
        {
            title: t("polia.feature2.title"),
            description: t("polia.feature2.description"),
        },
        {
            title: t("polia.feature3.title"),
            description: t("polia.feature3.description"),
        },
        {
            title: t("polia.feature4.title"),
            description: t("polia.feature4.description"),
        },
    ];

    return (
        <section className="polia-container">
            <div className="container">
                {/* 🧠 Header Section */}
                <div className="polia-info">
                    <h2 className="polia-title">{t("polia.title")}</h2>
                    <p className="polia-description">{t("polia.subtitle")}</p>
                </div>

                {/* 💬 Button + Text */}

                {/* ✅ Features */}
                <div className="polia-left">
                    <div className="polia-grid">
                        {features.map((feature, index) => (
                            <div className="polia-item" key={index}>
                                <div className="polia-item-icon">
                                    <i className="fa-regular fa-circle-check"></i>
                                    {/*<h3 className="polia-item-name">{feature.title}</h3>*/}
                                </div>
                                <p className="polia-item-description">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="polia-button-wrap">
                    <p className="polia-description">{t("polia.assessmentText")}</p>
                    <button
                        onClick={() =>
                            openSocialMedia("https://bot.polyglotacademy.am/student-test_1")
                        }
                        className="button"
                    >
                        {t("polia.button")}
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Polia;
