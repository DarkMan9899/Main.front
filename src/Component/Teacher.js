import React from "react";
import { useTranslation } from "react-i18next";
import { useParams, Link } from "react-router-dom";
import "../styles/Teacher.css";

import Anna from "../Img/Միսս Աննա.png";
import Mane from "../Img/Միսս Մանե.png";
import Qristine from "../Img/Քրիստինե Ալբերտովնա.png";
import Tamara from "../Img/Tamara.png";

const Teacher = () => {
    const { t } = useTranslation();
    const { lang } = useParams();

    const teachers = [
        { name: t("teacher.teachers.0.name"), title: t("teacher.teachers.0.title"), image: Mane },
        { name: t("teacher.teachers.1.name"), title: t("teacher.teachers.1.title"), image: Anna },
        { name: t("teacher.teachers.2.name"), title: t("teacher.teachers.2.title"), image: Qristine },
        { name: t("teacher.teachers.3.name"), title: t("teacher.teachers.3.title"), image: Tamara },
    ];

    return (
        <section className="teacher_section">
            <div className="teacher-container">
                {/* 👩‍🏫 Tutors Grid */}
                <div className="teacher-grid">
                    {teachers.map((teacher, index) => (
                        <div key={index} className="teacher-card">
                            <img
                                loading="lazy"
                                src={teacher.image}
                                alt={teacher.name}
                                className="teacher-image"
                            />
                            <h3>{teacher.name}</h3>
                            <p>{teacher.title}</p>
                        </div>
                    ))}
                </div>

                {/* 🔹 Title Row */}
                <div className="teacher-header">
                    <h2>{t("teacher.title")}</h2>
                    <Link to={`/${lang}/teacher`} className="button">
                        {t("teacher.view_all")}
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Teacher;
