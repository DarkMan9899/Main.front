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

    useEffect(() => {
        if (id) {
            axios.get(`${API_URL_Product_Details}${id}`)
                .then(response => {
                    const productData = response.data;
                    if (productData && productData.individual_price != null && productData.group_price != null) {
                        setProduct(productData);
                        setSelectedType('individual');
                        setSelectedPrice(parseFloat(productData.individual_price)); // Set initial price
                        setError(null);
                    } else {
                        throw new Error('Product prices are missing or invalid.');
                    }
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
        const price = type === 'individual' ? parseFloat(product.individual_price) : parseFloat(product.group_price);
        setSelectedPrice(price);
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
                <h1>Product Details</h1>
            </div>
            <div className="product_detal_fon">
                <div className="product-details-page container">
                    <div className="product-header">
                        <img
                            loading="lazy"
                            className="product-image"
                            src={product.image ? `${BASE_URL}${product.image}` : `${BASE_URL}/path/to/fallback-image.jpg`}
                            alt={product.name || 'Product Image'}
                        />
                    </div>
                    <div className="product-info">
                            <div>
                                <h2>{product.name}</h2>
                                <div className="product_description">
                                    <p>Three-Month Course</p>
                                    <ul className="cours_title">
                                        <li>3 lessons per week</li>
                                        <li>2 live meetings</li>
                                        <li>1 AI-assisted task or video tutorial</li>
                                    </ul>
                                    <h5>What does our student get as a result? </h5>
                                    <ul className="course_end">
                                        <li>✅ Cambridge Methodology training</li>
                                        <li>✅ Direct meetings with the teacher</li>
                                        <li>✅ Access to stored materials</li>
                                        <li>✅ Regular homework and quizzes</li>
                                        <li>✅ Personal Support Manager</li>
                                        <li>✅ Convenient educational platform</li>
                                        <li>✅ Certificate</li>
                                        <li>✅ Guaranteed results</li>
                                    </ul>
                                </div>
                        </div>
                        <div>
                            <div className="price-select">
                                <label htmlFor="productType">Choose Type:</label>
                                <select
                                    id="productType"
                                    value={selectedType}
                                    onChange={handleTypeChange}
                                >
                                    <option value="individual">Individual - {product.individual_price} AMD</option>
                                    <option value="group">Group - {product.group_price} AMD</option>
                                </select>
                            </div>
                            <div className="manual-price-input">
                                <label>Enter Price:</label>
                                <input
                                    type="number"
                                    value={selectedPrice}
                                    onChange={e => setSelectedPrice(parseFloat(e.target.value) || 0)}
                                />
                            </div>
                            <div className="quantity-input">
                                <label>Count</label>
                                <input
                                    type="number"
                                    value={quantity}
                                    min="1"
                                    onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                />
                                <span>Total: {quantity * selectedPrice} AMD</span>
                            </div>
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
