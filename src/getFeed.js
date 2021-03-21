import axios from 'axios';

const getFeedWithAxios = (url) => axios.get(url)
  .then((response) => response.data);

const getFeedWithFetch = (url) => fetch(
  `https://hexlet-allorigins.herokuapp.com/raw?disableCache=true&url=${url}`,
)
  .then((response) => response.text())
  .then((response) => response);

export default getFeedWithFetch;
