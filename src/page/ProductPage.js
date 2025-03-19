import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductPreview from '../Component/ProductPreview';
import '../styles/ProductPage.css';
import { API_URL_Product_Page } from '../api';

const CACHE_KEY = 'products_data_cache';
const CACHE_TIME_KEY = 'products_data_cache_time';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

function ProductPage() {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);

    const fetchProductsFromAPI = async () => {
        try {
            const response = await axios.get(API_URL_Product_Page);
            if (response.data) {
                setProducts(response.data);
                localStorage.setItem(CACHE_KEY, JSON.stringify(response.data));
                localStorage.setItem(CACHE_TIME_KEY, Date.now().toString());
            } else {
                throw new Error('API response does not contain products data');
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

    return (
        <div className="product-page">
            <div className="product-page_Title">
                <h2>All Products</h2>
            </div>
            <div className="product-list">
                <div className="product_list_full container">
                    {products.map((product) => (
                        <ProductPreview key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ProductPage;
