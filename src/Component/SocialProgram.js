import React from 'react';
import icon1 from "../Img/logo2.png";
import icon2 from "../Img/logo3.png";
import icon3 from "../Img/logo4.png";
import Soc from "../Img/hamagorcakcutyun.png"
import "../styles/SocialProgram.css"

function SocialProgram(props) {

    const SocialProgramImg = [
        {icon: icon1, text: 'Successfully Trained'},
        {icon: icon2, text: 'Successfully Trained'},
        {icon: icon3, text: 'Successfully Trained'},
    ];

    return (
        <div className="SocialProgram">
            <div className="container">
                <div className="social_program_img">
                    <img src={Soc} alt="Soc"/>

                    <div className="soc_text">
                        <p>Social Partnership</p>
                        <span>At Polyglot Academy, we passionately embrace the spirit of compassion and collaboration through our Social Partnership initiatives. Proudly teaming up with the "Zinvori Tun Rehabilitation Center," "Children in Regions," and "Community to Country," we extend the gift of education. Our courses are offered completely free, aiming to equip beneficiaries with essential language skills. Our mission is not just about teaching languages but about empowering lives, unlocking new possibilities, and nurturing a strong sense of community and solidarity. Together, we aim to create a meaningful and lasting impact in the lives of those who need it most. Join us in making a difference, one language lesson at a time!</span>
                    </div>
                </div>
                <div className="social_program_logo">
                    {SocialProgramImg.map((data, index) => (
                        <div key={index} className="logo_item">
                            <img loading="lazy" alt={data.text} src={data.icon}/>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default SocialProgram;
