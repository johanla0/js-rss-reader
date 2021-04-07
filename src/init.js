// eslint-disable-next-line import/extensions
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.js';
import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import onChange from 'on-change';
import app from './index.js';
import './scss/style.scss';
import en from './locales/en.yml';
import ru from './locales/ru.yml';
import render from './render.js';

const run = () => {
  const state = {
    urls: [],
    feeds: [],
    posts: [],
    form: {
      url: '',
      state: 'empty',
    },
    lng: '',
  };

  // Description:
  // feeds: {title, description, link, id}
  // posts: {title, description, link, feedId, guid, pubDate}
  // state.form.state corresponds to the FSM state:
  // empty ->
  //   editing ->
  //     invalid ->
  //       editing
  //     valid ->
  //       sent ->
  //         success ->
  //           empty
  //         invalid ->
  //           editing

  const i18nInstance = i18next.createInstance();
  i18nInstance
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
      interpolation: {
        escapeValue: false,
      },
      resources: {
        en,
        ru,
      },
    })
    .then(() => {
      const watchedState = onChange(state, (path) => {
        if (path === 'lng') {
          i18nInstance.changeLanguage(state.lng);
        }
        render(state, i18nInstance);
      });
      watchedState.lng = i18nInstance.language.slice(0, 2);
      const languages = document.querySelectorAll(
        '#languageSelector .dropdown-item',
      );
      languages.forEach((language) => {
        language.addEventListener('click', (e) => {
          e.preventDefault();
          watchedState.lng = language.dataset.lng;
        });
      });
      app(watchedState);
    })
    .catch((err) => console.error(`Failed loading i18next translations: ${err}`));
};

run();
