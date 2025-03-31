import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/TeacherPage.css';
import { API_URL_Teacher_Page } from '../api';

// Define the environment check and BASE_URL
const isProduction = process.env.NODE_ENV === 'production';
const BASE_URL = isProduction ? 'https://polyglotacademy.am' : 'http://localhost:5001';

const CACHE_KEY = 'teacher_data_cache';
const CACHE_TIME_KEY = 'teacher_data_cache_time';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

function TeacherPage() {
    const [teachers, setTeachers] = useState([]);
    const [error, setError] = useState(null);
    axios.defaults.withCredentials = true;

    const fetchTeachersFromAPI = async () => {
        try {
            const response = await axios.get(API_URL_Teacher_Page, { withCredentials: true });
            if (response.data && Array.isArray(response.data.results)) {
                setTeachers(response.data.results);
                localStorage.setItem(CACHE_KEY, JSON.stringify(response.data.results));
                localStorage.setItem(CACHE_TIME_KEY, Date.now().toString());
            } else {
                throw new Error('API response does not contain a teachers array');
            }
        } catch (error) {
            setError(error);
        }
    };

    const getTeachers = () => {
        const cachedData = localStorage.getItem(CACHE_KEY);
        const cacheTime = localStorage.getItem(CACHE_TIME_KEY);
        const now = Date.now();

        if (cachedData && cacheTime && now - parseInt(cacheTime) < CACHE_DURATION) {
            setTeachers(JSON.parse(cachedData));
            // Revalidate in the background
            fetchTeachersFromAPI();
        } else {
            fetchTeachersFromAPI();
        }
    };

    useEffect(() => {
        getTeachers();
    }, []);

    if (error) {
        return <div>Error fetching teachers: {error.message}</div>;
    }

    return (
        <div>
            <div className="teacher_title_contactPage">
                <h1>Tutors</h1>
            </div>
            <div className="teacher_pag_cont">
                <div className="teacher_card-grid">
                    {teachers.map((teacher, index) => (
                        <div key={index} className="teacherPage-card-item">
                            {/* Construct the full image URL dynamically */}
                            <img
                                loading="lazy"
                                alt={teacher.name}
                                src={`${BASE_URL}${teacher.img}`}
                            />
                            <span>{teacher.name}</span>
                            <p>{teacher.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default TeacherPage;
