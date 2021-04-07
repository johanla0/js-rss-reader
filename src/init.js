import '../node_modules/bootstrap/dist/js/bootstrap.bundle.js';
import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import onChange from 'on-change';
import * as yup from 'yup';
import en from './locales/en.yml';
import ru from './locales/ru.yml';
import render from './render.js';
import { loadFeed, updateFeeds } from './processFeeds.js';

const urlSchema = yup.string().required().url();

const app = (state, i18nInstance) => {
  const refreshTimeout = 5000;
  let timeoutId;
  const watchedState = onChange(state, (path) => {
    if (path === 'lng') {
      i18nInstance.changeLanguage(state.lng);
    }
    if (path === 'pause') {
      if (!state.pause) {
        timeoutId = updateFeeds(watchedState, refreshTimeout);
        console.log(timeoutId);
      }
      if (state.pause && timeoutId !== undefined) {
        clearTimeout(timeoutId);
        console.log('paused');
      }
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
  watchedState.pause = false;

  const form = document.querySelector('.rss-form');
  const url = document.querySelector('input[name="url"]');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (watchedState.urls.includes(url.value)) {
      watchedState.form.state = 'invalid';
      return;
    }
    watchedState.form.url = url.value;
    watchedState.urls.push(url.value);
    urlSchema.isValid(url.value).then((valid) => {
      if (!valid) {
        watchedState.form.state = 'invalid';
        return;
      }
      watchedState.form.state = 'valid';
      watchedState.form.state = 'sent';
      loadFeed(url.value, watchedState);
    });
  });

  url.addEventListener('focus', () => {
    watchedState.form.state = 'editing';
  });

  const exampleURL = document.querySelector('a#exampleURL');
  exampleURL.addEventListener('click', (e) => {
    e.preventDefault();
    watchedState.form.url = exampleURL.textContent;
    watchedState.form.state = 'editing';
  });

  document.addEventListener('shown.bs.modal', () => {
    watchedState.pause = true;
  });

  document.addEventListener('hidden.bs.modal', () => {
    watchedState.pause = false;
  });
};

export default () => {
  const state = {
    urls: [],
    feeds: [],
    posts: [],
    form: {
      url: null,
      state: 'empty',
    },
    pause: null,
    lng: null,
  };

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
      fallbackLng: 'en',
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
      app(state, i18nInstance);
    })
    // eslint-disable-next-line no-console
    .catch((err) => console.error(`Failed loading i18next translations: ${err}`));
};
