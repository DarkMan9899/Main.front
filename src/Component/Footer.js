import React from 'react';
import '../styles/Footer.css';
import {Link} from "react-router-dom";

const SocialIcon = ({className, url, label}) => (
    <i
        className={className}
        onClick={() => window.open(url, '_blank')}
        aria-label={label}
    ></i>
);

const FooterLink = ({href, onClick, children}) => (
    <li>
        <a href={href} onClick={onClick}>{children}</a>
    </li>
);


const Footer = () => {
    const socialMediaLinks = [
        {
            className: "fa-brands fa-facebook-f",
            url: "https://www.facebook.com/academypolyglot",
            label: "Facebook Messenger"
        },
        {className: "fa-brands fa-instagram", url: "https://www.instagram.com/academy.polyglot/", label: "Instagram"},
        {className: "fa-brands fa-vk", url: "https://vk.me/club225918715", label: "VK"},
        {className: "fa-brands fa-telegram", url: "https://salebot.site/TG_1", label: "Telegram"},
        {className: "fab fa-linkedin-in", url: "https://www.linkedin.com/company/academy-polyglot/", label: "LinkedIn"}
    ];

    const quickLinks = [
        {href: "#", url: "https://t.me/Polyglotacademy_bot", label: "Meet Polya"},
        {href: "#", url: "https://www.linkedin.com/company/academy-polyglot/", label: "LinkedIn"},
        {href: "#", url: "https://t.me/polyglotacademyenglishchannel", label: "Polyglot's English Club"},
        {href: "#", url: "https://t.me/russianchannelPolyglotacademy", label: "Русский клуб Полиглота"},
        {
            href: "#",
            url: "https://docs.google.com/forms/d/e/1FAIpQLSebWEdyDw57yU1otMqb2-yOb6c-sZRWzmBN_82Elk4aL7hu8g/viewform",
            label: "Questionnaire for experts"
        }
    ];

    return (
        <footer className="footer">
            <div className="container footer_section">
                <div className="footer-section-edu">
                    <h3>Educate</h3>
                    <p>Join us and stay updated with the latest in language learning by following us on social media.
                        Discover a world of opportunities and make your language learning journey exciting and enjoyable
                        with Polyglot Academy.</p>
                    <div className="social-icons">
                        {socialMediaLinks.map((icon, index) => (
                            <SocialIcon key={index} {...icon} />
                        ))}
                    </div>
                </div>
                <div className="footer-section">
                    <h4>Languages</h4>
                    <ul>
                        {['English', 'Russian', 'Armenian', 'Spanish', 'German'].map((language, index) => (
                            <li key={index}><Link to="/products">{language}</Link></li>
                        ))}
                    </ul>
                </div>
                <div className="footer-section_link">
                    <h4>Quick Links:</h4>
                    <ul>
                        {quickLinks.map((link, index) => (
                            <FooterLink key={index} href={link.href} onClick={() => window.open(link.url, '_blank')}>{link.label}</FooterLink>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="lic">
                <div className="lic-content">
                    <p>Copyright © 2024 <span className="brand">Polyglot Academy</span> || All Rights Reserved</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
