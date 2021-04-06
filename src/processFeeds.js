/* eslint-disable no-param-reassign */
import _ from 'lodash';
import hash from './getHash.js';
import { watchedState } from './watcher.js';
import getData from './getData.js';
import parseRss from './parseRss.js';

const getFeed = (url) => getData(url)
  .then((response) => parseRss(response))
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error(error);
  });

const loadFeed = (url) => {
  getFeed(url)
    .then((result) => {
      const { feed, posts } = result;
      if (feed !== undefined) {
        watchedState.feeds.push(feed);
        watchedState.posts.push(...posts);
        watchedState.state = 'success';
        watchedState.url = '';
        watchedState.state = 'empty';
      } else {
        watchedState.state = 'invalid';
        watchedState.url = '';
      }
    });
};

const updateFeeds = (state, refreshTimeout) => {
  const { urls } = state;
  watchedState.timeoutId = setTimeout(
    () => updateFeeds(state, refreshTimeout),
    refreshTimeout,
  );
  if (urls.length === 0) {
    return;
  }
  for (let i = 0; i < urls.length; i += 1) {
    getFeed(urls[i])
      .then((result) => {
        const { feed, posts } = result;
        const feedId = hash(feed.link);
        const savedPosts = state.posts.filter((elem) => elem.feedId === feedId);
        const newPosts = _.differenceWith(posts, savedPosts, _.isEqual);
        watchedState.posts.unshift(...newPosts);
        watchedState.state = 'success';
        watchedState.state = 'empty';
      })
      // eslint-disable-next-line no-console
      .catch((error) => console.error(error));
  }
};

export { loadFeed, updateFeeds };
