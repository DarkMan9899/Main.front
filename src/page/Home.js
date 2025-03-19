import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import ProductPreview from '../Component/ProductPreview';
import '../styles/Home.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Hero from '../Component/Hero';
import AboutUs from '../Component/AboutUs';
import Contact from '../Component/Contact';
import Polia from '../Component/Polia';
import StatisticsSection from '../Component/StatisticsSection';
import Teacher from '../Component/Teacher';
import Comment from '../Component/Comment';
import axios from 'axios';
import { API_URL_Products } from '../api';

const CACHE_KEY = 'home_products_cache';
const CACHE_TIME_KEY = 'home_products_cache_time';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

function Home() {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);

    const fetchProductsFromAPI = async () => {
        try {
            const response = await axios.get(API_URL_Products);
            if (response.data) {
                setProducts(response.data);
                localStorage.setItem(CACHE_KEY, JSON.stringify(response.data));
                localStorage.setItem(CACHE_TIME_KEY, Date.now().toString());
            } else {
                throw new Error('API response does not contain product data');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setError(error);
        }
    };

    const getProducts = () => {
        const cachedData = localStorage.getItem(CACHE_KEY);
        const cacheTime = localStorage.getItem(CACHE_TIME_KEY);
        const now = Date.now();

        if (cachedData && cacheTime && now - parseInt(cacheTime, 10) < CACHE_DURATION) {
            setProducts(JSON.parse(cachedData));
            // Optionally, revalidate in the background
            fetchProductsFromAPI();
        } else {
            fetchProductsFromAPI();
        }
    };

    useEffect(() => {
        getProducts();
    }, []);

    if (error) {
        return <div>Error fetching products: {error.message}</div>;
    }

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: false,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    dots: false,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    dots: false,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    dots: false,
                },
            },
        ],
    };

    return (
        <div className="home">
            <Hero />
            <div className="product_fon">
                <div className="product_container">
                    <div className="product-section-text">
                        <span>Choose Your Language Course</span>
                        <a href="/products" className="view-all-button">All Language</a>
                    </div>
                    <Slider {...settings} className="product-grid">
                        {products.map(product => (
                            <ProductPreview key={product.id} product={product} />
                        ))}
                    </Slider>
                </div>
            </div>
            <AboutUs />
            <Contact />
            <Polia />
            <StatisticsSection />
            <Teacher />
            <Comment />
        </div>
    );
}

export default Home;
