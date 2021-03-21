/* eslint-disable import/extensions */
/* eslint-disable no-param-reassign */
import './scss/style.scss';
import * as yup from 'yup';
import onChange from 'on-change';
import getFeed from './getFeed.js';
import parseRss from './parseRss.js';

const urlSchema = yup.string().required().url();

const render = (state) => {
  const url = document.querySelector('input[name="url"]');
  const fieldset = document.querySelector('fieldset');
  const feedsList = document.querySelector('.feeds ul');
  const postsList = document.querySelector('.posts ul');
  const sectionContent = document.querySelector('section.content');
  switch (state.state) {
    case 'empty':
      url.value = '';
      fieldset.disabled = false;
      break;
    case 'editing':
      break;
    case 'invalid':
      fieldset.disabled = false;
      url.classList.remove('is-valid');
      url.classList.add('is-invalid');
      break;
    case 'valid':
      url.classList.remove('is-invalid');
      url.classList.add('is-valid');
      break;
    case 'sent':
      fieldset.disabled = true;
      break;
    case 'success':
      feedsList.textContent = '';
      state.feeds.forEach((feed) => {
        const li = document.createElement('li');
        const h3 = document.createElement('h3');
        const p = document.createElement('p');
        const a = document.createElement('a');
        li.dataset.feedId = feed.id;
        h3.textContent = feed.title;
        a.textContent = feed.description;
        a.href = feed.link;
        a.classList.add('stretched-link');
        p.append(a);
        li.append(h3);
        li.append(p);
        li.classList.add('list-group-item', 'position-relative');
        feedsList.append(li);
      });
      postsList.textContent = '';
      state.posts.forEach((post) => {
        const li = document.createElement('li');
        const h4 = document.createElement('h4');
        const p = document.createElement('p');
        const a = document.createElement('a');
        li.dataset.id = post.id;
        li.dataset.feedId = post.feedId;
        a.textContent = post.title;
        a.href = post.link;
        a.classList.add('font-weight-bold');
        a.dataset.id = post.id;
        a.dataset.feedId = post.feedId;
        a.target = '_blank';
        a.rel = 'noopener noreferer';
        p.textContent = post.description;
        h4.append(a);
        li.append(h4);
        li.append(p);
        li.classList.add('list-group-item', 'position-relative');
        postsList.append(li);
        // button 'btn btn-primary btn-sm' data-id: '',
        // data-toggle: 'modal', data-target="#modal" type="button"
      });
      sectionContent.classList.remove('d-none');
      break;
    default:
      break;
  }
  url.value = state.url;
};

const state = {
  urls: [],
  feeds: [],
  posts: [],
  feedId: 0,
  postId: 0,
  errors: [],
  isValid: '',
  url: '',
  state: 'empty',
};

// Description:
// feeds: {title, desctiption, id}
// posts: {title, desctiption, id, feedId}
// state.state corresponds to the FSM state:
// empty ->
//   editing ->
//     valid ->
//       sent ->
//         success -> empty
//         invalid
//     invalid -> editing

const watchedState = onChange(state, () => {
  render(state);
});

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
