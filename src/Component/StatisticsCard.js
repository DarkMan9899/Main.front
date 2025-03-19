import React from 'react';
import CountUp from 'react-countup';
import '../styles/StatisticsCard.css';

function StatisticsCard({ icon, number, text }) {
    return (
        <div className="">
            <div className="statistics-card">
                <img loading="lazy" src={icon} alt={text} className="statistics-icon" />
                <div className="statistics-info">
                    <CountUp className="statistics-number" end={number} duration={2} suffix="+" />
                    <p className="statistics-text">{text}</p>
                </div>
            </div>
        </div>

    );
}

export default StatisticsCard;
