/* eslint-disable no-unused-vars */
import axios from 'axios';

const getDataWithAxios = (url) => axios.get(url).then((response) => response.data);

const getDataWithFetch = (url) => fetch(
  `https://hexlet-allorigins.herokuapp.com/raw?disableCache=true&url=${url}`,
)
  .then((response) => {
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/rss+xml')) {
      throw new TypeError('No RSS found');
    }
    return response.text();
  })
  .then((response) => response);

export { getDataWithFetch as default, getDataWithAxios };
