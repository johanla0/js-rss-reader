import i18next from 'i18next';
import onChange from 'on-change';
import render from './render.js';

const state = {
  urls: [],
  feeds: [],
  posts: [],
  url: '',
  state: '',
  timeoutId: '',
};

// Description:
// feeds: {title, description, link, id}
// posts: {title, description, link, feedId, guid, pubDate}
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
