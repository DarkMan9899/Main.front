import React from 'react';
import Slider from 'react-slick';
import { useQuery } from 'react-query';
import '../styles/Comments.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";
import { API_URL_Comment, BASE_STATIC_URL } from "../api";
import { useTranslation } from "react-i18next";

const fetchComments = async () => {
    const { data } = await axios.get(API_URL_Comment);
    return data;
};

const TestimonialSlider = () => {
    const { t, i18n } = useTranslation();

    // 👉 ստանում ենք լեզուն (օր. en-US → en)
    const lang = i18n.language.split('-')[0];

    const { data: comments, error, isLoading } = useQuery('comments', fetchComments, {
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
    });

    // 👉 միայն վրացերենի դեպքում փոխում ենք դաշտը
    const getField = (obj, field) => {
        if (lang === "ka") {
            return obj[`${field}_ka`] || obj[field];
        }
        return obj[field];
    };

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
        <div className="testimonial-section container">
            <div className="container_comment">

                <h2 className="testimonial-title">
                    {t("home.testimonials")}
                </h2>

                <Slider {...settings}>
                    {comments.map((comment, index) => (
                        <div key={index} className="testimonial-slide">
                            <div className="testimonial-content">
                                <div className="testimonial-card">

                                    <div className="testimonial-image">
                                        <img
                                            src={`${BASE_STATIC_URL}${comment.img}`}
                                            alt="comment img"
                                            loading="lazy"
                                        />
                                    </div>

                                    <div className="testimonial-text">
                                        <h3 className="animated-name">
                                            {getField(comment, "name")}
                                        </h3>
                                        <p>
                                            {getField(comment, "description")}
                                        </p>
                                    </div>

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