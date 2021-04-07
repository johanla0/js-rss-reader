/* eslint-disable no-param-reassign */
import * as yup from 'yup';
import { loadFeed, updateFeeds } from './processFeeds.js';

const urlSchema = yup.string().required().url();

export default (watchedState) => {
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

  const refreshTimeout = 5000;
  updateFeeds(watchedState, refreshTimeout);
};
