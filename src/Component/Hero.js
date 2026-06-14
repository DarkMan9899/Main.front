import React from "react";
import {useTranslation} from "react-i18next";
import "../styles/Hero.css";

function Hero() {
    const {t} = useTranslation();

    return (
        <section className="hero">
            <div className=" container">
                <div className="hero-content">
                    <h1>
                        {t("hero.welcome")} Polya
                    </h1>

                    <p>{t("hero.item1.title")}</p>
                </div>
            </div>
        </section>
    );
}

export default Hero;
