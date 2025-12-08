import React, { useState, useEffect, Suspense, lazy } from "react";
import {
    BrowserRouter as Router,
    Route,
    Routes,
    useParams,
    Navigate,
    useNavigate,
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "./Component/Navbar";
import Footer from "./Component/Footer";
import Newsletter from "./Component/Newsletter";
import PaymentSuccess from "./page/PaymentSuccess";
import PaymentFail from "./page/PaymentFail";
import "./App.css";
import ScrollToTopButton from "./Component/ScrollToTopButton";
import UniversalCoursePage from "./Component/UNIVERSALCoursePage";
import CertificateForm from "./Component/CertificateForm";

// 📦 Lazy-loaded pages
const Home = lazy(() => import("./page/Home"));
const ProductPage = lazy(() => import("./page/ProductPage"));
const ProductDetails = lazy(() => import("./Component/ProductDetails"));
const CartPage = lazy(() => import("./page/CartPage"));
const AboutUsPage = lazy(() => import("./page/AboutUsPage"));
const ContactPage = lazy(() => import("./page/ContactPage"));
const TeacherPage = lazy(() => import("./page/TeacherPage"));
const ProductPrice = lazy(() => import("./Component/ProductPrice"));

/* 🌐 Language Wrapper */
function LanguageWrapper({ cart, addToCart, updateQuantity, removeItem }) {
    const { lang } = useParams();
    const navigate = useNavigate();
    const { i18n } = useTranslation();

    useEffect(() => {
        if (["hy", "ru", "en"].includes(lang)) {
            i18n.changeLanguage(lang);
        } else {
            navigate("/hy", { replace: true });
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
                <Suspense fallback={<div className="loader">Loading…</div>}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/course/:id" element={<UniversalCoursePage addToCart={addToCart}/>} />
                        <Route path="/aboutus" element={<AboutUsPage />} />
                        <Route path="/teacher" element={<TeacherPage />} />
                        <Route path="/contact" element={<ContactPage />} />
                        <Route path="/products" element={<ProductPage />} />
                        <Route
                            path="/products/:id"
                            element={<ProductDetails addToCart={addToCart} />}
                        />
                        <Route
                            path="/product/:id"
                            element={<ProductPrice addToCart={addToCart} />}
                        />
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
                        <Route path="*" element={<Navigate to={`/${lang}`} replace />} />
                    </Routes>
                </Suspense>
            </div>
            <Newsletter />
            <ScrollToTopButton />
            <Footer />
        </>
    );
}

/* 🏠 Main App */
export default function App() {
    const [cart, setCart] = useState([]);

    const addToCart = (product) => {
        setCart((prevCart) => {
            const index = prevCart.findIndex(
                (p) => p.id === product.id && p.selectedType === product.selectedType
            );
            if (index >= 0) {
                const updated = [...prevCart];
                updated[index].quantity += Number(product.quantity) || 1;
                return updated;
            }
            return [...prevCart, { ...product, quantity: Number(product.quantity) || 1 }];
        });
    };

    const updateQuantity = (id, selectedType, quantity) => {
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.id === id && item.selectedType === selectedType
                    ? { ...item, quantity: Math.max(Number(quantity) || 1, 1) }
                    : item
            )
        );
    };

    const removeItem = (id, selectedType) => {
        setCart((prevCart) =>
            prevCart.filter((item) => !(item.id === id && item.selectedType === selectedType))
        );
    };

    return (
        <Router>
            <Routes>
                {/* 🌍 Default redirect */}
                <Route path="/" element={<Navigate to="/hy" replace />} />

                {/* 💳 Payment pages */}
                <Route path="/payment/success" element={<PaymentSuccess />} />
                <Route path="/payment/fail" element={<PaymentFail />} />
                <Route path="/certifikat" element={<CertificateForm/>}/>

                <Route path="/payment/success" element={<PaymentSuccess />} />
                <Route path="/payment/fail" element={<PaymentFail />} />

                <Route path="/:lang/payment/success" element={<PaymentSuccess />} />
                <Route path="/:lang/payment/fail" element={<PaymentFail />} />

                {/* 🌐 Localized content */}
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
