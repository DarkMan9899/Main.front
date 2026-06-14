import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/TeacherPage.css";
import { API_URL_Teacher_Page } from "../api";
import { useTranslation } from "react-i18next";

const isProduction = process.env.NODE_ENV === "production";
const BASE_URL = isProduction
    ? "https://main-api.academy-polyglot.site"
    : "http://localhost:5001";

const CACHE_KEY = "teacher_data_cache";
const CACHE_TIME_KEY = "teacher_data_cache_time";
const CACHE_DURATION = 24 * 60 * 60 * 1000;

// 🔑 Role → section text
const SECTIONS = {
    teacher: {
        title: { hy: "Կրթական բաժին", ru: "Учебный отдел", en: "Education Department" },
        description: {
            hy: "Մասնագետների թիմ, ովքեր ոչ միայն սովորեցնում են լեզուներ, այլև զարգացնում լեզվական մտածողություն։",
            ru: "Учебный отдел — команда носителей языка, развивающих языковое мышление.",
            en: "Education department — specialised instructors  who develop linguistic thinking.",
        },
    },
    marketing: {
        title: { hy: "Մարքեթինգ և PR բաժին", ru: "Отдел маркетинга и PR", en: "Marketing & PR Department" },
        description: {
            hy: "Մասնագետների թիմ, ովքեր վիզուալիզացնում և փոխանցում են գաղափարներն ու հնարավորությունները։",
            ru: "Команда маркетинга и PR, которая визуализирует идеи и раскрывает возможности.",
            en: "Marketing & PR team that visualizes ideas and brings opportunities to life.",
        },
    },
    sales: {
        title: { hy: "Վաճառքի և սպասարկման բաժին", ru: "Отдел продаж", en: "Sales Department" },
        description: {
            hy: "Վաճառքի և սպասարկման մասնագետների թիմ, որը բացահայտում է կարիքներն ու առաջարկում լուծումներ։",
            ru: "Команда специалистов по продажам и обслуживанию, выявляющая потребности и предлагающая решения.",
            en: "Sales & Customer Support team that identifies needs and delivers effective solutions.",
        },
    },
    support: {
        title: { hy: "Աջակցման բաժին", ru: "Отдел менторов", en: "Mentor Department" },
        description: {
            hy: "Մենթորների թիմ, որը աջակցում է ուսանողին ուսուցման ողջ ընթացքում։",
            ru: "Команда менторов, сопровождающая студентов на всех этапах обучения.",
            en: "Mentor team that supports students throughout the entire learning journey.",
        },
    },
    tech: {
        title: { hy: "Տեխնիկական բաժին", ru: "Техническая աջակցություն", en: "Technical Support" },
        description: {
            hy: "Տեխնիկական աջակցության բաժին, որն ապահովում է հարթակի անխափան աշխատանքը։",
            ru: "Отдел технической поддержки, обеспечивающий бесперебойную работу платформы.",
            en: "Technical Support department ensuring smooth and reliable platform performance.",
        },
    },
};

function TeacherPage() {
    const [teachers, setTeachers] = useState([]);
    const [error, setError] = useState(null);
    const { t, i18n } = useTranslation();


    axios.defaults.withCredentials = true;

    const fetchTeachersFromAPI = async () => {
        try {
            const response = await axios.get(API_URL_Teacher_Page);
            if (Array.isArray(response?.data?.results)) {
                setTeachers(response.data.results);
                localStorage.setItem(CACHE_KEY, JSON.stringify(response.data.results));
                localStorage.setItem(CACHE_TIME_KEY, Date.now().toString());
            }
        } catch (err) {
            setError(err);
        }
    };

    const getTeachers = () => {
        const cached = localStorage.getItem(CACHE_KEY);
        const cacheTime = localStorage.getItem(CACHE_TIME_KEY);

        if (cached && cacheTime && Date.now() - Number(cacheTime) < CACHE_DURATION) {
            setTeachers(JSON.parse(cached));
            requestIdleCallback(fetchTeachersFromAPI);
        } else {
            fetchTeachersFromAPI();
        }
    };

    useEffect(() => {
        getTeachers();
    }, []);

    const getName = (tch) =>
        i18n.language === "ru"
            ? tch.name_ru
            : i18n.language === "en"
                ? tch.name_en
                : tch.name_hy;

    const getDesc = (tch) =>
        i18n.language === "ru"
            ? tch.description_ru
            : i18n.language === "en"
                ? tch.description_en
                : tch.description_hy;

    const renderSection = (role) => {
        const filtered = teachers.filter((t) => t.role?.toLowerCase() === role);
        if (!filtered.length) return null;

        return (
            <section className="teacher_pag_cont" id={role}>
                <h2 className="teacher_section_title">
                    {SECTIONS[role].title[i18n.language]}
                </h2>

                <p className="teacher_section_description">
                    {SECTIONS[role].description[i18n.language]}
                </p>

                <div className="teacher_card_grid">
                    {filtered.map((teacher, index) => (
                        <div key={teacher.id} className="teacher_card">
                            <img
                                src={`${BASE_URL}${teacher.img}`}
                                alt={getName(teacher)}
                                loading={index < 3 ? "eager" : "lazy"}
                                fetchpriority={index < 3 ? "high" : "auto"}
                                width="150"
                                height="150"
                            />
                            <span>{getName(teacher)}</span>
                            <p>{getDesc(teacher)}</p>
                        </div>
                    ))}
                </div>
            </section>
        );
    };

    if (error) return <div>{t("team.error")}</div>;

    return (
        <>
            <div className="teacher_hero teacher_title_contactPage ">
                <h1>{t("team.title")}</h1>
            </div>

            {Object.keys(SECTIONS).map(renderSection)}
        </>
    );
}

export default TeacherPage;
