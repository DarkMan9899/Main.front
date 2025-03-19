import React, {useState, useEffect} from 'react';
import axios from 'axios';
import '../styles/ProductCollection.css';
import {API_URL_Product_Collection} from "../api"

function ProductCollection() {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);

    console.log(products)
    useEffect(() => {
        axios.get(`${API_URL_Product_Collection}`)
            .then(response => {
                setProducts(response.data);
                setError(null);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setError('Error fetching products.');
            });
    }, []);

    if (error) return <p>{error}</p>;
    if (!products.length) return <p>Loading...</p>;

    return (
        <div className="product-collection">
            {products.map(product => (
                <div key={product.id} className="product-item">
                    <img loading="lazy" src={product.image} alt={product.name}/>
                    <h3>{product.name}</h3>
                </div>
            ))}
        </div>
    );
}

export default ProductCollection;
