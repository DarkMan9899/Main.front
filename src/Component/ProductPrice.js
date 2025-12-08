import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/ProductDetails.css';
import { API_URL_Product_Details } from "../api";

const isProduction = process.env.NODE_ENV === 'production';
const BASE_URL = isProduction ? 'https://main-api.academy-polyglot.site' : 'http://localhost:5001';

function ProductDetails({ addToCart }) {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [selectedType, setSelectedType] = useState('individual');
    const [selectedPrice, setSelectedPrice] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [error, setError] = useState(null);

    // NEW PRICE MAP
    const priceTypes = [
        { key: "individual_full_price", label: "Individual" },
        { key: "group2_full_price", label: "Group (2 people)" },
        { key: "group5_full_price", label: "Group (5 people)" },
        { key: "speaking_full_price", label: "Speaking Course" },
        { key: "accelerated_full_price", label: "Accelerated" },
        { key: "hybrid_full_price", label: "Hybrid" },
    ];

    useEffect(() => {
        if (id) {
            axios.get(`${API_URL_Product_Details}${id}`)
                .then(response => {
                    const productData = response.data;

                    setProduct(productData);

                    // Default price — Individual
                    if (productData.individual_full_price) {
                        setSelectedType("individual_full_price");
                        setSelectedPrice(parseFloat(productData.individual_full_price));
                    }

                    setError(null);
                })
                .catch(error => {
                    if (error.response && error.response.status === 404) {
                        setError('Product not found.');
                    } else {
                        setError('An error occurred while fetching the product.');
                    }
                });
        } else {
            setError('Invalid product ID.');
        }
    }, [id]);

    const handleTypeChange = (e) => {
        const type = e.target.value;
        setSelectedType(type);

        if (product[type]) {
            setSelectedPrice(parseFloat(product[type]));
        }
    };

    const handleAddToCart = () => {
        addToCart({
            id: product.id,
            name: product.name,
            image: product.image,
            selectedType,
            price: selectedPrice,
            quantity
        });
    };

    if (error) return <p>{error}</p>;
    if (!product) return <p>Loading...</p>;

    return (
        <>
            <div className="teacher_title_contactPage">
                <h1>{product.name}</h1>
            </div>

            <div className="product_detal_fon">
                <div className="product-details-page container">

                    {/* IMAGE */}
                    <div className="product-header">
                        <img
                            loading="lazy"
                            className="product-image"
                            src={product.image ? `${BASE_URL}${product.image}` : `${BASE_URL}/fallback.jpg`}
                            alt={product.name}
                        />
                    </div>

                    <div className="product-info">

                        {/* DESCRIPTION */}
                        <div className="product_description">
                            <h3>Course Description</h3>
                            <p>{product.description_en}</p>

                            <h5>What does the student get?</h5>
                            <ul>
                                <li>✔ Cambridge methodology</li>
                                <li>✔ Live meetings with teacher</li>
                                <li>✔ Access to materials</li>
                                <li>✔ Homework & quizzes</li>
                                <li>✔ Personal support manager</li>
                                <li>✔ Certificate</li>
                                <li>✔ Guaranteed progress</li>
                            </ul>
                        </div>

                        {/* PRICE SELECTOR */}
                        <div className="price-box">

                            <label htmlFor="productType">Select Course Type:</label>
                            <select id="productType" value={selectedType} onChange={handleTypeChange}>

                                {priceTypes.map(type =>
                                    product[type.key] ? (
                                        <option key={type.key} value={type.key}>
                                            {type.label} — {product[type.key]} AMD
                                        </option>
                                    ) : null
                                )}

                            </select>

                            {/* Custom manual price */}
                            <div className="manual-price-input">
                                <label>Enter Custom Price:</label>
                                <input
                                    type="number"
                                    value={selectedPrice}
                                    onChange={e => setSelectedPrice(parseFloat(e.target.value) || 0)}
                                />
                            </div>

                            <span>Total: {quantity * selectedPrice} AMD</span>

                            <button className="button" onClick={handleAddToCart}>
                                Add to Cart
                            </button>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ProductDetails;
