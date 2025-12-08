import React from "react";
import { useTranslation } from "react-i18next";
import StatisticsCard from "./StatisticsCard";
import "../styles/StatisticsCard.css";

import icon1 from "../Img/ikona 1.png";
import icon2 from "../Img/ikona 2.png";
import icon3 from "../Img/ikona 3.png";
import icon4 from "../Img/ikona 4.png";

function StatisticsSection() {
    const { t } = useTranslation();

    const statisticsData = [
        { icon: icon1, number: 2000, text: t("statistics.students") },
        { icon: icon2, number: 4000, text: t("statistics.completed") },
        { icon: icon3, number: 60, text: t("statistics.team") },
        { icon: icon4, number: 600, text: t("statistics.beneficiaries") },
    ];

    return (
        <section className="statistics-wrapper">
            <div className="statistics-section">
                {statisticsData.map((data, index) => (
                    <StatisticsCard
                        key={index}
                        icon={data.icon}
                        number={data.number}
                        text={data.text}
                    />
                ))}
            </div>
        </section>
    );
}

export default StatisticsSection;
