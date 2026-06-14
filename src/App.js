import React, {useState, useEffect, Suspense, lazy, useMemo} from "react";
import {
    BrowserRouter as Router,
    Route,
    Routes,
    useParams,
    Navigate,
    useNavigate,
} from "react-router-dom";
import {useTranslation} from "react-i18next";

import Navbar from "./Component/Navbar";
import Footer from "./Component/Footer";
import ScrollToTopButton from "./Component/ScrollToTopButton";
import ScrollToHash from "./Component/ScrollToHash";
import Bitrix24Chat from "./Component/Bitrix24Chat";

import PaymentSuccess from "./page/PaymentSuccess";
import PaymentFail from "./page/PaymentFail";
import UniversalCoursePage from "./page/UNIVERSALCoursePage";
import CertificateForm from "./Component/CertificateForm";
import AdminPage from "./page/Admin";

import Snowfall from "react-snowfall";
import "./App.css";
import UNIVERSALCoursePage2 from "./page/UNIVERSALCoursePage2";
import ScrollToTop from "./Component/ScrollToTop";

/* 📦 Lazy pages */
const Home = lazy(() => import("./page/Home"));
const ProductPage = lazy(() => import("./page/ProductPage"));
const CartPage = lazy(() => import("./page/CartPage"));
const AboutUsPage = lazy(() => import("./page/AboutUsPage"));
const ContactPage = lazy(() => import("./page/ContactPage"));
const TeacherPage = lazy(() => import("./page/TeacherPage"));

/* 🌐 Language Wrapper */
function LanguageWrapper({cart, addToCart, updateQuantity, removeItem}) {
    const {lang} = useParams();
    const navigate = useNavigate();
    const {i18n} = useTranslation();

    useEffect(() => {
        if (["hy", "ru", "en","ka"].includes(lang)) {
            i18n.changeLanguage(lang);
        } else {
            navigate("/hy", {replace: true});
        }
    }, [lang, i18n, navigate]);

    const localPath = (path) => `/${lang}${path}`;

    return (
        <>
            <Navbar
                cartItemCount={cart.reduce((acc, item) => acc + item.quantity, 0)}
                localPath={localPath}
            />

            <div className="content">
                <Suspense fallback={<div className="page-loader">Loading…</div>}>
                    <Routes>
                        <Route path="/" element={<Home/>}/>
                        <Route path="/course/:id" element={<UniversalCoursePage addToCart={addToCart}/>}/>
                        <Route path="/aboutus" element={<AboutUsPage/>}/>
                        <Route path="/teacher" element={<TeacherPage/>}/>
                        <Route path="/contact" element={<ContactPage/>}/>
                        <Route path="/products" element={<ProductPage/>}/>
                        <Route path="/certifikat" element={<CertificateForm/>}/>
                        <Route path="/ucp/:id" element={<UNIVERSALCoursePage2 addToCart={addToCart}/>}/>
                        <Route
                            path="/cart"
                            element={
                                <CartPage
                                    cart={cart}
                                    updateQuantity={updateQuantity}
                                    removeItem={removeItem}
                                />
                            }
                        />

                        <Route path="*" element={<Navigate to={`/${lang}`} replace/>}/>
                    </Routes>
                </Suspense>
            </div>

            <ScrollToTopButton/>
            <Footer/>
        </>
    );
}

/* 🏠 Main App */
export default function App() {

    const [cart, setCart] = useState([]);

    /* 🌍 DOMAIN → LANGUAGE DETECTION */
    const host = window.location.hostname;

    let defaultLang = "hy";

    if (host.includes("polyglotacademy.ru")) {
        defaultLang = "ru";
    }

    if (host.includes("polyglotacademy.com")) {
        defaultLang = "en";
    }

    const showSnow = new Date() < new Date("2026-01-05");

    const snowflakeImage = useMemo(() => {
        const img = new Image();
        img.src =
            "data:image/svg+xml;utf8," +
            encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <g stroke="rgba(90,170,225,0.45)" stroke-width="6" stroke-linecap="round">
    <line x1="50" y1="8" x2="50" y2="92"/>
    <line x1="8" y1="50" x2="92" y2="50"/>
    <line x1="18" y1="18" x2="82" y2="82"/>
    <line x1="82" y1="18" x2="18" y2="82"/>
  </g>
</svg>
`);
        return img;
    }, []);

    const addToCart = (product) => {
        setCart((prev) => {
            const index = prev.findIndex(
                (p) => p.id === product.id && p.selectedType === product.selectedType
            );

            if (index >= 0) {
                const updated = [...prev];
                updated[index].quantity += Number(product.quantity) || 1;
                return updated;
            }

            return [...prev, {...product, quantity: Number(product.quantity) || 1}];
        });
    };

    const updateQuantity = (id, selectedType, quantity) => {
        setCart((prev) =>
            prev.map((item) =>
                item.id === id && item.selectedType === selectedType
                    ? {...item, quantity: Math.max(Number(quantity) || 1, 1)}
                    : item
            )
        );
    };

    const removeItem = (id, selectedType) => {
        setCart((prev) =>
            prev.filter(
                (item) => !(item.id === id && item.selectedType === selectedType)
            )
        );
    };

    return (
        <Router>
            <ScrollToTop/>
            <ScrollToHash/>

            {showSnow && (
                <Snowfall
                    speed={[0.5, 0.7]}
                    wind={[-0.1, 0.1]}
                    images={[snowflakeImage]}
                    radius={[20, 28]}
                    snowflakeCount={45}
                    style={{
                        position: "fixed",
                        inset: 0,
                        zIndex: 9999,
                        pointerEvents: "none",
                    }}
                />
            )}

            <Bitrix24Chat/>

            <Routes>

                {/* 🌍 ROOT REDIRECT BY DOMAIN */}
                <Route path="/" element={<Navigate to={`/${defaultLang}`} replace/>}/>

                {/* 💳 Payments */}
                <Route path="/payment/success" element={<PaymentSuccess/>}/>
                <Route path="/payment/fail" element={<PaymentFail/>}/>
                <Route path="/payment/success/:orderId" element={<PaymentSuccess/>}/>
                <Route path="/payment/fail/:orderId" element={<PaymentFail/>}/>

                <Route path="/:lang/payment/success" element={<PaymentSuccess/>}/>
                <Route path="/:lang/payment/fail" element={<PaymentFail/>}/>

                {/* 🔐 Admin Panel */}
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/admin/*" element={<AdminPage />} />

                <Route
                    path="/:lang/*"
                    element={
                        <LanguageWrapper
                            cart={cart}
                            addToCart={addToCart}
                            updateQuantity={updateQuantity}
                            removeItem={removeItem}
                        />
                    }
                />

            </Routes>
        </Router>
    );
}