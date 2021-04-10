import '../node_modules/bootstrap/dist/js/bootstrap.bundle.js';
import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import onChange from 'on-change';
import * as yup from 'yup';
import en from './locales/en.yml';
import ru from './locales/ru.yml';
import {
  renderForm, renderContent, renderTranslations,
} from './render.js';
import { loadFeed, updateFeeds } from './processFeeds.js';

const app = (state, i18nInstance) => {
  const watchedState = onChange(state, (path) => {
    if (path === 'lng') {
      i18nInstance.changeLanguage(state.lng);
      renderTranslations(i18nInstance);
    }
    if (path.includes('form')) {
      renderForm(state);
      renderTranslations(i18nInstance);
    }
    if (path === 'request.state') {
      renderForm(state);
      renderContent(state);
      renderTranslations(i18nInstance);
    }
  });
  const initLanguageDropdown = () => {
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
  };
  initLanguageDropdown();
  renderForm(state);

  const fillInputWithURL = () => {
    const exampleURL = document.querySelector('a#exampleURL');
    exampleURL.addEventListener('click', (e) => {
      e.preventDefault();
      watchedState.form.url = exampleURL.textContent;
    });
  };
  fillInputWithURL();

  const form = document.querySelector('.rss-form');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const formData = new FormData(this);
    const url = formData.get('url');
    const urlSchema = yup.string().required().url().notOneOf(state.urls);
    urlSchema.isValid(url).then((valid) => {
      watchedState.form.url = url;
      if (!valid) {
        watchedState.form.state = 'invalid';
        return;
      }
      watchedState.urls.push(url);
      watchedState.form.state = 'valid';
      watchedState.request.state = 'sent';
      loadFeed(url, watchedState);
    });
  });

  const refreshTimeout = 5000;
  updateFeeds(watchedState, refreshTimeout);
};

export default () => {
  const state = {
    urls: [],
    feeds: [],
    posts: [],
    form: {
      url: '',
      state: 'empty',
      error: null,
    },
    modal: {
      state: 'hidden',
      postId: null,
    },
    ui: {
      openedPosts: [],
    },
    request: {
      state: 'idle',
      error: null,
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
