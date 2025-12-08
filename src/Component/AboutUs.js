import React from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../styles/AboutUs.css";
import about from "../Img/nkar - about us.jpg";

function AboutUs() {
    const { lang } = useParams(); // 🌍 Get current language from URL
    const { t } = useTranslation(); // 🌐 Load translations

    return (
        <section className="about-us">
            <div className="container_about container">
                {/* 🖼️ About Image */}
                <img
                    src={about}
                    alt={t("about.alt")}
                    className="about-image"
                    loading="lazy"
                    onError={(e) => {
                        e.target.src = "fallback-image.png";
                    }}
                />

                {/* 🧾 About Text */}
                <div className="text-about">
                    <span>{t("about.title")}</span>
                    <p>{t("about.description")}</p>

                    <div className="about_us_button">
                        <Link to={`/${lang}/aboutus`} className="button">
                            {t("about.button")}
                        </Link>
                    </div>

                </div>
            </div>
        </section>
    );
}

export default AboutUs;
