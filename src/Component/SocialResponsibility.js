import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "../styles/SocialResponsibility.css";

// Logos
import logo1 from "../Img/logo1/zinvori-tun.png";
import logo4 from "../Img/logo1/ՄԵՄ.png";

const SocialResponsibility = () => {
    const { t } = useTranslation();
    const [flippedIndex, setFlippedIndex] = useState(null);

    const cards = [
        {
            logo: logo1,
            name: t("social.card1"),
            description: t("social.desc1"),
            description2: t("social.desc22"),
        },
        {
            logo: logo4,
            name: t("social.card2"),
            description: t("social.desc2"),
            description2: t("social.desc33"),
        },
    ];

    const handleCardClick = (index) => {
        setFlippedIndex(flippedIndex === index ? null : index);
    };

    return (
        <section className="social-section">
            <div className="container">
                <h2 className="social-title">{t("social.title")}</h2>

                <p className="social-subtitle">{t("social.title2")}</p>

                <div className="social-grid">
                    {cards.map((card, index) => (
                        <div
                            key={index}
                            className={`social-card ${
                                flippedIndex === index ? "flipped" : ""
                            }`}
                            onClick={() => handleCardClick(index)}
                        >
                            {/* FRONT */}
                            <div className="card-front">
                                <img src={card.logo} alt={card.name} loading="lazy" />
                                <h3>{card.name}</h3>
                                <div className="card-highlight">
                                    {card.description2}
                                </div>
                            </div>

                            {/* BACK */}
                            <div className="card-back">
                                <p>{card.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SocialResponsibility;
