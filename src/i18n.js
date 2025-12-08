import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import hy from "./locales/hy/translation.json";
import ru from "./locales/ru/translation.json";
import en from "./locales/en/translation.json";

i18n
    .use(initReactI18next)
    .init({
        resources: {
            hy: { translation: hy },
            ru: { translation: ru },
            en: { translation: en },
        },
        lng: "hy", // default language
        fallbackLng: "en",
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
