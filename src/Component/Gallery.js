import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import axios from 'axios';
import '../styles/Gallery.css';
import { API_URL_Gallery } from '../api';

const isProduction = process.env.NODE_ENV === 'production';
const BASE_URL = isProduction ? 'https://academy-polyglot.site' : 'http://localhost:5001';

const CACHE_KEY = 'gallery_images_cache';
const CACHE_TIME_KEY = 'gallery_images_cache_time';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

const Gallery = () => {
    const [gallery, setGallery] = useState([]);
    const [error, setError] = useState(null);

    const fetchGalleryFromAPI = async () => {
        try {
            const response = await axios.get(`${API_URL_Gallery}`, { withCredentials: true });
            if (response.data && Array.isArray(response.data.results)) {
                setGallery(response.data.results);
                localStorage.setItem(CACHE_KEY, JSON.stringify(response.data.results));
                localStorage.setItem(CACHE_TIME_KEY, Date.now().toString());
            } else {
                throw new Error('API response does not contain a results array');
            }
        } catch (error) {
            console.error('Error fetching gallery:', error);
            setError(error);
        }
    };

    const getGallery = () => {
        const cachedData = localStorage.getItem(CACHE_KEY);
        const cacheTime = localStorage.getItem(CACHE_TIME_KEY);
        const now = Date.now();

        if (cachedData && cacheTime && now - parseInt(cacheTime) < CACHE_DURATION) {
            setGallery(JSON.parse(cachedData));
            // Revalidate in the background
            fetchGalleryFromAPI();
        } else {
            fetchGalleryFromAPI();
        }
    };

    useEffect(() => {
        getGallery();
    }, []);

    if (error) {
        return <div>Error fetching gallery: {error.message}</div>;
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
                    infinite: true,
                    dots: false,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: false,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: false,
                },
            },
        ],
    };

    return (
        <div className="gallery_posts my-team-container">
            <Slider {...settings}>
                {gallery.map((item, index) => (
                    <div className="post" key={index}>
                        <img loading="lazy"
                             src={`${BASE_URL}${item.img}`}
                             alt={`Gallery image ${index}`} />
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default Gallery;
