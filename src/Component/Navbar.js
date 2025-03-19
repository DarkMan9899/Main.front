import React, {useState, useEffect} from 'react';
import {Link, useLocation} from 'react-router-dom';
import '../styles/Navbar.css';
import logo from '../Img/IMG_4270.PNG';

function Navbar({cartItemCount}) {
    const [navbar, setNavbar] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setNavbar(true);
            } else {
                setNavbar(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleMenuToggle = () => {
        setMenuOpen(!menuOpen);
    };

    const closeMenu = () => {
        setMenuOpen(false);
    };

    const scrollToTop = () => {
        window.scrollTo(0, 0);
    };

    const getLinkClass = (path) => {
        return location.pathname === path ? 'active' : '';
    };

    const openSocialMedia = (url) => {
        window.open(url, '_blank');
    };

    return (
        <nav className={navbar ? 'navbar' : 'navbar_active'}>
            <div className="navbar_cont section container_navbar">
                <Link to="/" onClick={closeMenu}><img alt="logo" src={logo} className="navbar_logo"/></Link>
                <div className={`navbar_menu ${menuOpen ? 'open' : ''}`}>
                    <Link to="/" className={getLinkClass('/')} onClick={() => {
                        closeMenu();
                        scrollToTop();
                    }}>Home</Link>
                    <Link to="/aboutus" className={getLinkClass('/aboutus')} onClick={() => {
                        closeMenu();
                        scrollToTop();
                    }}>About us</Link>
                    <Link to="/products" className={getLinkClass('/products')} onClick={() => {
                        closeMenu();
                        scrollToTop();
                    }}>Language</Link>
                    <Link to="/contact" className={getLinkClass('/contact')} onClick={() => {
                        closeMenu();
                        scrollToTop();
                    }}>Contacts</Link>
                </div>
                <div className="navbar_right">
                    <div className="socal_link">
                        <i className="fa-brands fa-facebook-messenger"
                           onClick={() => openSocialMedia("http://m.me/academypolyglot")}></i>
                        <i className="fa-brands fa-instagram"
                           onClick={() => openSocialMedia("https://www.instagram.com/academy.polyglot/")}></i>
                        <i className="fa-brands fa-whatsapp "
                           onClick={() => openSocialMedia("https://wa.me/qr/N6QBFPT6G3FOA1")}>

                        </i>
                    </div>

                    <Link to="/cart" className="cart-icon" data-count={cartItemCount} onClick={() => {
                        scrollToTop();
                    }}>🛒</Link>
                    <button className="navbar_toggle" onClick={handleMenuToggle}>
                        {menuOpen ? '✖' : '☰'}
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
