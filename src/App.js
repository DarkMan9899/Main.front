import React, { useState, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Component/Navbar';
import './App.css';
import Footer from './Component/Footer';
import Newsletter from './Component/Newsletter';

const Home = lazy(() => import('./page/Home'));
const ProductPage = lazy(() => import('./page/ProductPage'));
const ProductDetails = lazy(() => import('./Component/ProductDetails'));
const CartPage = lazy(() => import('./page/CartPage'));
const AboutUsPage = lazy(() => import('./page/AboutUsPage'));
const ContactPage = lazy(() => import('./page/ContactPage'));
const TeacherPage = lazy(() => import('./page/TeacherPage'));
const ProductPrice = lazy(() => import('./Component/ProductPrice'));

function App() {
    const [cart, setCart] = useState([]);

    const addToCart = (product) => {
        setCart(prevCart => {
            const existingProductIndex = prevCart.findIndex(p => p.id === product.id && p.selectedType === product.selectedType);
            if (existingProductIndex >= 0) {
                const updatedCart = [...prevCart];
                updatedCart[existingProductIndex] = {
                    ...updatedCart[existingProductIndex],
                    quantity: updatedCart[existingProductIndex].quantity + product.quantity,
                };
                return updatedCart;
            } else {
                return [...prevCart, product];
            }
        });
    };

    const updateQuantity = (id, selectedType, quantity) => {
        setCart(prevCart =>
            prevCart.map(item =>
                item.id === id && item.selectedType === selectedType
                    ? { ...item, quantity: Math.max(quantity, 1) }
                    : item
            )
        );
    };

    const removeItem = (id, selectedType) => {
        setCart(prevCart => prevCart.filter(item => !(item.id === id && item.selectedType === selectedType)));
    };

    return (
        <Router>
            <Navbar cartItemCount={cart.reduce((acc, item) => acc + item.quantity, 0)} />
            <div className="content">
                <Suspense fallback={<div>Loading...</div>}>
                    <Routes>
                        <Route path="/product/:id" element={<ProductPrice addToCart={addToCart} />} />
                        <Route path="/teacher" element={<TeacherPage />} />
                        <Route path="/aboutus" element={<AboutUsPage />} />
                        <Route path="/contact" element={<ContactPage />} />
                        <Route path="/" element={<Home />} />
                        <Route path="/products" element={<ProductPage />} />
                        <Route path="/products/:id" element={<ProductDetails addToCart={addToCart} />} />
                        <Route path="/cart" element={<CartPage cart={cart} updateQuantity={updateQuantity} removeItem={removeItem} />} />
                    </Routes>
                </Suspense>
            </div>
            <Newsletter />
            <Footer />
        </Router>
    );
}

export default App;
