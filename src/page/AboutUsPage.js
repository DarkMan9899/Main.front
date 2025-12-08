import React from "react";
import MyTeam from "../Component/DepartmentManagers";
import Gallery from "../Component/Gallery";
import SocialProgram from "../Component/SocialProgram";
import { useTranslation } from "react-i18next";
import "../styles/AboutUsePage.css";
import aboutTeam from "../Img/nkar - about us.jpg";
import { useParams } from "react-router-dom";


function AboutUsPage() {
    const { t } = useTranslation();
    const { lang } = useParams();


    return (
        <div className="about_page_wrapper">

            {/* ---------------- HERO SECTION ---------------- */}
            <section className="about_hero ">
                <div className="container about_hero1">
                    <div className="hero_text ">
                        <h1>{t("aboutPage.hero.title")}</h1>
                        <p>{t("aboutPage.hero.subtitle")}</p>
                        <div className="hero_buttons">
                            <a href={`/${lang}/products`}>{t("aboutPage.hero.btnCourses")}</a>
                            <a href={`/${lang}/teacher`}>{t("aboutPage.hero.btnTeam")}</a>
                        </div>


                    </div>
                    <div className="hero_image">
                        <img src={aboutTeam} alt={t("aboutPage.hero.alt")} loading="lazy" />
                    </div>
                </div>

            </section>

            {/* ---------------- STORY SECTION ---------------- */}
            <section className="story_section container">
                <h2>{t("aboutPage.story.title")}</h2>
                <p>{t("aboutPage.story.text")}</p>
            </section>

            {/* ---------------- VISION & VALUES ---------------- */}
            <section className="vision_values container">
                <h2>{t("aboutPage.vision.title")}</h2>

                <div className="vv_block">
                    <h3>{t("aboutPage.vision.missionTitle")}</h3>
                    <p>{t("aboutPage.vision.missionText")}</p>
                </div>

                <div className="vv_block">
                    <h3>{t("aboutPage.vision.visionTitle")}</h3>
                    <p>{t("aboutPage.vision.visionText")}</p>
                </div>

                <div className="vv_block">
                    <h3>{t("aboutPage.vision.valuesTitle")}</h3>
                    <ul>
                        {t("aboutPage.vision.values", { returnObjects: true }).map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </div>
                <Gallery />

            </section>


            {/* ---------------- COMPANY STRUCTURE ---------------- */}
            <section className="company_structure container">
                <h2>{t("aboutPage.structure.title")}</h2>
                <p>{t("aboutPage.structure.text")}</p>

                <ul>
                    {t("aboutPage.structure.list", { returnObjects: true }).map((item, i) => (
                        <li key={i}>{item}</li>
                    ))}
                </ul>

                {/*<h3>{t("aboutPage.structure.managersTitle")}</h3>*/}
                {/*<p>{t("aboutPage.structure.managersText")}</p>*/}
                <MyTeam />

            </section>

            {/* ---------------- WHY CHOOSE US ---------------- */}
            <section className="why_choose container">
                <h2>{t("aboutPage.why.title")}</h2>

                <div className="why_grid">
                    {t("aboutPage.why.list", { returnObjects: true }).map((item, i) => (
                        <div className="why_card" key={i}>
                            <div className="why_icon">⭐</div>
                            <p className="why_text">{item}</p>
                        </div>
                    ))}
                </div>
            </section>


            {/* GALLERY + SOCIAL PROGRAM + TEAM */}
            {/* ---------------- FINAL CTA ---------------- */}
            <section className="final_cta">
                <h2>{t("aboutPage.final.title")}</h2>
                <p>{t("aboutPage.final.text")}</p>

                <div className="cta_buttons">
                    <a href={`/${lang}/products`}>{t("aboutPage.final.btnCourses")}</a>
                    <a href={`/${lang}/contact`}>{t("aboutPage.final.btnRegister")}</a>
                </div>

            </section>

        </div>
    );
}

export default AboutUsPage;
