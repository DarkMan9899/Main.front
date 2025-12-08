import React from "react";
import Slider from "react-slick";
import { useTranslation } from "react-i18next";
import "../styles/Partners.css";

// 🖼️ Partner logos (replace with real ones)
import partner1 from "../Img/nkar - about us.jpg";
import partner2 from "../Img/nkar - about us.jpg";
import partner3 from "../Img/nkar - about us.jpg";
import partner4 from "../Img/nkar - about us.jpg";
import partner5 from "../Img/nkar - about us.jpg";
import partner6 from "../Img/nkar - about us.jpg";

const Partners = () => {
    const { t } = useTranslation();

    const partners = [
        { id: 1, name: "UNICEF", logo: partner1 },
        { id: 2, name: "British Council", logo: partner2 },
        { id: 3, name: "Teach For Armenia", logo: partner3 },
        { id: 4, name: "Caritas Armenia", logo: partner4 },
        { id: 5, name: "World Vision", logo: partner5 },
        { id: 6, name: "Red Cross Armenia", logo: partner6 }
    ];

    const settings = {
        dots: false,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 3000, // 3-second rotation
        slidesToShow: 5,
        slidesToScroll: 1,
        arrows: false,
        pauseOnHover: true,
        responsive: [
            { breakpoint: 1200, settings: { slidesToShow: 4 } },
            { breakpoint: 992, settings: { slidesToShow: 3 } },
            { breakpoint: 768, settings: { slidesToShow: 2 } },
            { breakpoint: 480, settings: { slidesToShow: 1 } }
        ]
    };

    return (
        <section className="partners-section">
            <div className="container">
                <h2 className="partners-title">{t("partners.title")}</h2>
                <Slider {...settings} className="partners-slider">
                    {partners.map((p) => (
                        <div key={p.id} className="partner-card">
                            <img src={p.logo} alt={p.name} loading="lazy" />
                        </div>
                    ))}
                </Slider>
            </div>
        </section>
    );
};

export default Partners;
