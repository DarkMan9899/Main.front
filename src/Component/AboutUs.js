import React from 'react';
import "../styles/AboutUs.css";
import about from "../Img/nkar - about us.jpg";

function AboutUs(props) {
    return (
        <div className='about-us'>
            <div className="container_about container">
                <img
                    alt="About Us"
                    src={about}
                    className="about-image"
                    loading="lazy"
                    onError={(e) => {e.target.src = 'fallback-image.png';}}
                />
                <div className="text-about">
                    <div className="about_us_button">
                        <span>About Us</span>
                        <a href="/aboutus" className="button">More About Us</a>
                    </div>
                    <p>
                        At Polyglot Academy, our success is driven by a big team of motivated and smart individuals who are passionate about language learning and innovation. Each member of our team brings unique skills and expertise, working together to provide you with the best language learning experience possible.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default AboutUs;
