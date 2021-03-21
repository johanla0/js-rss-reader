import './scss/style.scss';
import * as yup from 'yup';
import onChange from 'on-change';

const urlSchema = yup.string().required().url();

const render = (state, path) => {
  const url = document.querySelector('input[name="url"]');
  if (path === 'isValid') {
    if (state.isValid === true) {
      url.classList.remove('is-invalid');
      url.classList.add('is-valid');
    } else if (state.isValid === false) {
      url.classList.remove('is-valid');
      url.classList.add('is-invalid');
    } else {
      url.classList.remove('is-valid');
      url.classList.remove('is-invalid');
    }
  }
  url.value = state.url;
};

const state = {
  feeds: [],
  posts: [],
  errors: [],
  isValid: '',
  url: '',
};

const watchedState = onChange(state, (path, value, previousValue, name) => {
  const temp = {
    path,
    value,
    previousValue,
    name,
  };
  console.log(temp);
  render(state, path);
});

export default () => {
  const form = document.querySelector('.rss-form');
  const url = document.querySelector('input[name="url"]');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    watchedState.url = url.value;
    urlSchema.isValid(url.value)
      .then((valid) => {
        watchedState.isValid = valid;
      });
  });

  url.addEventListener('focus', () => {
    watchedState.isValid = '';
  });

  const example = document.querySelector('a#example');
  example.addEventListener('click', (e) => {
    e.preventDefault();
    watchedState.url = example.textContent;
  });
};
