import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";
import "../styles/UniversalCoursePage.css";
import { API_URL_Product_Details } from "../api";

const BASE_URL =
    process.env.NODE_ENV === "production"
        ? "https://main-api.academy-polyglot.site"
        : "http://localhost:5001";

function UniversalCoursePage({ addToCart }) {
    const { id } = useParams();
    const { i18n, t } = useTranslation();

    const [product, setProduct] = useState(null);
    const [error, setError] = useState(null);

    const lang = i18n.language; // hy / ru / en
    const nameField = `name_${lang}`;
    const descriptionField = `description_${lang}`;

    /* ============ FETCH PRODUCT ============ */
    useEffect(() => {
        if (!id) {
            setError("Invalid product ID");
            return;
        }

        axios
            .get(`${API_URL_Product_Details}${id}`)
            .then((response) => {
                setProduct(response.data);
                setError(null);
            })
            .catch((error) => {
                if (error.response?.status === 404) {
                    setError("Product not found.");
                } else {
                    setError("Failed to load product.");
                }
            });
    }, [id]);

    if (error) return <p>{error}</p>;
    if (!product) return <p>Loading...</p>;

    /* ============ DYNAMIC TARIFF LIST ============ */
    const tariffMap = [
        { key: "individual_full_price", label: t("tariff.individual") },
        { key: "group2_full_price", label: t("tariff.group2") },
        { key: "group5_full_price", label: t("tariff.group5") },
        { key: "speaking_full_price", label: t("tariff.speaking") },
        { key: "accelerated_full_price", label: t("tariff.accelerated") },
        { key: "hybrid_full_price", label: t("tariff.hybrid") }
    ];

    return (
        <div className="course-page">

            {/* ============ COVER SECTION ============ */}
            <section className="cover">
                <img
                    src={`${BASE_URL}${product.image}`}
                    alt={product[nameField]}
                    className="cover-img"
                />

                <div className="cover-text">
                    <h1>{product[nameField]}</h1>
                    <p>{product[descriptionField]}</p>
                    <button className="cta">{t("course.cover.cta")}</button>
                </div>
            </section>

            {/* ============ LEVELS ============ */}
            <section className="levels container">
                <h2>{t("course.levels.title")}</h2>

                <div className="levels-grid">
                    {["A1", "A2", "B1", "B2", "C1"].map((level) => (
                        <div key={level} className="level-card">
                            <h3>{level} — {t(`course.levels.${level}.title`)}</h3>
                            <p>{t(`course.levels.${level}.desc`)}</p>
                        </div>
                    ))}
                </div>

                <button className="cta secondary">{t("course.levels.cta")}</button>
            </section>

            {/* ============ STRUCTURE ============ */}
            <section className="structure container">
                <h2>{t("course.structure.title")}</h2>
                <ul>
                    {["vocabulary", "grammar", "speaking", "listening", "reading", "writing"]
                        .map((item) => (
                            <li key={item}>• {t(`course.structure.${item}`)}</li>
                        ))}
                </ul>
            </section>

            {/* ============ FAQ ============ */}
            <section className="faq container">
                <h2>FAQ</h2>

                {["learn", "progress_check", "no_progress", "result", "reviews"].map((key) => (
                    <details key={key}>
                        <summary>{t(`course.faq.${key}.q`)}</summary>
                        <p>{t(`course.faq.${key}.a`)}</p>
                    </details>
                ))}

                <button className="cta">{t("course.faq.cta")}</button>
            </section>

            {/* ============ FORMATS ============ */}
            <section className="formats container">
                <h2>{t("course.formats.title")}</h2>
                <ul>
                    {["online_group", "online_individual", "intensive", "kids"].map((f) => (
                        <li key={f}>✔ {t(`course.formats.${f}`)}</li>
                    ))}
                </ul>
            </section>

            {/* ============ TARIFF PACKAGES ============ */}
            <section className="packages container">
                <h2>{t("course.packages.title")}</h2>

                <div className="packages-grid">

                    {tariffMap
                        .filter((tariff) => product[tariff.key]) // only existing tariffs
                        .map((tariff) => (
                            <div key={tariff.key} className="package-card">
                                <h3>{tariff.label}</h3>

                                <p className="price">{product[tariff.key]} AMD</p>

                                <button
                                    className="cta small"
                                    onClick={() =>
                                        addToCart({
                                            id: product.id,
                                            name: product[nameField],
                                            tariff: tariff.label,
                                            price: product[tariff.key],
                                            quantity: 1,
                                            image: product.image
                                        })
                                    }
                                >
                                    {t("course.packages.cta")}
                                </button>
                            </div>
                        ))}
                </div>
            </section>

            {/* ============ FINAL CTA ============ */}
            <section className="final">
                <h2>{t("course.final.title")}</h2>
                <button className="cta big">{t("course.final.cta")}</button>
            </section>

        </div>
    );
}

export default UniversalCoursePage;
