import React from 'react';
import StatisticsCard from './StatisticsCard';
import '../styles/StatisticsCard.css';

import icon1 from '../Img/ikona 1.png';
import icon2 from '../Img/ikona 2.png';
import icon3 from '../Img/ikona 3.png';
import icon4 from '../Img/ikona 4.png';


const statisticsData = [
    {icon: icon1, number: 2000, text: 'Students currently learning '},
    {icon: icon2, number: 4000, text: 'Successfully completed'},
    {icon: icon3, number: 60, text: 'Team members'},
    {icon: icon4, number: 600, text: 'Beneficiaries of social programs'}
];

function StatisticsSection() {
    return (
        <div className="statistics-section">
            {statisticsData.map((data, index) => (
                <StatisticsCard key={index} icon={data.icon} number={data.number} text={data.text}/>
            ))}
        </div>
    );
}

export default StatisticsSection;
