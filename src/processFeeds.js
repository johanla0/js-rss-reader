/* eslint-disable no-param-reassign */
import _ from 'lodash';
import hash from './getHash.js';
import getRawData from './getRawData.js';
import parseRss from './parseRss.js';

const getFeed = (url) => getRawData(url)
  .then((response) => {
    const { feed, posts } = parseRss(response);
    const feedId = hash(feed.link);
    feed.id = feedId;
    posts.forEach((post) => {
      post.feedId = feedId;
    });
    return { feed, posts };
  })
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
  const timeoutId = setTimeout(
    () => updateFeeds(watchedState, refreshTimeout),
    refreshTimeout,
  );
  const { urls } = watchedState;
  if (urls.length === 0) {
    return timeoutId;
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
        if (newPosts.length > 0) {
          watchedState.form.state = 'updated';
          watchedState.posts.unshift(...newPosts);
        }
        return timeoutId;
      })
      // eslint-disable-next-line no-console
      .catch((error) => console.error(error));
  }
};

export { loadFeed, updateFeeds };
