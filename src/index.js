import './scss/style.scss';
import * as yup from 'yup';

const render = (state, e) => {
  const url = document.querySelector('input[name="url"]');
  if (e.type === 'submit') {
    if (state.isValid) {
      url.classList.remove('is-invalid');
      url.classList.add('is-valid');
    } else {
      url.classList.remove('is-valid');
      url.classList.add('is-invalid');
    }
  }
  url.value = state.url;
};

const urlSchema = yup.string().required().url();

export default () => {
  const state = {
    feeds: [],
    posts: [],
    errors: [],
    isValid: true,
    url: '',
  };
  const form = document.querySelector('.rss-form');
  const url = document.querySelector('input[name="url"]');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    state.url = url.value;
    urlSchema.isValid(url.value)
      .then((valid) => {
        state.isValid = valid;
        render(state, e);
      });
  });

  const example = document.querySelector('a#example');
  example.addEventListener('click', (e) => {
    e.preventDefault();
    state.url = example.textContent;
    render(state, e);
  });
};
