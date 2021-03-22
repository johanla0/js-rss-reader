/* eslint-disable import/extensions */
/* eslint-disable no-param-reassign */
import './scss/style.scss';
import * as yup from 'yup';
import getFeed from './getFeed.js';
import parseRss from './parseRss.js';
import { watchedState, state } from './state.js';

const urlSchema = yup.string().required().url();

export default () => {
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
    urlSchema.isValid(url.value)
      .then((valid) => {
        watchedState.isValid = valid;
        if (valid) {
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
              console.error(error);
              watchedState.state = 'invalid';
              watchedState.url = '';
            });
        } else {
          watchedState.state = 'invalid';
        }
      });
  });

  url.addEventListener('focus', () => {
    watchedState.isValid = '';
    watchedState.state = 'editing';
  });

  const example = document.querySelector('a#example');
  example.addEventListener('click', (e) => {
    e.preventDefault();
    watchedState.url = example.textContent;
    watchedState.state = 'editing';
  });
};
