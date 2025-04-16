import React, {useState, useEffect} from 'react';
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
    const [quantity, setQuantity] = useState(1);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (id) {
            axios.get(`${API_URL_Product_Details}${id}`)
                .then(response => {
                    const productData = response.data;

                    if (productData && productData.individual_price != null && productData.group_price != null) {
                        setProduct(productData);
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

    if (error) return <p>{error}</p>;
    if (!product) return <p>Loading...</p>;

    const handleAddToCart = () => {
        addToCart({
            id: product.id,
            name: product.name,
            image: product.image,
            selectedType,
            price: selectedType === 'individual' ? product.individual_price : product.group_price,
            quantity
        });
    };

    const scrollToTop = () => {
        window.scrollTo(0, 0);
    };

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
                                <p>Ready to join us? Click the button below!</p>
                            </div>
                        </div>
                        <a href="/contact" className="button" onClick={() => {
                            scrollToTop();
                        }}>Contact Us</a>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ProductDetails;
