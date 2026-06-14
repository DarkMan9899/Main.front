import "./../styles/NewYearGreeting.css";
import { useEffect, useState } from "react";

const greetings = [
    "🎄 Շնորհավոր Նոր Տարի",
    "🎄 С Новым годом",
    "🎄 Happy New Year",
    "🎄 Bonne année",
    "🎄 Frohes neues Jahr",
    "🎄 Feliz Año Nuevo"
];

export default function NewYearGreeting() {
    const [index, setIndex] = useState(0);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        if (index >= greetings.length - 1) {
            const endTimer = setTimeout(() => {
                setVisible(false);
            }, 1200); // վերջում արագ անհետանա
            return () => clearTimeout(endTimer);
        }

        const timer = setTimeout(() => {
            setIndex((i) => i + 1);
        }, 1200); // ⏱ արագ հերթափոխ

        return () => clearTimeout(timer);
    }, [index]);

    if (!visible) return null;

    return (
        <div className="ny-wrapper">
            <div key={index} className="ny-text slide-fast">
                {greetings[index]}
            </div>
        </div>
    );
}
