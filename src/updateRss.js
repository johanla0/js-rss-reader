/* eslint-disable no-param-reassign */
import getFeed from './getFeed.js';
import parseRss from './parseRss.js';
import { watchedState } from './watcher.js';

export default (state) => {
  const { urls } = state;
  for (let i = 1; i <= state.feedId; i += 1) {
    getFeed(urls[i].value)
      .then((response) => {
        const { posts } = parseRss(response);
        const savedPosts = state.posts.filter((elem) => elem.feedId === i);
        const newPosts = [...posts].filter((x) => !savedPosts.includes(x));
        newPosts.forEach((post) => {
          state.postId += 1;
          post.feedId = i;
          post.id = state.postId;
        });
        watchedState.posts.push(...posts);
      })
      .catch((error) => console.error(error));
  }
};
