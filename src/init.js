// eslint-disable-next-line import/extensions
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.js';
import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import app from './index.js';
import './scss/style.scss';
import en from './locales/en.yml';
import ru from './locales/ru.yml';

const run = () => {
  i18next
    .use(LanguageDetector)
    .init({
      detection: {
        // order and from where user language should be detected
        order: [
          'querystring',
          'cookie',
          'localStorage',
          'sessionStorage',
          'navigator',
          'htmlTag',
          'path',
          'subdomain',
        ],
        // keys or params to lookup language from
        lookupQuerystring: 'lng',
        lookupCookie: 'i18next',
        lookupLocalStorage: 'i18nextLng',
        lookupSessionStorage: 'i18nextLng',
        lookupFromPathIndex: 0,
        lookupFromSubdomainIndex: 0,
        // cache user language on
        caches: ['localStorage', 'cookie'],
        excludeCacheFor: ['cimode'],
      },
      fallbackLng: 'ru',
      debug: true,
      resources: {
        en,
        ru,
      },
    })
    .then(() => {
      app();
    })
    // eslint-disable-next-line no-console
    .catch((err) => console.error(`Failed loading i18next translations: ${err}`));
};

run();
