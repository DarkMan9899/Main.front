import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "../styles/WhyChoose.css";
import chooseImg from "../Img/IPA.png";

const WhyChoose = () => {
    const { t } = useTranslation();
    const [activeIndex, setActiveIndex] = useState(null);

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    const advantages = [
        {
            icon: "fa-solid fa-clock",
            title: t("why.flexible"),
            description: t("why.flexibleText"),
        },
        {
            icon: "fa-solid fa-certificate",
            title: t("why.certification"),
            description: t("why.certificationText"),
        },
        {
            icon: "fa-solid fa-graduation-cap",
            title: t("why.programs"),
            description: t("why.programsText"),
        },
        {
            icon: "fa-solid fa-chalkboard-teacher",
            title: t("why.formats"),
            description: t("why.formatsText"),
        },
        {
            icon: "fa-solid fa-handshake",
            title: t("why.partnerships"),
            description: t("why.partnershipsText"),
        },
    ];

    return (
        <section className="why-choose-section">
            <div className="container">
                {/* 🟣 Title spans full width */}
                <h2 className="why-choose-title">{t("why.title")}</h2>

                <div className="why-choose-container">
                    {/* 🖼️ Left Image */}
                    <div className="why-choose-image">
                        <img src={chooseImg} alt={t("why.title")} loading="lazy" />
                    </div>

                    {/* 📋 Right Accordion List */}
                    <div className="why-choose-content">
                        {advantages.map((item, index) => (
                            <div
                                key={index}
                                className={`why-item ${activeIndex === index ? "active" : ""}`}
                                onClick={() => toggleAccordion(index)}
                            >
                                <div className="why-item-header">
                                    <i className={item.icon}></i>
                                    <h3>{item.title}</h3>
                                    <i
                                        className={`fa-solid ${
                                            activeIndex === index ? "fa-chevron-up" : "fa-chevron-down"
                                        }`}
                                    ></i>
                                </div>
                                {activeIndex === index && (
                                    <p className="why-item-text">{item.description}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhyChoose;
