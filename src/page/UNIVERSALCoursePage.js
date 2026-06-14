import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import axios from "axios";
import {useTranslation} from "react-i18next";
import "../styles/UniversalCoursePage.css";
import {API_URL_Product_Details} from "../api";
import faq2 from "../Img/Faq2.png";
import {useLocation} from "react-router-dom";
import { track } from "../utils/analytics";



const BASE_URL =
    process.env.NODE_ENV === "production"
        ? "https://main-api.academy-polyglot.site"
        : "http://localhost:5001";

function UniversalCoursePage({addToCart}) {
    const {id} = useParams();
    const {i18n, t} = useTranslation();

    const [product, setProduct] = useState(null);
    const [error, setError] = useState(null);
    const [openIndex, setOpenIndex] = useState(null);
    const [priceMode, setPriceMode] = useState("full"); // full | monthly
    const location = useLocation();


    const lang = i18n.language;
    const nameField = `name_${lang}`;
    const descriptionField = `description_${lang}`;


    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const scrollTarget = params.get("scroll");

        if (scrollTarget !== "packages") return;

        let attempts = 0;
        const maxAttempts = 20;

        const tryScroll = () => {
            const el = document.getElementById("packages");

            if (el) {
                el.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
                return;
            }

            attempts++;
            if (attempts < maxAttempts) {
                setTimeout(tryScroll, 150);
            }
        };

        tryScroll();
    }, [location.search]);

    useEffect(() => {
        axios
            .get(`${API_URL_Product_Details}${id}`)
            .then(res => setProduct(res.data))
            .catch(() => setError("Failed to load product"));
    }, [id]);

    if (error) return <p>{error}</p>;
    if (!product) return <p>Loading...</p>;

    /* ===== PRICING CONFIG (NO DB CHANGE) ===== */
    const tariffMap = [
        {
            label: t("tariff.individual"),
            fullKey: "individual_full_price",
            monthlyKey: "individual_monthly_price",
        },
        {
            label: t("tariff.group2"),
            fullKey: "group2_full_price",
            monthlyKey: "group2_monthly_price",
        },
        {
            label: t("tariff.group5"),
            fullKey: "group5_full_price",
            monthlyKey: "group5_monthly_price",
        },
        {
            label: t("tariff.speaking"),
            fullKey: "speaking_full_price",
            monthlyKey: "speaking_monthly_price",
        },
        {
            label: t("tariff.accelerated"),
            fullKey: "accelerated_full_price",
            monthlyKey: "accelerated_monthly_price",
        },
        {
            label: t("tariff.hybrid"),
            fullKey: "hybrid_full_price",
            monthlyKey: "hybrid_monthly_price",
        },

        // ✅ NEW: Native Speaker (Russian)
        {
            label: t("tariff.native_individual"),
            fullKey: "native_individual_price",
            monthlyKey: "native_individual_price",
        },
        {
            label: t("tariff.native_group"),
            fullKey: "native_group_price",
            monthlyKey: "native_group_price",
        },
        {
            label: t("tariff.native_speaking"),
            fullKey: "native_speaking_price",
            monthlyKey: "native_speaking_price",
        },

        // ✅ NEW: Kids
        {
            label: t("tariff.kids_individual"),
            fullKey: "kids_individual_price",
            monthlyKey: "kids_individual_price",
        },

        // ✅ NEW: IELTS EASY
        {
            label: t("tariff.ielts_easy_group"),
            fullKey: "ielts_easy_group_full",
            monthlyKey: "ielts_easy_group_monthly",
        },
        {
            label: t("tariff.ielts_easy_individual"),
            fullKey: "ielts_easy_individual_full",
            monthlyKey: "ielts_easy_individual_monthly",
        },

        // ✅ NEW: IELTS ADVANCED
        {
            label: t("tariff.ielts_advanced_group"),
            fullKey: "ielts_advanced_group_full",
            monthlyKey: "ielts_advanced_group_monthly",
        },
        {
            label: t("tariff.ielts_advanced_individual"),
            fullKey: "ielts_advanced_individual_full",
            monthlyKey: "ielts_advanced_individual_monthly",
        },

        // ✅ NEW: Armenian pairs (one-time/full only)
        {
            label: t("tariff.english_armenian"),
            fullKey: "english_armenian_full",
            monthlyKey: "english_armenian_full", // monthly mode-ում էլ նույնը ցույց կտա
        },
        {
            label: t("tariff.russian_armenian"),
            fullKey: "russian_armenian_full",
            monthlyKey: "russian_armenian_full",
        },
    ];

    const faqKeys = [
        "learn",
        "progress_check",
        "no_progress",
        "result"
    ];

    return (
        <div className="course-page">

            {/* COVER */}
            <section className="cover">
                <div className="cover-text">
                    <h1>{product[nameField]}{' '}
                        {t('course.cover.title')}</h1>
                    <p className="cover-subtitle"> {t('course.cover.subtitle')}</p>

                    <button
                        className="cta"
                        onClick={() =>
                            window.open("https://sbsite.pro//Polyglott_1", "_blank")
                        }
                    >
                        {t("course.cover.cta")}
                    </button>
                </div>
            </section>

            {/* LEVELS */}
            <section className="levels-section">
                <div className="levels-section container">
                    <h2 className="levels-title">{t("course.levels.title")}</h2>
                    <div className="levels-grid">
                        {["A1", "A2", "B1", "B2", "C1"].map(level => (
                            <div key={level} className="level-card">
                                <div className="level-head">
                                    <span className="level-code">{level}</span>
                                    <span className="level-name">
                                    {t(`course.levels.${level}.title`)}
                                </span>
                                </div>
                                <p className="level-desc">
                                    {t(`course.levels.${level}.desc`)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* STRUCTURE */}
            <section>
                <div className="structure-grid container">
                    <h3>{t("course.structure.title")}</h3>
                    <div className="structure-head">
                        <div className="structure-card">
                            <ul className="structure-list">
                                {["vocabulary", "grammar", "speaking",].map(i => (
                                    <li key={i}>{t(`course.structure.${i}`)}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="structure-card">
                            <ul className="structure-list">
                                {["listening", "reading", "writing"].map(i => (
                                    <li key={i}>{t(`course.structure.${i}`)}</li>
                                ))}
                            </ul>
                        </div>

                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="faq-section1">
                <div className="container">
                    <h2 className="faq-title2">{t("course.faq.title")}</h2>
                    <div className="faq-grid ">
                        <div className="faq-list">
                            {faqKeys.map((key, index) => {
                                const isOpen = openIndex === index;

                                return (
                                    <div
                                        key={key}
                                        className={`faq-item ${isOpen ? "open" : ""}`}
                                        onClick={() =>
                                            setOpenIndex(isOpen ? null : index)
                                        }
                                    >
                                        <div className="faq-question">
                                            {t(`course.faq.${key}.q`)}
                                            <span className="faq-arrow">
                                            {isOpen ? "−" : "+"}
                                        </span>
                                        </div>

                                        {isOpen && (
                                            <div className="faq-answer">
                                                {t(`course.faq.${key}.a`)}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        <div className="faq-illustration">
                            <img src={faq2} alt="FAQ"/>
                        </div>
                    </div>
                </div>


            </section>

            {/* PRICING */}
            <section id="packages">
                <div className="container">
                    <h2 className="section-title">
                        {t("course.packages.title")}
                    </h2>

                    {/* TOGGLE */}
                    <div className="price-toggle">
                        <button
                            className={priceMode === "full" ? "active" : ""}
                            onClick={() => setPriceMode("full")}
                        >
                            {t("course.packages.full")}
                        </button>

                        <button
                            className={priceMode === "monthly" ? "active" : ""}
                            onClick={() => setPriceMode("monthly")}
                        >
                            {t("course.packages.monthly")}
                        </button>
                    </div>

                    <div className="packages-grid">
                        {tariffMap
                            .filter(tariff => {
                                const key =
                                    priceMode === "full"
                                        ? tariff.fullKey
                                        : tariff.monthlyKey;

                                return product[key] && Number(product[key]) > 0;
                            })
                            .map(tariff => {
                                const key =
                                    priceMode === "full"
                                        ? tariff.fullKey
                                        : tariff.monthlyKey;

                                return (
                                    <div key={tariff.label} className="package-card">
                                        <h3>{tariff.label}</h3>

                                        <div className="price">
                                            {Number(product[key]).toLocaleString()}
                                            <span className="price-suffix">
                                    {priceMode === "monthly"
                                        ? t("course.packages.per_month")
                                        : t("course.packages.one_time")}
                                </span>
                                        </div>

                                        <button
                                            className="cta small"
                                            onClick={() => {

                                                const cartItem = {
                                                    id: product.id,
                                                    name: product[nameField],
                                                    selectedType: `${tariff.fullKey}_${priceMode}`,
                                                    displayType: tariff.label,
                                                    price: product[key],
                                                    billing: priceMode,
                                                    image: product.image
                                                };

                                                addToCart(cartItem);

                                                // 📊 GOOGLE ANALYTICS EVENT
                                                track("add_to_cart", {
                                                    currency: "AMD",
                                                    value: product[key],
                                                    items: [
                                                        {
                                                            item_id: String(product.id),
                                                            item_name: product[nameField],

                                                            item_category: product[nameField],   // ← ՍԱ ԱՅՍՏԵՂ
                                                            item_variant: tariff.label,          // ← ՍԱ ԱՅՍՏԵՂ

                                                            price: product[key],
                                                            quantity: 1
                                                        }
                                                    ]
                                                });

                                            }}

                                        >
                                            {t("course.packages.cta")}
                                        </button>
                                    </div>
                                );
                            })}
                    </div>
                </div>
            </section>


        </div>
    );
}

export default UniversalCoursePage;
