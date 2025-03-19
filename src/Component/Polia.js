import React from 'react';
import './../styles/Polia.css';
import about from '../Img/robot.png';

const Polia = (props) => {
    const openSocialMedia = (url) => {
        window.open(url, '_blank');
    };

    const features = [
        {
            icon: 'fa-regular fa-circle-check',
            title: 'Advanced AI Technology',
            description: 'Enjoy a smart and intuitive learning experience'
        },
        {
            icon: 'fa-regular fa-circle-check',
            title: 'User-Friendly Interface',
            description: 'Navigate the platform easily, no matter your tech skills.'
        },
        {
            icon: 'fa-regular fa-circle-check',
            title: 'Support and Motivation',
            description: 'Polya offers constant encouragement to keep you engaged'
        },
        {
            icon: 'fa-regular fa-circle-check',
            title: 'Continuous Improvement',
            description: 'Polya regularly updates content and features to enhance your learning experience.'
        }
    ];

    return (
        <div className="polia-container">
            <div className="container">
                <div className="polia-info">
                    <h2 className="polia-title">Meet Polya: Your AI Learning Companion at Polyglot Academy</h2>
                    <p className="polia-description">We’re thrilled to introduce Polya, our innovative AI bot designed
                        to make language learning quick and easy.</p>
                </div>
                <div className="polia_section">
                    <div className="polia-left">
                        <div className="polia-grid">
                            {features.map((feature, index) => (
                                <div className="polia-item" key={index}>
                                    <div className="polia-item_icon">
                                        <i className={feature.icon}></i>
                                        <h3 className="polia-item-name">{feature.title}</h3>
                                    </div>
                                    <p className="polia-item-description">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                        <div className="free_test">
                            <p className="polia-description">Discover your language level with precision using Polya's
                                quick assessment. Click the link to find out where you stand!</p>
                            <button onClick={() => openSocialMedia('https://salebot.site/student_test_1')}
                                    className=" button_pol">Check Your Language Level
                            </button>
                        </div>
                    </div>
                    <div className="polia-right">
                        <img loading="lazy" src={about} alt="Polya"/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Polia;
