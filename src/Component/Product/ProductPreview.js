import React from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../../styles/ProductPreview.css";

const isProduction = process.env.NODE_ENV === "production";
const BASE_URL = isProduction
    ? "https://main-api.academy-polyglot.site"
    : "http://localhost:5001";

const getImageUrl = (imagePath) => {
    if (!imagePath) return "/fallback-image.png";
    return `${BASE_URL.replace(/\/$/, "")}/${imagePath.replace(/^\//, "")}`;
};

function ProductPreview({ product }) {
    const { lang } = useParams();
    const { t } = useTranslation();

    const getLocalizedName = () => {
        if (!product) return "";
        if (lang === "hy" && product.name_hy) return product.name_hy;
        if (lang === "ru" && product.name_ru) return product.name_ru;
        if (lang === "en" && product.name_en) return product.name_en;
        if (lang === "ka" && product.name_ka) return product.name_ka;
        return product.name || t("product.unnamed");
    };

    return (
        <div className="product-card-item">
            <img
                loading="lazy"
                src={getImageUrl(product.image)}
                alt={getLocalizedName()}
                className="product-image_p"
                onError={(e) => {
                    e.currentTarget.src = "/fallback-image.png";
                }}
            />

            <h3 className="product-name">{getLocalizedName()}</h3>

            <div className="product-actions">
                {/* 👁 Տեսնել մանրամասները */}
                <Link to={`/${lang}/course/${product.id}`}>
                    <button className="button outline">
                        {t("product.view_details")}
                    </button>
                </Link>

                {/* 🛒 Գնել պրոդուկտը */}
                <Link to={`/${lang}/course/${product.id}?scroll=packages`}>
                    <button className="button">
                        {t("product.buy")}
                    </button>
                </Link>
            </div>
        </div>
    );
}

export default ProductPreview;
