import React from "react";
import MyTeam from "../Component/DepartmentManagers";
import Gallery from "../Component/Gallery";
import { useTranslation } from "react-i18next";
import "../styles/AboutUsePage.css";
import aboutTeam from "../Img/8.png";
import { Link, useParams } from "react-router-dom";

function AboutUsPage() {
    const { t } = useTranslation();
    const { lang } = useParams();

    const visionValues = t("aboutPage.vision.values", {
        returnObjects: true,
        defaultValue: [],
    });

    const structureChips = [
        { label: t("aboutPage.structure.list.0"), target: "teacher" },
        { label: t("aboutPage.structure.list.1"), target: "marketing" },
        { label: t("aboutPage.structure.list.2"), target: "sales" },
        { label: t("aboutPage.structure.list.3"), target: "support" },
        { label: t("aboutPage.structure.list.4"), target: "tech" },
    ];



    const whyList = t("aboutPage.why.list", {
        returnObjects: true,
        defaultValue: [],
    });

    return (
        <div className="about_page_wrapper">
            <section className="about_hero"            >
                <div className="about_hero_overlay" />

                <div className="about_hero_content">
                    <div className="about_hero_text">
                        <h1>{t("aboutPage.hero.title")}</h1>
                        <p>{t("aboutPage.hero.subtitle")}</p>

                        <div className="about_hero_buttons">
                            <a className="button" href={`/${lang}/products`}>
                                {t("aboutPage.hero.btnCourses")}
                            </a>
                            <a className="button button_secondary" href={`/${lang}/teacher`}>
                                {t("aboutPage.hero.btnTeam")}
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <section className="story_section container">
                <h2>{t("aboutPage.story.title")}</h2>
                <p>{t("aboutPage.story.text")}</p>
            </section>


            {/* ============ VISION / MISSION / VALUES + IMAGE ============ */}
            <section className="about_vision_section">
                <div className="container about_vision_grid">
                    <div className="about_vision_left">
                        <h2>{t("aboutPage.vision.title")}</h2>

                        {/* Mission */}
                        <div className="about_feature">
                            <div className="about_feature_icon">✔</div>
                            <div className="about_feature_content">
                                <h3>{t("aboutPage.vision.missionTitle")}</h3>
                                <p>{t("aboutPage.vision.missionText")}</p>
                            </div>
                        </div>

                        {/* Vision */}
                        <div className="about_feature">
                            <div className="about_feature_icon">✔</div>
                            <div className="about_feature_content">
                                <h3>{t("aboutPage.vision.visionTitle")}</h3>
                                <p>{t("aboutPage.vision.visionText")}</p>
                            </div>
                        </div>

                        {/* Values */}
                        <div className="about_feature">
                            <div className="about_feature_icon">✔</div>
                            <div className="about_feature_content">
                                <h3>{t("aboutPage.vision.valuesTitle")}</h3>
                                {Array.isArray(visionValues) && visionValues.length > 0 ? (
                                    <ul>
                                        {visionValues.map((item, idx) => (
                                            <li key={idx}>{item}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>{t("aboutPage.vision.valuesFallback", "")}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="about_vision_right">
                        <div className="about_vision_image_box">
                            <img
                                src={aboutTeam}
                                alt={t("aboutPage.vision.alt", "Vision Image")}
                                loading="lazy"
                            />
                        </div>
                    </div>
                </div>

                {/* ԳԼԽԱՎՈՐ ԳԱԼԵՐԵԱ – ներքևի նկարների շարքը (4 նկար) */}
                <div className="container about_gallery_section">
                    <Gallery />
                </div>
            </section>

            {/* ============ COMPETENCIES / STRUCTURE STRIP ============ */}
            <section className="about_structure_section">
                <div className="container">
                    <div className="text_about_structure_sect">
                        <h2 className="text-center">
                            {t("aboutPage.structure.title")}
                        </h2>

                        <p className="about_structure_text text-center">
                            {t("aboutPage.structure.text")}
                        </p>
                    </div>


                    <div className="about_structure_chips">
                        {structureChips.map((item, index) => (
                            <Link
                                key={index}
                                to={`/${lang}/teacher#${item.target}`}
                                className="structure_chip structure_chip_button"
                            >
                                <div className="structure_chip_icon">✓</div>
                                <span>{item.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============ TEAM SECTION (kept separate) ============ */}
            <section className="about_team_section">
                <div className="container">
                    <MyTeam />
                </div>
            </section>

            {/* ============ WHY CHOOSE US – STATS / CARDS ============ */}
            <section className="about_why_section">
                <div className="container">
                    <h2>{t("aboutPage.why.title")}</h2>

                    <div className="about_why_grid">
                        {Array.isArray(whyList) &&
                            whyList.map((item, index) => (
                                <div className="about_why_card" key={index}>
                                    <div className="about_why_icon">✔</div>
                                    <p>{item}</p>
                                </div>
                            ))}
                    </div>
                </div>
            </section>

            {/* ============ FINAL CTA ============ */}
            <section className="final_cta_section">
                <div className="container final_cta_inner">
                    <h2>{t("aboutPage.final.title")}</h2>
                    <p>{t("aboutPage.final.text")}</p>

                    <div className="final_cta_buttons">
                        <a className="button" href={`/${lang}/products`}>
                            {t("aboutPage.final.btnCourses")}
                        </a>
                        <a className="button button_secondary" href={`https://bot.polyglotacademy.am/student-test_1`}>
                            {t("aboutPage.final.btnRegister")}
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default AboutUsPage;
