import i18next from 'i18next';
import onChange from 'on-change';
import render from './render.js';

const state = {
  urls: [],
  feeds: [],
  posts: [],
  feedId: 0,
  postId: 0,
  errors: [],
  isValid: '',
  url: '',
  state: '',
  lng: '',
};

// Description:
// feeds: {title, description, id, link}
// posts: {title, description, id, feedId, link, pubDate}
// state.state corresponds to the FSM state:
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

const watchedState = onChange(state, (path) => {
  if (path === 'lng') {
    i18next.changeLanguage(state.lng);
  }
  render(state);
});

export { watchedState, state };
