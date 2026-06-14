import React from "react";
import { useTranslation } from "react-i18next";
import { useParams, Link } from "react-router-dom";
import "../styles/Footer.css";

const SocialIcon = ({ className, url, label }) => (
    <i
        className={className}
        onClick={() => window.open(url, "_blank", "noopener,noreferrer")}
        aria-label={label}
    ></i>
);

const FooterLink = ({ href, onClick, children }) => (
    <li>
        <a href={href} onClick={onClick}>
            {children}
        </a>
    </li>
);

const Footer = () => {
    const { t } = useTranslation();
    const { lang } = useParams();

    const socialMediaLinks =
        lang === "ka"
            ? [
                {
                    className: "fa-brands fa-facebook-f",
                    url: "https://www.facebook.com/share/1HQY22cApR/?mibextid=wwXIfr",
                    label: "Facebook",
                },
                {
                    className: "fa-brands fa-instagram",
                    url: "https://www.instagram.com/polya.academy?igsh=eW9oNHNzcm9lMzE3",
                    label: "Instagram",
                },
            ]
            : [
                {
                    className: "fa-brands fa-facebook-f",
                    url: "https://www.facebook.com/academypolyglot",
                    label: "Facebook",
                },
                {
                    className: "fa-brands fa-instagram",
                    url: "https://www.instagram.com/academy.polyglot/",
                    label: "Instagram",
                },
                {
                    className: "fa-brands fa-vk",
                    url: "https://vk.me/club225918715",
                    label: "VK",
                },
                {
                    className: "fa-brands fa-telegram",
                    url: "https://t.me/polyglot_language_hub",
                    label: "Telegram",
                },
                {
                    className: "fab fa-linkedin-in",
                    url: "https://www.linkedin.com/company/academy-polyglot/",
                    label: "LinkedIn",
                },
            ];
    const quickLinks = [
        {
            label: t("footer.links.polya"),
            url: "https://t.me/Polyglotacademy_bot",
        },

        {
            label: t("footer.links.englishClub"),
            url: "https://t.me/polyglotacademyenglishchannel",
        },
        {
            label: t("footer.links.russianClub"),
            url: "https://t.me/russianchannelPolyglotacademy",
        },
        {
            label: t("footer.links.questionnaire"),
            url: "https://drive.google.com/drive/folders/1fnOGD0qVmnTkxnLD6NddECFsNt15GrTB",
        },
        {
            label: "SLA",
            url: "https://drive.google.com/file/d/1iKCCWLUNdT65nf-VX--JDgaX8JezPvFp/view?usp=sharing",
        },
    ];

    const languages = [
        { name: t("footer.languages.armenian") },
        { name: t("footer.languages.english") },
        { name: t("footer.languages.russian") },
        { name: t("footer.languages.spanish") },
        { name: t("footer.languages.german") },
        { name: t("footer.languages.french") },
    ];

    return (
        <footer className="footer">
            <div className="container footer_section">
                {/* Left Section */}
                <div className="footer-section-edu">
                    <h3>{t("footer.educate.title")}</h3>
                    <p>{t("footer.educate.text")}</p>

                    <div className="social-icons">
                        {socialMediaLinks.map((icon, index) => (
                            <SocialIcon key={index} {...icon} />
                        ))}
                    </div>
                </div>

                {/* Middle Section — Languages */}
                <div className="footer-section">
                    <h4>{t("footer.languages.title")}</h4>
                    <ul>
                        {languages.map((langItem, index) => (
                            <li key={index}>
                                <Link to={`/${lang}/products`}>{langItem.name}</Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Right Section — Quick Links */}
                <div className="footer-section_link">
                    <h4>{t("footer.quickLinks")}</h4>
                    <ul>
                        {quickLinks.map((link, index) => (
                            <FooterLink
                                key={index}
                                href="#"
                                onClick={() => window.open(link.url, "_blank")}
                            >
                                {link.label}
                            </FooterLink>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Bottom Licensing */}
            <div className="lic">
                <div className="lic-content">
                    <p>
                        © 2026 <span className="brand">Polyglot Academy</span> —{" "}
                        {t("footer.rights")}
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
