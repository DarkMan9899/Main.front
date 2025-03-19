import React from 'react';
import Slider from 'react-slick';
import { useQuery } from 'react-query';
import '../styles/Comments.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";
import { API_URL_Comment } from "../api";

const fetchComments = async () => {
    const { data } = await axios.get(API_URL_Comment);
    return data;
};

const TestimonialSlider = () => {
    const { data: comments, error, isLoading } = useQuery('comments', fetchComments, {
        staleTime: 5 * 60 * 1000, // 5 minutes
        cacheTime: 10 * 60 * 1000, // 10 minutes
    });

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 10000,
        arrows: false,
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading comments: {error.message}</div>;

    return (
        <div className="testimonial-section">
            <div className="container_comment">
                <Slider {...settings}>
                    {comments.map((comment, index) => (
                        <div key={index} className="testimonial-slide">
                            <div className="testimonial-content">
                                <div className="testimonial-text">
                                    <h3>{comment.name}</h3>
                                    <p>{comment.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>
        </div>
    );
};

export default TestimonialSlider;
