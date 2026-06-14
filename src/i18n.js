import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import hy from "./locales/hy/translation.json";
import ru from "./locales/ru/translation.json";
import en from "./locales/en/translation.json";
import ka from "./locales/ka/translation.json";

const host = window.location.hostname;

/* ===============================
   1️⃣ LANGUAGE DETECTION
================================ */

// check saved language
let defaultLang = localStorage.getItem("lang");

// if no saved language detect by domain
if (!defaultLang) {

    if (host.includes("polyglotacademy.ru")) {
        defaultLang = "ru";
    }

    else if (host.includes("polyglotacademy.com")) {
        defaultLang = "en";
    }

    else if (host.includes("polyglotacademy.am")) {
        defaultLang = "hy";
    }

    else {
        // fallback to browser language
        const browserLang = navigator.language.slice(0, 2);

        if (["hy", "ru", "en","ka"].includes(browserLang)) {
            defaultLang = browserLang;
        } else {
            defaultLang = "hy";
        }
    }

}

/* ===============================
   2️⃣ INIT I18N
================================ */

i18n
    .use(initReactI18next)
    .init({

        resources: {
            hy: { translation: hy },
            ru: { translation: ru },
            en: { translation: en },
            ka: { translation: ka }
        },

        lng: defaultLang,

        fallbackLng: "en",

        interpolation: {
            escapeValue: false,
        }

    });

/* ===============================
   3️⃣ SAVE LANGUAGE ON CHANGE
================================ */

i18n.on("languageChanged", (lng) => {
    localStorage.setItem("lang", lng);
});

export default i18n;