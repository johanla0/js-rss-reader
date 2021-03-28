// eslint-disable-next-line import/extensions
import i18next from 'i18next';
import app from './index.js';
import './scss/style.scss';
import en from './locales/en.yml';
import ru from './locales/ru.yml';
// import LanguageDetector from 'i18next-browser-languagedetector';
// .use(LanguageDetector)

const run = () => {
  i18next
    .init({
      fallbackLng: 'en',
      debug: true,
      resources: {
        en,
        ru,
      },
    })
    .then((t) => {
      app(t);
    });
};

run();
