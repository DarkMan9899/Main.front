import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/ProductPreview.css';

const isProduction = process.env.NODE_ENV === 'production';
const BASE_URL = isProduction ? 'https://main-api.academy-polyglot.site' : 'http://localhost:5001';

const getImageUrl = (imagePath) => {
    return `${BASE_URL.replace(/\/$/, '')}/${imagePath.replace(/^\//, '')}`;
};

function ProductPreview({ product }) {
    const scrollToTop = () => {
        window.scrollTo(0, 0);
    };

    return (
        <div className="product-card-item">
            <img
                loading="lazy"
                src={getImageUrl(product.image)}
                alt={product.name}
                className="product-image_p"
            />
            <h3 className="product-name">{product.name}</h3>
            <Link to={`/product/${product.id}`} className="product-link">
                <button className="view-details-button" onClick={scrollToTop}>
                    Courses
                </button>
            </Link>
        </div>
    );
}

export default ProductPreview;
