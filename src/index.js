import * as yup from 'yup';
import i18next from 'i18next';
import { loadFeed, updateFeeds } from './processFeeds.js';
import { watchedState, state } from './watcher.js';

const urlSchema = yup.string().required().url();

export default () => {
  watchedState.lng = i18next.language?.slice(0, 2);
  const languages = document.querySelectorAll(
    '#languageSelector .dropdown-item',
  );
  languages.forEach((language) => {
    language.addEventListener('click', (e) => {
      e.preventDefault();
      watchedState.lng = language.dataset.lng;
    });
  });

  window.addEventListener('load', () => {
    watchedState.form.state = 'empty';
  });

  const form = document.querySelector('.rss-form');
  const url = document.querySelector('input[name="url"]');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (state.urls.includes(url.value)) {
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
      loadFeed(url.value);
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
  watchedState.timeoutId = setTimeout(
    () => updateFeeds(state, refreshTimeout),
    refreshTimeout,
  );
};
