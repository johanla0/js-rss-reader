import './scss/style.scss';
import * as yup from 'yup';

const urlSchema = yup.string().required().url();

const form = document.querySelector('.rss-form');
const url = document.querySelector('input[name="url"]');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  urlSchema.isValid(url.value)
    .then((valid) => {
      if (!valid) {
        url.classList.add('is-invalid');
      } else {
        url.classList.remove('is-invalid');
        url.classList.add('is-valid');
      }
    });
});

const example = document.querySelector('a#example');
example.addEventListener('click', (e) => {
  e.preventDefault();
  url.value = example.textContent;
});
