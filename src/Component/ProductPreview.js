import React from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../styles/ProductPreview.css";

/* 🔧 Environment-based API URL */
const isProduction = process.env.NODE_ENV === "production";
const BASE_URL = isProduction
    ? "https://main-api.academy-polyglot.site"
    : "http://localhost:5001";

/* 🖼️ Build full image URL safely */
const getImageUrl = (imagePath) => {
    if (!imagePath) return "/fallback-image.png";
    return `${BASE_URL.replace(/\/$/, "")}/${imagePath.replace(/^\//, "")}`;
};

function ProductPreview({ product }) {
    const { lang } = useParams();
    const { t } = useTranslation();

    /* 🧭 Smooth scroll to top on navigation */
    const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

    /* 🌐 Multilingual name fallback */
    const getLocalizedName = () => {
        if (!product) return "";
        if (lang === "hy" && product.name_hy) return product.name_hy;
        if (lang === "ru" && product.name_ru) return product.name_ru;
        if (lang === "en" && product.name_en) return product.name_en;
        return product.name || t("product.unnamed");
    };

    return (
        <div className="product-card-item">
            {/* 🖼️ Product image */}
            <img
                loading="lazy"
                src={getImageUrl(product.image)}
                alt={getLocalizedName()}
                className="product-image_p"
                onError={(e) => (e.target.src = "/fallback-image.png")}
            />

            {/* 🏷️ Product title */}
            <h3 className="product-name">{getLocalizedName()}</h3>

            {/* 🔗 Link to course details */}
            <Link
                to={`/${lang}/course/${product.id}`}
                className="product-link"
                onClick={scrollToTop}
            >
                <button className="view-details-button">{t("product.courses")}</button>
            </Link>

        </div>
    );
}

export default ProductPreview;
