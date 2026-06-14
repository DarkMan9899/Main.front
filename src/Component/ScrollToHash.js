import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToHash() {
    const location = useLocation();

    useEffect(() => {
        if (!location.hash) return;

        const id = location.hash.replace("#", "");
        let attempts = 0;

        const scrollToElement = () => {
            const el = document.getElementById(id);
            if (!el) return false;

            const headerOffset = 120; // 🔧 header-ի բարձրությունը
            const y =
                el.getBoundingClientRect().top +
                window.pageYOffset -
                headerOffset;

            window.scrollTo({
                top: y,
                behavior: "smooth",
            });

            return true;
        };

        const interval = setInterval(() => {
            if (scrollToElement() || attempts > 15) {
                clearInterval(interval);
            }
            attempts++;
        }, 100);

        return () => clearInterval(interval);
    }, [location.pathname, location.hash]);

    return null;
}
