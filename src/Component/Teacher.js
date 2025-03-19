import React from 'react';
import "../styles/Teacher.css"

import Anna from "../Img/Միսս Աննա.png"
import Mane from "../Img/Միսս Մանե.png"
import Qristine from "../Img/Քրիստինե Ալբերտովնա.png"
import Tamara from "../Img/Tamara.png"

const teacher = [
    {
        name: 'Miss Mane',
        title: 'English Tutor',
        image: Mane
    },
    {
        name: 'Mrs Anna',
        title: 'English Tutor',
        image: Anna
    },
    {
        name: 'Christine Albertovna',
        title: 'Russian Tutor',
        image: Qristine
    },
    {
        name: 'Tamara Ivanovna',
        title: 'Russian Tutor',
        image: Tamara
    }
];

const Teacher = () => {
    return (
        <div className="teacher_section">
            <div className="teacher-container">
                <div className="title-section">
                    <h2>Meet <span className="highlight">Our</span> Tutors</h2>
                    <p>At Polyglot Academy, we believe that the key to mastering a new language lies in the guidance and
                        expertise of exceptional tutors. Our team of qualified language professionals is dedicated to
                        making your language learning journey both effective and enjoyable. For more tutors, click the
                        "Tutors" button.</p>
                    <div className="button-group">
                        <a href="/contact" className="button">Contact Us</a>
                        <a href="/teacher" className="button">Tutors</a>
                    </div>
                </div>
                <div className="teacher-grid">
                    {teacher.map((teacher, index) => (
                        <div key={index} className="teacher-card">
                            <img loading="lazy" src={teacher.image} alt={teacher.name}/>
                            <h3>{teacher.name}</h3>
                            <p>{teacher.title}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Teacher;
