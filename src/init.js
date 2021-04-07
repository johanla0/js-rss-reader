import '../node_modules/bootstrap/dist/js/bootstrap.bundle.js';
import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import onChange from 'on-change';
import * as yup from 'yup';
import en from './locales/en.yml';
import ru from './locales/ru.yml';
import {
  renderForm, renderContent, renderProcessWarning, renderTranslations,
} from './render.js';
import { loadFeed, updateFeeds } from './processFeeds.js';

const app = (state, i18nInstance) => {
  const watchedState = onChange(state, (path) => {
    if (path === 'lng') {
      i18nInstance.changeLanguage(state.lng);
      renderTranslations(i18nInstance);
    }
    if (path === 'form.state') {
      renderForm(state);
      renderTranslations(i18nInstance);
    }
    if (path === 'content.state') {
      renderContent(state);
      renderTranslations(i18nInstance);
    }
    if (path === 'process.state') {
      renderForm(state);
      renderProcessWarning(state);
      renderTranslations(i18nInstance);
    }
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
    const urlSchema = yup.string().required().url().notOneOf(state.urls);
    urlSchema.isValid(url.value).then((valid) => {
      watchedState.form.url = url.value;
      if (!valid) {
        watchedState.form.state = 'invalid';
        return;
      }
      watchedState.urls.push(url.value);
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

  const refreshTimeout = 5000;
  updateFeeds(watchedState, refreshTimeout);
};

export default () => {
  const state = {
    urls: [],
    feeds: [],
    posts: [],
    newPosts: [],
    form: {
      url: null,
      state: 'empty',
    },
    content: {
      state: 'idle',
    },
    process: {
      state: 'idle',
    },
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
