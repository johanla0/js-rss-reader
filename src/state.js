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
};

// Description:
// feeds: {title, desctiption, id}
// posts: {title, desctiption, id, feedId}
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

const watchedState = onChange(state, () => {
  render(state);
});

export { watchedState, state };
