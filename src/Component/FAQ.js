import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "../styles/FAQ.css";
import faqImage from "../Img/faq.png"; // 🖼️ Replace with your actual image

const FAQ = () => {
    const { t } = useTranslation();
    const [activeIndex, setActiveIndex] = useState(null);

    const toggleQuestion = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    const faqItems = [
        {
            question: t("faq.q1"),
            answer: t("faq.a1"),
        },
        {
            question: t("faq.q2"),
            answer: t("faq.a2"),
        },
        {
            question: t("faq.q3"),
            answer: t("faq.a3"),
        },
        {
            question: t("faq.q4"),
            answer: t("faq.a4"),
        },
        {
            question: t("faq.q5"),
            answer: t("faq.a5"),
        },
    ];

    return (
        <section className="faq-section">
            <div className="container">
                {/* 🟣 Title across full width */}
                <h2 className="faq-title">{t("faq.title")}</h2>

                <div className="faq-container">
                    {/* 📸 Left Image */}
                    <div className="faq-image">
                        <img src={faqImage} alt="FAQ illustration" loading="lazy" />
                    </div>

                    {/* 🧠 Accordion on Right */}
                    <div className="faq-content">
                        {faqItems.map((item, index) => (
                            <div
                                key={index}
                                className={`faq-item ${activeIndex === index ? "active" : ""}`}
                                onClick={() => toggleQuestion(index)}
                            >
                                <div className="faq-header">
                                    <h3>{item.question}</h3>
                                    <i
                                        className={`fa-solid ${
                                            activeIndex === index ? "fa-chevron-up" : "fa-chevron-down"
                                        }`}
                                    ></i>
                                </div>
                                <div
                                    className="faq-body"
                                    style={{
                                        maxHeight: activeIndex === index ? "200px" : "0",
                                        opacity: activeIndex === index ? 1 : 0,
                                    }}
                                >
                                    <p>{item.answer}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FAQ;
