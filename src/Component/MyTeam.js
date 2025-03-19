import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../styles/MyTeam.css';
import axios from 'axios';
import { API_URL_MyTeam } from '../api';

const isProduction = process.env.NODE_ENV === 'production';
const BASE_URL = isProduction ? 'https://academy-polyglot.site' : 'http://localhost:5001';


const CACHE_KEY = 'my_team_cache';
const CACHE_TIME_KEY = 'my_team_cache_time';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

const BlogPosts = () => {
    const [myTeam, setMyTeam] = useState([]);
    const [error, setError] = useState(null);

    const fetchMyTeamFromAPI = async () => {
        try {
            const response = await axios.get(API_URL_MyTeam, { withCredentials: true });
            if (Array.isArray(response.data)) {
                setMyTeam(response.data);
                localStorage.setItem(CACHE_KEY, JSON.stringify(response.data));
                localStorage.setItem(CACHE_TIME_KEY, Date.now().toString());
            } else {
                throw new Error('API response is not an array');
            }
        } catch (error) {
            setError(error);
        }
    };

    const getMyTeam = () => {
        const cachedData = localStorage.getItem(CACHE_KEY);
        const cacheTime = localStorage.getItem(CACHE_TIME_KEY);
        const now = Date.now();

        if (cachedData && cacheTime && now - parseInt(cacheTime) < CACHE_DURATION) {
            setMyTeam(JSON.parse(cachedData));
            fetchMyTeamFromAPI(); // Revalidate in the background
        } else {
            fetchMyTeamFromAPI();
        }
    };

    useEffect(() => {
        getMyTeam();
    }, []);

    if (error) {
        return <div>Error fetching team members: {error.message}</div>;
    }

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
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
        <div className="blog-posts my-team-container">
            <h2>My Team</h2>
            <Slider {...settings}>
                {myTeam.map((post, index) => (
                    <div className="post" key={index}>
                        <img src={`${BASE_URL}${post.img}`} loading="lazy" alt={post.alt} />
                        <div className="post-details">
                            <p>
                                <span className="post-date">{post.name}</span>
                            </p>
                            <p>{post.description}</p>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default BlogPosts;
