import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../styles/Navbar.css";
import logo from "../Img/IMG_4270.PNG";

import CertificateModal from "./CertificateModal";
import TelegramLoginModal from "./TelegramLoginModal";

function Navbar({ cartItemCount }) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [langMenuOpen, setLangMenuOpen] = useState(false);

    // ---------- Certificate Modal ----------
    const [certificateModal, setCertificateModal] = useState(false);
    const [certificateCode, setCertificateCode] = useState("");
    const [certificateData, setCertificateData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    // ---------- Telegram Login ----------
    const [telegramLoginOpen, setTelegramLoginOpen] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();
    const { lang } = useParams();
    const { t, i18n } = useTranslation();

    const isGeorgian = lang === "ka";

    const facebookLink = isGeorgian
        ? "https://www.facebook.com/share/1HQY22cApR/?mibextid=wwXIfr"
        : "http://m.me/academypolyglot";

    const instagramLink = isGeorgian
        ? "https://www.instagram.com/polya.academy?igsh=eW9oNHNzcm9lMzE3"
        : "https://www.instagram.com/academy.polyglot/";

    /* Scroll listener */
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleMenuToggle = () => setMenuOpen(prev => !prev);
    const closeMenu = () => setMenuOpen(false);
    const scrollToTop = () =>
        window.scrollTo({ top: 0, behavior: "smooth" });

    const getLinkClass = (path) => {
        const current = location.pathname;

        if (path === "/") {
            return current === `/${lang}` || current === `/${lang}/`
                ? "active"
                : "";
        }

        return current.startsWith(`/${lang}${path}`) ? "active" : "";
    };

    const openSocialMedia = (url) =>
        window.open(url, "_blank", "noopener,noreferrer");

    const flags = {
        hy: "https://flagcdn.com/w20/am.png",
        ru: "https://flagcdn.com/w20/ru.png",
        en: "https://flagcdn.com/w20/gb.png",
        ka: "https://flagcdn.com/w20/ge.png",
    };

    const changeLang = (newLang) => {
        const currentPath =
            location.pathname.replace(`/${lang}`, "") || "/";
        navigate(`/${newLang}${currentPath}`);
        i18n.changeLanguage(newLang);
        setLangMenuOpen(false);
        closeMenu();
    };

    return (
        <>
            <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
                <div className="navbar_cont container_navbar">

                    {/* Logo */}
                    <Link
                        to={`/${lang}`}
                        onClick={() => {
                            closeMenu();
                            scrollToTop();
                        }}
                    >
                        <img
                            src={logo}
                            alt="Polyglot logo"
                            className="navbar_logo"
                            width="150"
                            height="50"
                        />
                    </Link>

                    {/* Menu */}
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

                        {/* ⭐ Certificate */}
                        <span
                            className="navbar_link"
                            onClick={() => {
                                closeMenu();
                                setCertificateModal(true);
                            }}
                        >
                            {t("navbar.certificate")}
                        </span>

                        {/*/!* 📲 Telegram VIP (LINK STYLE) *!/*/}
                        {/*<Link*/}
                        {/*    to="#"*/}
                        {/*    className="navbar_link telegram-link"*/}
                        {/*    onClick={(e) => {*/}
                        {/*        e.preventDefault();*/}
                        {/*        closeMenu();*/}
                        {/*        setTelegramLoginOpen(true);*/}
                        {/*    }}*/}
                        {/*>*/}
                        {/*    {t("navbar.telegram")}*/}
                        {/*</Link>*/}

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

                        {/* Mobile socials */}
                        <div className="social_links mobile-only">
                            <i
                                className="fa-brands fa-facebook-messenger"
                                onClick={() => openSocialMedia(facebookLink)}
                            />
                            <i
                                className="fa-brands fa-instagram"
                                onClick={() => openSocialMedia(instagramLink)}
                            />
                            <i
                                className="fa-brands fa-whatsapp"
                                onClick={() =>
                                    openSocialMedia(
                                        "https://wa.me/qr/N6QBFPT6G3FOA1"
                                    )
                                }
                            />
                        </div>
                    </div>

                    {/* Right controls */}
                    <div className="navbar_right">
                        {/* Language */}
                        <div className="lang-dropdown">
                            <div
                                className="lang-current"
                                onClick={() =>
                                    setLangMenuOpen(!langMenuOpen)
                                }
                            >
                                <img
                                    src={flags[lang]}
                                    alt={t(`lang.${lang}`)}
                                />
                                <span>{t(`lang.${lang}`)}</span>
                                <i
                                    className={`fa-solid fa-chevron-${
                                        langMenuOpen ? "up" : "down"
                                    }`}
                                />
                            </div>

                            {langMenuOpen && (
                                <div className="lang-menu">
                                    {Object.keys(flags)
                                        .filter(code => code !== lang)
                                        .map(code => (
                                            <div
                                                key={code}
                                                className="lang-option"
                                                onClick={() =>
                                                    changeLang(code)
                                                }
                                            >
                                                <img
                                                    src={flags[code]}
                                                    alt={t(`lang.${code}`)}
                                                />
                                                <span>
                                                    {t(`lang.${code}`)}
                                                </span>
                                            </div>
                                        ))}
                                </div>
                            )}
                        </div>

                        {/* Desktop socials */}
                        <div className="social_links desktop-only">
                            <i
                                className="fa-brands fa-facebook-messenger"
                                onClick={() => openSocialMedia(facebookLink)}
                            />
                            <i
                                className="fa-brands fa-instagram"
                                onClick={() => openSocialMedia(instagramLink)}
                            />
                            <i
                                className="fa-brands fa-whatsapp"
                                onClick={() =>
                                    openSocialMedia(
                                        "https://wa.me/qr/N6QBFPT6G3FOA1"
                                    )
                                }
                            />
                        </div>

                        {/* Cart */}
                        <Link
                            to={`/${lang}/cart`}
                            className="cart-icon"
                            data-count={cartItemCount}
                            onClick={scrollToTop}
                        >
                            🛒
                        </Link>

                        {/* Mobile toggle */}
                        <button
                            className="navbar_toggle"
                            onClick={handleMenuToggle}
                        >
                            {menuOpen ? "✖" : "☰"}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Certificate Modal */}
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

            {/* Telegram Login Modal */}
            {telegramLoginOpen && (
                <TelegramLoginModal
                    onClose={() => setTelegramLoginOpen(false)}
                />
            )}
        </>
    );
}

export default Navbar;