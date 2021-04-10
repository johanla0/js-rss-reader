/* eslint-disable no-param-reassign */
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

const renderModal = (state) => {
  const modalTitle = document.querySelector('.modal-title');
  const p = document.querySelector('.modal-body p');
  const buttonOpenLink = document.querySelector('.button_openLink');
  switch (state.modal.state) {
    case 'hidden':
      break;
    case 'shown':
      const post = state.posts.filter((elem) => (elem.guid === state.modal.postId))[0];
      modalTitle.textContent = post.title;
      p.textContent = post.description;
      buttonOpenLink.href = post.link;
      break;
    default:
      break;
  }
};

const renderFeeds = (state) => {
  const feedsList = document.querySelector('.feeds ul');
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
};

const renderPostsState = (state) => {
  const postsLinks = document.querySelectorAll('.posts li a');
  postsLinks.forEach((link) => {
    if (state.ui.openedPosts.includes(link.dataset.id)) {
      link.classList.add('fw-normal');
      link.classList.remove('fw-bold');
    }
  });
};

const renderPosts = (state) => {
  const postsList = document.querySelector('.posts ul');
  postsList.textContent = '';
  state.posts.forEach((post) => {
    const a = document.createElement('a');
    if (state.ui.openedPosts.includes(post.guid)) {
      a.classList.add('fw-normal');
    } else {
      a.classList.add('fw-bold');
    }
    a.textContent = post.title;
    a.href = post.link;
    a.dataset.feedId = post.feedId;
    const postId = post.guid;
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
    buttonPreview.dataset.bsTarget = '#modalPreview';
    const li = document.createElement('li');
    li.dataset.feedId = post.feedId;
    li.append(h5);
    li.append(buttonPreview);
    li.classList.add('list-group-item', 'position-relative');
    postsList.prepend(li);
    buttonPreview.addEventListener('click', (e) => {
      e.preventDefault();
      state.modal.postId = postId;
      state.modal.state = 'shown';
      state.ui.openedPosts.push(postId);
      renderModal(state);
      renderPostsState(state);
    });
  });
};

const renderForm = (state) => {
  const url = document.querySelector('input[name="url"]');
  switch (state.form.state) {
    case 'empty':
      url.value = '';
      setTimeout(() => {
        url.classList.remove('is-valid');
      }, 1000);
      setTimeout(() => {
        url.classList.remove('is-invalid');
      }, 2000);
      break;
    case 'invalid':
      url.classList.remove('is-valid');
      url.classList.add('is-invalid');
      break;
    case 'valid':
      url.classList.remove('is-invalid');
      url.classList.add('is-valid');
      break;
    default:
      break;
  }
  url.value = state.form.url;
};

const renderAlert = (state) => {
  const alert = document.querySelector('header .alert');
  if (state.request.error === null) {
    alert.classList.remove('show');
  } else {
    alert.classList.remove('d-none');
    alert.classList.add('show', state.request.error);
  }
};

const renderContent = (state) => {
  const sectionContent = document.querySelector('section.content');
  const fieldset = document.querySelector('fieldset');
  switch (state.request.state) {
    case 'sent':
      fieldset.disabled = true;
      showSpinner();
      break;
    case 'success':
      sectionContent.classList.remove('d-none');
      fieldset.disabled = false;
      removeSpinner();
      renderFeeds(state);
      renderPosts(state);
      break;
    case 'error':
      fieldset.disabled = false;
      removeSpinner();
      renderAlert(state);
      break;
    default:
      break;
  }
};

export {
  renderForm, renderContent, renderTranslations,
};
