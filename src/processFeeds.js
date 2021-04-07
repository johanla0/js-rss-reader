/* eslint-disable no-param-reassign */
import _ from 'lodash';
import hash from './getHash.js';
import getData from './getData.js';
import parseRss from './parseRss.js';

const getFeed = (url) => getData(url)
  .then((response) => parseRss(response))
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error(error);
  });

const loadFeed = (url, watchedState) => {
  getFeed(url).then((result) => {
    const { feed, posts } = result;
    if (feed !== undefined) {
      watchedState.feeds.push(feed);
      watchedState.posts.push(...posts);
      watchedState.form.state = 'success';
      watchedState.form.url = '';
      watchedState.form.state = 'empty';
    } else {
      watchedState.form.state = 'invalid';
      watchedState.form.url = '';
    }
  });
};

const updateFeeds = (watchedState, refreshTimeout) => {
  const { urls } = watchedState;
  watchedState.timeoutId = setTimeout(
    () => updateFeeds(watchedState, refreshTimeout),
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
        const savedPosts = watchedState.posts.filter(
          (elem) => elem.feedId === feedId,
        );
        const newPosts = _.differenceWith(posts, savedPosts, _.isEqual);
        watchedState.posts.unshift(...newPosts);
        watchedState.form.state = 'success';
        watchedState.form.state = 'empty';
      })
      // eslint-disable-next-line no-console
      .catch((error) => console.error(error));
  }
};

export { loadFeed, updateFeeds };
