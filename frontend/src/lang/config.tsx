import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { i18nextPlugin } from "translation-check";
import resources from "@lang/translations.json";

i18n
  .use(initReactI18next)
  .use(i18nextPlugin)
  .init({
    resources,
    lng: "fr",
    fallbackLng: "en",
    interpolation: {
      escapeValue: true,
    },
    missingInterpolationHandler() {
      return "";
    },
  });

console.log(i18n);

export default i18n;

// launch translation check: http://localhost:3000?showtranslations
