/* eslint-disable no-param-reassign */
import hash from './getHash.js';

const updateTranslations = (i18nInstance) => {
  const fields = [
    'title',
    'subtitle',
    'valid-tooltip',
    'invalid-tooltip',
    'example',
    'feeds',
    'posts',
  ];
  const placeholders = ['inputURL'];
  const buttonsList = [
    'button_add',
    'button_preview',
    'button_close',
    'button_openLink',
  ];
  const language = {
    en: 'English',
    ru: 'Русский',
  };
  fields.forEach((field) => {
    const elem = document.querySelector(`#${field}`);
    if (elem !== undefined) {
      elem.textContent = i18nInstance.t(`${field}`);
    }
  });
  placeholders.forEach((placeholder) => {
    const elements = document.querySelectorAll(`.${placeholder}`);
    elements.forEach((elem) => {
      elem.placeholder = i18nInstance.t(`placeholders.${placeholder}`);
    });
  });
  buttonsList.forEach((button) => {
    const elements = document.querySelectorAll(`.${button}`);
    elements.forEach((elem) => {
      if (elem !== undefined) {
        elem.textContent = i18nInstance.t(`buttons.${button}`);
      }
    });
  });
  document.querySelector('#languageSwitchButton').textContent = language[i18nInstance.language.slice(0, 2)];
};

export default (state, i18nInstance) => {
  updateTranslations(i18nInstance);
  const url = document.querySelector('input[name="url"]');
  const fieldset = document.querySelector('fieldset');
  const feedsList = document.querySelector('.feeds ul');
  const postsList = document.querySelector('.posts ul');
  const sectionContent = document.querySelector('section.content');
  switch (state.form.state) {
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
    case 'success':
      feedsList.textContent = '';
      state.feeds.forEach((feed) => {
        const a = document.createElement('a');
        a.textContent = feed.description;
        a.href = feed.link;
        a.classList.add('stretched-link');
        const p = document.createElement('p');
        p.append(a);
        const h3 = document.createElement('h3');
        h3.textContent = feed.title;
        const li = document.createElement('li');
        li.dataset.feedId = feed.id;
        li.append(h3);
        li.append(p);
        li.classList.add('list-group-item', 'position-relative');
        feedsList.append(li);
      });
      postsList.textContent = '';
      state.posts.forEach((post) => {
        const a = document.createElement('a');
        a.classList.add('fw-bold');
        a.textContent = post.title;
        a.href = post.link;
        a.dataset.feedId = post.feedId;
        const postId = hash(post.guid);
        a.dataset.id = postId;
        a.target = '_blank';
        a.rel = 'noopener noreferer';
        const h5 = document.createElement('h5');
        h5.append(a);
        const buttonPreview = document.createElement('button');
        buttonPreview.classList.add(
          'btn',
          'btn-primary',
          'btn-sm',
          'button_preview',
        );
        buttonPreview.type = 'button';
        buttonPreview.dataset.id = postId;
        buttonPreview.dataset.bsToggle = 'modal';
        buttonPreview.dataset.bsTarget = `#modal_${postId}`;
        const modalTitle = document.createElement('h5');
        modalTitle.classList.add('modal-title');
        modalTitle.id = `modal_${postId}_label`;
        modalTitle.textContent = post.title;
        const buttonCloseCross = document.createElement('button');
        buttonCloseCross.classList.add('btn-close');
        buttonCloseCross.dataset.bsDismiss = 'modal';
        const modalHeader = document.createElement('div');
        modalHeader.classList.add('modal-header');
        modalHeader.append(modalTitle);
        modalHeader.append(buttonCloseCross);
        const p = document.createElement('p');
        p.textContent = post.description;
        const modalBody = document.createElement('div');
        modalBody.classList.add('modal-body');
        modalBody.append(p);
        const buttonOpenLink = document.createElement('a');
        buttonOpenLink.classList.add('btn', 'btn-primary', 'button_openLink');
        buttonOpenLink.href = post.link;
        buttonOpenLink.target = '_blank';
        buttonOpenLink.rel = 'noopener noreferer';
        const buttonClose = document.createElement('button');
        buttonClose.classList.add('btn', 'btn-secondary', 'button_close');
        buttonClose.dataset.bsDismiss = 'modal';
        const modalFooter = document.createElement('div');
        modalFooter.classList.add('modal-footer');
        modalFooter.append(buttonOpenLink);
        modalFooter.append(buttonClose);
        const modalContent = document.createElement('div');
        modalContent.classList.add('modal-content');
        modalContent.append(modalHeader);
        modalContent.append(modalBody);
        modalContent.append(modalFooter);
        const modalDialog = document.createElement('div');
        modalDialog.classList.add(
          'modal-dialog',
          'modal-dialog-centered',
          'modal-dialog-scrollable',
        );
        modalDialog.append(modalContent);
        const modal = document.createElement('div');
        modal.classList.add('modal', 'fade');
        modal.id = `modal_${postId}`;
        modal.tabindex = '-1';
        modal.ariaLabelledby = `modal_${postId}_label`;
        modal.ariaHidden = 'true';
        modal.append(modalDialog);
        const li = document.createElement('li');
        li.dataset.feedId = post.feedId;
        li.append(h5);
        li.append(buttonPreview);
        li.append(modal);
        li.classList.add('list-group-item', 'position-relative');
        postsList.append(li);
        modal.addEventListener('shown.bs.modal', () => {
          clearTimeout(state.timeoutId);
          a.classList.remove('fw-bold');
          a.classList.add('fw-normal');
        });
      });
      sectionContent.classList.remove('d-none');
      break;
    default:
      break;
  }
  url.value = state.form.url;
};
