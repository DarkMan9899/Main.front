import React from 'react';
import MyTeam from "../Component/MyTeam";
import Gallery from "../Component/Gallery";
import "../styles/AboutUsePage.css"
import SocialProgram from "../Component/SocialProgram";
import about from "../Img/nkar - about us.jpg";

function AboutUsPage(props) {
    return (
        <div>
            <div className="title_about_us">
                <p>About Us</p>
            </div>
            <div className="about_page_font">
                <div className="container text_about">
                    <p>Welcome to Polyglot Academy, where language learning knows no bounds. Our mission is to empower
                        individuals of all ages to achieve their linguistic goals through personalized and engaging
                        instruction. We offer a diverse range of language courses tailored to meet the unique needs of
                        each
                        student, ensuring a comprehensive and enjoyable learning experience.
                    </p>
                    <span>With Polyglot Academy, you'll gain the confidence to communicate effectively and connect with people around the world.</span>
                    <div className="about_img_text">
                        <img loading="lazy" alt="About" src={about}/>
                        <ul>
                            <li>Own Learning Platform</li>
                            <li>Gamification with AI Bot</li>
                            <li>Cambridge Teaching Methodology</li>
                            <li>Peer-to-Peer Methodology</li>
                        </ul>
                    </div>
                </div>
            </div>

            <Gallery/>
            <SocialProgram/>
            <MyTeam/>
        </div>
    );
}

export default AboutUsPage;
