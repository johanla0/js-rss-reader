/* eslint-disable no-param-reassign */
import * as yup from 'yup';
import i18next from 'i18next';
import getFeed from './getFeed.js';
import parseRss from './parseRss.js';
import { watchedState, state } from './watcher.js';

const urlSchema = yup.string().required().url();

export default () => {
  watchedState.lng = i18next.language.slice(0, 2);
  const form = document.querySelector('.rss-form');
  const url = document.querySelector('input[name="url"]');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (state.urls.includes(url.value)) {
      watchedState.state = 'invalid';
      watchedState.errors.push(`duplicate: ${url.value}`);
      return;
    }
    watchedState.url = url.value;
    watchedState.urls.push(url.value);
    urlSchema.isValid(url.value).then((valid) => {
      watchedState.isValid = valid;
      if (!valid) {
        watchedState.state = 'invalid';
        return;
      }
      watchedState.state = 'valid';
      watchedState.state = 'sent';
      getFeed(url.value)
        .then((response) => {
          const { feed, posts } = parseRss(response);
          state.feedId += 1;
          feed.id = state.feedId;
          posts.forEach((post) => {
            state.postId += 1;
            post.feedId = state.feedId;
            post.id = state.postId;
          });
          watchedState.feeds.push(feed);
          watchedState.posts.push(...posts);
          watchedState.state = 'success';
          watchedState.url = '';
          watchedState.state = 'empty';
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error);
          watchedState.state = 'invalid';
          watchedState.url = '';
        });
    });
  });

  url.addEventListener('focus', () => {
    watchedState.isValid = '';
    watchedState.state = 'editing';
  });

  const exampleURL = document.querySelector('a#exampleURL');
  exampleURL.addEventListener('click', (e) => {
    e.preventDefault();
    watchedState.url = exampleURL.textContent;
    watchedState.state = 'editing';
  });

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
    watchedState.state = 'empty';
  });
};
