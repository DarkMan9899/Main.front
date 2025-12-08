import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../styles/Navbar.css";
import logo from "../Img/IMG_4270.PNG";

import CertificateModal from "./CertificateModal";

function Navbar({ cartItemCount }) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [langMenuOpen, setLangMenuOpen] = useState(false);

    // ---------- Certificate Modal States ----------
    const [certificateModal, setCertificateModal] = useState(false);
    const [certificateCode, setCertificateCode] = useState("");
    const [certificateData, setCertificateData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const location = useLocation();
    const navigate = useNavigate();
    const { lang } = useParams();
    const { t, i18n } = useTranslation();

    /* Scroll listener */
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleMenuToggle = () => setMenuOpen((prev) => !prev);
    const closeMenu = () => setMenuOpen(false);
    const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

    const getLinkClass = (path) =>
        location.pathname.startsWith(`/${lang}${path}`) ? "active" : "";

    const openSocialMedia = (url) =>
        window.open(url, "_blank", "noopener,noreferrer");

    const flags = {
        hy: "https://flagcdn.com/w20/am.png",
        ru: "https://flagcdn.com/w20/ru.png",
        en: "https://flagcdn.com/w20/gb.png",
    };

    const changeLang = (newLang) => {
        const currentPath = location.pathname.replace(`/${lang}`, "") || "/";
        navigate(`/${newLang}${currentPath}`);
        i18n.changeLanguage(newLang);
        setLangMenuOpen(false);
        closeMenu();
    };

    return (
        <>
            <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
                <div className="navbar_cont container_navbar">

                    {/* 🏠 Logo */}
                    <Link
                        to={`/${lang}`}
                        onClick={() => {
                            closeMenu();
                            scrollToTop();
                        }}
                    >
                        <img alt="Polyglot logo" src={logo} className="navbar_logo" />
                    </Link>

                    {/* 📋 Menu (Mobile & Desktop Shared) */}
                    <div className={`navbar_menu ${menuOpen ? "open" : ""}`}>
                        <Link
                            to={`/${lang}/`}
                            className={getLinkClass("/")}
                            onClick={() => {
                                closeMenu();
                                scrollToTop();
                            }}
                        >
                            {t("navbar.home")}
                        </Link>

                        <Link
                            to={`/${lang}/aboutus`}
                            className={getLinkClass("/aboutus")}
                            onClick={() => {
                                closeMenu();
                                scrollToTop();
                            }}
                        >
                            {t("navbar.about")}
                        </Link>

                        <Link
                            to={`/${lang}/products`}
                            className={getLinkClass("/products")}
                            onClick={() => {
                                closeMenu();
                                scrollToTop();
                            }}
                        >
                            {t("navbar.language")}
                        </Link>

                        <Link
                            to={`/${lang}/contact`}
                            className={getLinkClass("/contact")}
                            onClick={() => {
                                closeMenu();
                                scrollToTop();
                            }}
                        >
                            {t("navbar.contact")}
                        </Link>

                        {/* ⭐ Certificate — Visible also in Mobile menu */}
                        <span
                            className="navbar_link"
                            onClick={() => {
                                closeMenu();
                                setCertificateModal(true);
                            }}
                        >
                            {t("navbar.certificate")}
                        </span>

                        {/* Social links (mobile only) */}
                        <div className="social_links mobile-only">
                            <i
                                className="fa-brands fa-facebook-messenger"
                                onClick={() => openSocialMedia("http://m.me/academypolyglot")}
                            ></i>

                            <i
                                className="fa-brands fa-instagram"
                                onClick={() =>
                                    openSocialMedia("https://www.instagram.com/academy.polyglot/")
                                }
                            ></i>

                            <i
                                className="fa-brands fa-whatsapp"
                                onClick={() =>
                                    openSocialMedia("https://wa.me/qr/N6QBFPT6G3FOA1")
                                }
                            ></i>
                        </div>
                    </div>

                    {/* 🔧 Right Controls */}
                    <div className="navbar_right">
                        {/* 🌍 Language */}
                        <div className="lang-dropdown">
                            <div
                                className="lang-current"
                                onClick={() => setLangMenuOpen(!langMenuOpen)}
                            >
                                <img src={flags[lang]} alt={t(`lang.${lang}`)} />
                                <span>{t(`lang.${lang}`)}</span>
                                <i
                                    className={`fa-solid fa-chevron-${
                                        langMenuOpen ? "up" : "down"
                                    }`}
                                ></i>
                            </div>

                            {langMenuOpen && (
                                <div className="lang-menu">
                                    {Object.keys(flags)
                                        .filter((code) => code !== lang)
                                        .map((code) => (
                                            <div
                                                key={code}
                                                className="lang-option"
                                                onClick={() => changeLang(code)}
                                            >
                                                <img src={flags[code]} alt={t(`lang.${code}`)} />
                                                <span>{t(`lang.${code}`)}</span>
                                            </div>
                                        ))}
                                </div>
                            )}
                        </div>

                        {/* 💬 Social Icons (desktop) */}
                        <div className="social_links desktop-only">
                            <i
                                className="fa-brands fa-facebook-messenger"
                                onClick={() => openSocialMedia("http://m.me/academypolyglot")}
                            ></i>

                            <i
                                className="fa-brands fa-instagram"
                                onClick={() =>
                                    openSocialMedia("https://www.instagram.com/academy.polyglot/")
                                }
                            ></i>

                            <i
                                className="fa-brands fa-whatsapp"
                                onClick={() =>
                                    openSocialMedia("https://wa.me/qr/N6QBFPT6G3FOA1")
                                }
                            ></i>
                        </div>

                        {/* 🛒 Cart */}
                        <Link
                            to={`/${lang}/cart`}
                            className="cart-icon"
                            data-count={cartItemCount}
                            onClick={scrollToTop}
                        >
                            🛒
                        </Link>

                        {/* ☰ Mobile Toggle */}
                        <button
                            className="navbar_toggle"
                            onClick={handleMenuToggle}
                        >
                            {menuOpen ? "✖" : "☰"}
                        </button>
                    </div>
                </div>
            </nav>

            {/* ⭐ Certificate Modal */}
            <CertificateModal
                open={certificateModal}
                onClose={() => {
                    setCertificateModal(false);
                    setCertificateCode("");
                    setCertificateData(null);
                    setErrorMessage("");
                    setLoading(false);
                }}
                certificateCode={certificateCode}
                setCertificateCode={setCertificateCode}
                certificateData={certificateData}
                setCertificateData={setCertificateData}
                loading={loading}
                setLoading={setLoading}
                errorMessage={errorMessage}
                setErrorMessage={setErrorMessage}
            />
        </>
    );
}

export default Navbar;
