import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {useParams, Link, ScrollRestoration} from "react-router-dom";
import Slider from "react-slick";
import axios from "axios";

import ProductPreview from "../Component/Product/ProductPreview";
import Hero from "../Component/Hero";
import AboutUs from "../Component/AboutUs";
import Polia from "../Component/Polia";
import StatisticsSection from "../Component/StatisticsSection";
import Teacher from "../Component/Teacher";
import Comment from "../Component/Comment";
import "../styles/Home.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { API_URL_Products } from "../api";
import WhyChoose from "../Component/WhyChoose";
import SocialResponsibility from "../Component/SocialResponsibility";
import FAQ from "../Component/FAQ";
import Partners from "../Component/Partners";

/* 🧠 Cache Config */
const CACHE_KEY = "home_products_cache";
const CACHE_TIME_KEY = "home_products_cache_time";
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24h

function Home() {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const { lang } = useParams();
    const { t } = useTranslation();

    /* 📡 Fetch from API */
    const fetchProductsFromAPI = async () => {
        try {
            const { data } = await axios.get(API_URL_Products);
            if (Array.isArray(data)) {
                setProducts(data);
                localStorage.setItem(CACHE_KEY, JSON.stringify(data));
                localStorage.setItem(CACHE_TIME_KEY, Date.now().toString());
            } else {
                throw new Error("Invalid API response format");
            }
        } catch (err) {
            console.error("❌ Error fetching products:", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    /* ⚙️ Load Products with Cache Validation */
    const getProducts = () => {
        try {
            const cachedData = localStorage.getItem(CACHE_KEY);
            const cacheTime = localStorage.getItem(CACHE_TIME_KEY);
            const now = Date.now();

            if (cachedData && cacheTime && now - parseInt(cacheTime, 10) < CACHE_DURATION) {
                const parsed = JSON.parse(cachedData);
                if (Array.isArray(parsed)) setProducts(parsed);
                // background refresh
                fetchProductsFromAPI();
            } else {
                fetchProductsFromAPI();
            }
        } catch (err) {
            console.warn("⚠️ Cache parse error, refetching:", err);
            fetchProductsFromAPI();
        }
    };
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);


    useEffect(() => {
        getProducts();
    }, []);

    /* 🧭 Slider Configuration */
    const settings = {
        dots: false,
        infinite: true,
        speed: 600,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        pauseOnHover: true,
        arrows: false,
        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: 3 } },
            { breakpoint: 768, settings: { slidesToShow: 2 } },
            { breakpoint: 480, settings: { slidesToShow: 1 } },
        ],
    };

    /* 🧾 Conditional Rendering */
    if (error)
        return <div className="error-message">{t("home.error")}: {error.message}</div>;
    if (loading && products.length === 0)
        return <div className="loader">{t("home.loading")}</div>;

    return (
        <div className="home">
            <Hero />

            {/* 🗂️ Product Section */}
            <section className="product_fon">
                <div className="product_container">
                    <AboutUs />

                    {/* ՎԵՐՆԱԳԻՐ — մնում է վերևում */}
                    <div className="product-section-text container">
                        <span>{t("home.chooseCourse")}</span>
                    </div>

                    {/* SLIDER */}
                    {products.length > 0 ? (
                        <Slider {...settings} className="product-grid">
                            {products.map((product) => (
                                <ProductPreview key={product.id} product={product} />
                            ))}
                        </Slider>
                    ) : (
                        <div className="no-products">{t("home.noProducts")}</div>
                    )}

                    {/* ԿՈՂՋԱԿ — աջ ներքևում */}
                    <div className="product-all-btn">
                        <Link to={`/${lang}/products`} className="button">
                            {t("home.allLanguages")}
                        </Link>
                    </div>
                </div>
            </section>


            <Comment />
            <StatisticsSection />

            <WhyChoose/>
            <Teacher />
            <Polia />
            <SocialResponsibility/>
            <FAQ/>
            <Partners/>
        </div>
    );
}

export default Home;
