import React, { useRef, useState } from "react";
import Slider from "react-slick";
import { useTranslation } from "react-i18next";
import "../styles/SocialResponsibility.css";

// ✅ Sample logos (replace with your real ones)
import logo1 from "../Img/S1.png";
import logo2 from "../Img/S2.png";
import logo3 from "../Img/S3.png";
import logo4 from "../Img/S4.png";

const SocialResponsibility = () => {
    const { t } = useTranslation();
    const sliderRef = useRef(null);
    const [flippedIndex, setFlippedIndex] = useState(null);

    const cards = [
        {
            logo: logo1,
            name: t("social.card1"),
            description: t("social.desc1"),
        },
        {
            logo: logo2,
            name: t("social.card2"),
            description: t("social.desc2"),
        },
        {
            logo: logo3,
            name: t("social.card3"),
            description: t("social.desc3"),
        },
        {
            logo: logo4,
            name: t("social.card4"),
            description: t("social.desc4"),
        },
        // {
        //     logo: logo5,
        //     name: t("social.card5"),
        //     description: t("social.desc5"),
        // },
    ];

    const settings = {
        dots: false,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 3000, // ⏱️ 3-second rotation
        slidesToShow: 4,
        slidesToScroll: 1,
        pauseOnHover: true,
        arrows: false,
        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: 3 } },
            { breakpoint: 768, settings: { slidesToShow: 2 } },
            { breakpoint: 480, settings: { slidesToShow: 1 } },
        ],
    };

    const handleCardClick = (index) => {
        const slider = sliderRef.current;
        if (flippedIndex === index) {
            setFlippedIndex(null);
            slider && slider.slickPlay(); // ▶️ Resume autoplay
        } else {
            setFlippedIndex(index);
            slider && slider.slickPause(); // ⏸️ Pause when a card flips
        }
    };

    return (
        <section className="social-section">
            <div className="container">
                <h2 className="social-title">
                    {t("social.title")} <br />
                    {/*<span>{t("social.subtitle")}</span>*/}
                </h2>

                <Slider ref={sliderRef} {...settings}>
                    {cards.map((card, index) => (
                        <div key={index} className="social-slide">
                            <div
                                className={`social-card ${
                                    flippedIndex === index ? "flipped" : ""
                                }`}
                                onClick={() => handleCardClick(index)}
                            >
                                <div className="card-front">
                                    <img src={card.logo} alt={card.name} />
                                    <h3>{card.name}</h3>
                                </div>
                                <div className="card-back">
                                    <p>{card.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>
        </section>
    );
};

export default SocialResponsibility;
