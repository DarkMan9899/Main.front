import React from 'react';
import '../styles/Hero.css';
import hero from "../Img/glxavor ej.png";

function Hero(props) {
    return (
        <div className="hero">
            <div className="hero-cont">
                <div className="hero-text">
                    <span>Welcome to <br/>  Polyglot Academy</span>
                    <ul className="custom-arrow">
                        <li><b>Convenient Learning:</b> Learn languages at your convenience, anytime, anywhere.</li>
                        <li><b>Free Level Assessment:</b> Start with a complimentary demo lesson to determine your
                            language proficiency.
                        </li>
                        <li><b>Expert-Guided Courses:</b> Select tailored individual or group packages to enhance your
                            language skills with our skilled educators at Polyglot Academy.
                        </li>
                    </ul>
                </div>
                <img alt="hero"
                     src={hero}
                     loading="lazy"
                     className="hero-img"/>
            </div>
        </div>
    );
}

export default Hero;
