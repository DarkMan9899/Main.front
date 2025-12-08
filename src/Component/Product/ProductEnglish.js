import React, { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { API_URL_Product_Details } from "../../api";
import  "../../styles/Product.css"

const isProduction = process.env.NODE_ENV === "production";
const BASE_URL = isProduction
    ? "https://main-api.academy-polyglot.site"
    : "http://localhost:5001";

function ProductEnglish() {
    const { t, i18n } = useTranslation("product_english"); // namespace
    const [product, setProduct] = useState(null);
    const productId = 1; // English course = product with ID=1

    useEffect(() => {
        axios
            .get(`${API_URL_Product_Details}${productId}?lang=${i18n.language}`)
            .then((res) => setProduct(res.data))
            .catch(() => console.error("Product not found"));
    }, [i18n.language]);

    if (!product) return <p>Loading...</p>;

    const levels = t("levels", { returnObjects: true });
    const structure = t("structure.list", { returnObjects: true });
    const faq = t("faq.list", { returnObjects: true });
    const formats = t("formats.list", { returnObjects: true });
    const packages = t("packages.list", { returnObjects: true });

    return (
        <div className="product-page">

            {/* HERO */}
            <section className="hero-section">
                <img
                    src={`${BASE_URL}${product.image}`}
                    alt={product.name}
                    className="hero-image"
                />

                <div className="hero-content">
                    <h1>{t("hero.title")}</h1>
                    <p>{t("hero.description")}</p>
                    <button className="btn-primary">{t("hero.cta")}</button>
                </div>
            </section>

            {/* LEVELS */}
            <section className="levels container">
                <h2>{t("levels_cta.button")}</h2>

                <div className="levels-grid">
                    {levels.map((lvl, i) => (
                        <div className="level-card" key={i}>
                            <h3>{lvl.title}</h3>
                            <p>{lvl.text}</p>
                        </div>
                    ))}
                </div>

                <button className="btn-secondary">{t("levels_cta.title")}</button>
            </section>

            {/* COURSE STRUCTURE */}
            <section className="structure container">
                <h2>{t("structure.title")}</h2>

                <ul>
                    {structure.map((item, i) => (
                        <li key={i}>• {item}</li>
                    ))}
                </ul>
            </section>

            {/* FAQ */}
            <section className="faq container">
                <h2>{t("faq.title")}</h2>

                <div className="faq-grid">
                    {faq.map((question, i) => (
                        <div className="faq-item" key={i}>
                            {question}
                        </div>
                    ))}
                </div>

                <button className="btn-primary">{t("faq.cta")}</button>
            </section>

            {/* FORMATS */}
            <section className="formats container">
                <h2>{t("formats.title")}</h2>

                <div className="formats-grid">
                    {formats.map((f, i) => (
                        <div className="format-card" key={i}>
                            {f}
                        </div>
                    ))}
                </div>
            </section>

            {/* PACKAGES */}
            <section className="packages container">
                <h2>{t("packages.title")}</h2>

                <div className="packages-grid">
                    {packages.map((pkg, i) => (
                        <div className="package-card" key={i}>
                            <h3>{pkg.name}</h3>
                            <p>{pkg.info}</p>
                            <button className="btn-secondary">{t("hero.cta")}</button>
                        </div>
                    ))}
                </div>
            </section>

            {/* PRICES (BACKEND) */}
            <section className="pricing container">
                <h2>{product.name}</h2>

                <p>Individual: {product.individual_price} AMD</p>
                <p>Group: {product.group_price} AMD</p>
            </section>

            {/* FINAL CTA */}
            <section className="final container">
                <button className="btn-primary">{t("final.cta")}</button>
            </section>

        </div>
    );
}

export default ProductEnglish;
