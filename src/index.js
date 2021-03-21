import './scss/style.scss';
import * as yup from 'yup';
import onChange from 'on-change';
import axios from 'axios';

const urlSchema = yup.string().required().url();

const render = (state) => {
  const url = document.querySelector('input[name="url"]');
  const fieldset = document.querySelector('fieldset');
  console.log(state.state);
  switch (state.state) {
    case 'empty':
      url.value = '';
      fieldset.disabled = false;
      break;
    case 'editing':
      break;
    case 'invalid':
      fieldset.disabled = false;
      url.classList.remove('is-valid');
      url.classList.add('is-invalid');
      break;
    case 'valid':
      url.classList.remove('is-invalid');
      url.classList.add('is-valid');
      break;
    case 'sent':
      fieldset.disabled = true;
      break;
    default:
      break;
  }
  url.value = state.url;
};

const state = {
  feeds: [],
  posts: [],
  errors: [],
  isValid: '',
  url: '',
  state: 'empty',
};

// 'state' corresponds to the FSM state:
// empty -> editing -> (valid -> sent -> empty) / (invalid -> filling)

const watchedState = onChange(state, (path, value, previousValue, name) => {
  const temp = {
    path,
    value,
    previousValue,
    name,
  };
  console.log(temp);
  render(state);
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
        if (valid) {
          watchedState.state = 'valid';
          watchedState.state = 'sent';
          axios
            .get(watchedState.url)
            .then((response) => {
              console.log(response);
              watchedState.state = 'empty';
            })
            .catch((error) => {
              console.log(error);
              watchedState.state = 'invalid';
            });
        } else {
          watchedState.state = 'invalid';
        }
      });
  });

  url.addEventListener('focus', () => {
    watchedState.isValid = '';
    watchedState.state = 'editing';
  });

  const example = document.querySelector('a#example');
  example.addEventListener('click', (e) => {
    e.preventDefault();
    watchedState.url = example.textContent;
    watchedState.state = 'editing';
  });
};
