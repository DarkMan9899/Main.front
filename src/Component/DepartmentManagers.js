import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import axios from 'axios';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import { useTranslation } from 'react-i18next';
import '../styles/Managers.css';

import { API_URL_MyTeam } from '../api';

const isProduction = process.env.NODE_ENV === 'production';
const BASE_URL = isProduction
    ? 'https://main-api.academy-polyglot.site'
    : 'http://localhost:5001';

const CACHE_KEY = 'managers_cache';
const CACHE_TIME = 'managers_cache_time';
const CACHE_DURATION = 24 * 60 * 60 * 1000;

function DepartmentManagers() {
    const { i18n, t } = useTranslation();
    const lang = i18n.language || "hy";

    const [managers, setManagers] = useState([]);
    const [error, setError] = useState(null);

    const fetchManagers = async () => {
        try {
            const { data } = await axios.get(API_URL_MyTeam, { withCredentials: true });

            if (!Array.isArray(data)) {
                throw new Error("API returned non-array");
            }

            setManagers(data);
            localStorage.setItem(CACHE_KEY, JSON.stringify(data));
            localStorage.setItem(CACHE_TIME, Date.now().toString());
        } catch (err) {
            setError(err);
        }
    };

    useEffect(() => {
        const cached = localStorage.getItem(CACHE_KEY);
        const time = localStorage.getItem(CACHE_TIME);

        if (cached && time && Date.now() - Number(time) < CACHE_DURATION) {
            setManagers(JSON.parse(cached));
            fetchManagers();
        } else {
            fetchManagers();
        }
    }, []);

    if (error) return <p>Error: {error.message}</p>;

    const settings = {
        dots: false,
        infinite: true,
        arrows: false,
        speed: 500,
        autoplay: true,
        autoplaySpeed: 3000,
        slidesToShow: 3,
        slidesToScroll: 1,

        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: 3 } },
            { breakpoint: 768, settings: { slidesToShow: 2 } },
            { breakpoint: 480, settings: { slidesToShow: 1 } },
        ],
    };

    return (
        <section className="managers-section container">
            <h2>{t("aboutPage.structure.managersTitle")}</h2>

            <Slider {...settings}>
                {managers.map((m, i) => {
                    const name = m[`name_${lang}`] || m.name_hy;
                    const role = m[`role_${lang}`] || m.role_hy;
                    const desc = m[`description_${lang}`] || m.description_hy;

                    return (
                        <div className="manager-card" key={i}>
                            <img
                                src={`${BASE_URL}${m.img}`}
                                alt={name}
                                loading="lazy"
                            />
                            <h3>{name}</h3>
                            <p className="manager-role">{role}</p>
                            <p className="manager-desc">{desc}</p>
                        </div>
                    );
                })}
            </Slider>
        </section>
    );
}

export default DepartmentManagers;


