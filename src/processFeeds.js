/* eslint-disable no-param-reassign */
import _ from 'lodash';
import getRawData from './getRawData.js';
import parseRss from './parseRss.js';

const getFeed = (url) => getRawData(url)
  .then((response) => {
    const { feed, posts } = parseRss(response);
    posts.forEach((post) => {
      post.feedLink = feed.link;
    });
    return { feed, posts };
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error(error);
  });

const loadFeed = (url, watchedState) => {
  watchedState.request.state = 'idle';
  getFeed(url).then((result) => {
    const { feed, posts } = result;
    if (feed !== undefined) {
      watchedState.feeds.push(feed);
      watchedState.posts.push(...posts.reverse());
      watchedState.request.state = 'success';
      watchedState.form.url = '';
      watchedState.request.state = 'idle';
      watchedState.form.state = 'empty';
    } else {
      watchedState.form.state = 'invalid';
      watchedState.form.state = 'empty';
    }
  })
    .catch(() => {
      watchedState.urls.pop();
      watchedState.form.state = 'invalid';
      watchedState.form.state = 'empty';
      watchedState.request.error = 'no_rss';
      watchedState.request.state = 'error';
      watchedState.request.state = 'idle';
    });
};

const updateFeeds = (watchedState, refreshTimeout) => {
  setTimeout(
    () => updateFeeds(watchedState, refreshTimeout),
    refreshTimeout,
  );
  const { urls } = watchedState;
  if (urls.length === 0) {
    return;
  }
  for (let i = 0; i < urls.length; i += 1) {
    getFeed(urls[i])
      .then((result) => {
        const { feed, posts } = result;
        const savedPosts = watchedState.posts.filter(
          (elem) => elem.feedLink === feed.link,
        );
        const newPosts = _.differenceWith(posts, savedPosts, _.isEqual).reverse();
        if (newPosts.length === 0) {
          return;
        }
        watchedState.posts.push(...newPosts);
        watchedState.request.state = 'success';
        watchedState.request.state = 'idle';
      });
  }
};

export { loadFeed, updateFeeds };
