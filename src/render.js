/* eslint-disable no-param-reassign */
import _ from 'lodash';

const showSpinner = () => {
  document.querySelector('#loadingSpinner').classList.remove('d-none');
  document.querySelector('#loadingSpinner').classList.add('d-block');
};

const removeSpinner = () => {
  document.querySelector('#loadingSpinner').classList.add('d-none');
  document.querySelector('#loadingSpinner').classList.remove('d-block');
};

const renderTranslations = (i18nInstance) => {
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
  const alerts = ['no_rss'];
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
  alerts.forEach((alert) => {
    const elements = document.querySelectorAll(`.${alert} p`);
    elements.forEach((elem) => {
      if (elem !== undefined) {
        elem.textContent = i18nInstance.t(`alerts.${alert}`);
      }
    });
  });
  document.querySelector('#languageSwitchButton').textContent = language[i18nInstance.language.slice(0, 2)];
};

const renderContent = (state) => {
  const addPosts = (posts, destinatedElement) => {
    posts.forEach((post) => {
      const a = document.createElement('a');
      a.classList.add('fw-bold');
      a.textContent = post.title;
      a.href = post.link;
      a.dataset.feedId = post.feedId;
      const postId = _.uniqueId();
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
      destinatedElement.prepend(li);
      modal.addEventListener('shown.bs.modal', () => {
        a.classList.remove('fw-bold');
        a.classList.add('fw-normal');
      });
    });
  };
  const sectionContent = document.querySelector('section.content');
  sectionContent.classList.remove('d-none');
  const feedsList = document.querySelector('.feeds ul');
  const postsList = document.querySelector('.posts ul');
  switch (state.content.state) {
    case 'loaded':
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
        feedsList.prepend(li);
      });
      postsList.textContent = '';
      addPosts(state.posts, postsList);
      break;
    case 'updated':
      addPosts(state.newPosts, postsList);
      break;
    default:
      break;
  }
};

const renderForm = (state) => {
  const url = document.querySelector('input[name="url"]');
  const fieldset = document.querySelector('fieldset');
  switch (state.form.state) {
    case 'empty':
      url.value = '';
      fieldset.disabled = false;
      setTimeout(() => {
        url.classList.remove('is-valid');
      }, 1000);
      break;
    case 'editing':
      setTimeout(() => {
        url.classList.remove('is-invalid');
      }, 2000);
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
      showSpinner();
      break;
    case 'success':
      removeSpinner();
      renderContent(state);
      break;
    default:
      break;
  }
  url.value = state.form.url;
};

const renderProcessWarning = (state) => {
  const alert = document.createElement('div');
  const p = document.createElement('p');
  const buttonCloseCross = document.createElement('button');
  switch (state.process.state) {
    case 'invalid':
      removeSpinner();
      alert.classList.add('alert', 'alert-warning', 'alert-dismissible', 'fade', 'show', 'no_rss', 'col-10', 'mx-auto');
      alert.role = 'alert';
      p.classList.add('m-0', 'p-0');
      alert.append(p);
      buttonCloseCross.type = 'button';
      buttonCloseCross.classList.add('btn-close');
      buttonCloseCross.dataset.bsDismiss = 'alert';
      buttonCloseCross.ariaLabel = 'Close';
      alert.append(buttonCloseCross);
      document.querySelector('header').prepend(alert);
      break;
    default:
      alert.classList.remove('show');
      break;
  }
};

export {
  renderForm, renderContent, renderProcessWarning, renderTranslations,
};
