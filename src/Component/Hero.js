import React from "react";
import { useTranslation } from "react-i18next";
import "../styles/Hero.css";
import hero from "../Img/glxavor ej.png";

function Hero() {
    const { t } = useTranslation(); // 🌍 Translation hook

    return (
        <section className="hero">
            <div className="hero-cont">
                {/* 🧾 Text Section */}
                <div className="hero-text">
          <span>
            {t("hero.welcome")} <br /> Polyglot Academy
          </span>

                    <ul className="custom-arrow">
                        <li>
                            <b>{t("hero.item1.title")}</b> {t("hero.item1.text")}
                        </li>
                        <li>
                            <b>{t("hero.item2.title")}</b> {t("hero.item2.text")}
                        </li>
                        <li>
                            <b>{t("hero.item3.title")}</b> {t("hero.item3.text")}
                        </li>
                    </ul>
                </div>

                {/* 🖼️ Image */}
                <img
                    alt={t("hero.alt")}
                    src={hero}
                    loading="lazy"
                    className="hero-img"
                    onError={(e) => (e.target.src = "fallback-image.png")}
                />
            </div>
        </section>
    );
}

export default Hero;
