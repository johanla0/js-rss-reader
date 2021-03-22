export default (state) => {
  const url = document.querySelector('input[name="url"]');
  const fieldset = document.querySelector('fieldset');
  const feedsList = document.querySelector('.feeds ul');
  const postsList = document.querySelector('.posts ul');
  const sectionContent = document.querySelector('section.content');
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
    case 'success':
      feedsList.textContent = '';
      state.feeds.forEach((feed) => {
        const li = document.createElement('li');
        const h3 = document.createElement('h3');
        const p = document.createElement('p');
        const a = document.createElement('a');
        li.dataset.feedId = feed.id;
        h3.textContent = feed.title;
        a.textContent = feed.description;
        a.href = feed.link;
        a.classList.add('stretched-link');
        p.append(a);
        li.append(h3);
        li.append(p);
        li.classList.add('list-group-item', 'position-relative');
        feedsList.append(li);
      });
      postsList.textContent = '';
      state.posts.forEach((post) => {
        const li = document.createElement('li');
        const h4 = document.createElement('h4');
        const p = document.createElement('p');
        const a = document.createElement('a');
        li.dataset.id = post.id;
        li.dataset.feedId = post.feedId;
        a.textContent = post.title;
        a.href = post.link;
        a.classList.add('font-weight-bold');
        a.dataset.id = post.id;
        a.dataset.feedId = post.feedId;
        a.target = '_blank';
        a.rel = 'noopener noreferer';
        p.textContent = post.description;
        h4.append(a);
        li.append(h4);
        li.append(p);
        li.classList.add('list-group-item', 'position-relative');
        postsList.append(li);
        // button 'btn btn-primary btn-sm' data-id: '',
        // data-toggle: 'modal', data-target="#modal" type="button"
      });
      sectionContent.classList.remove('d-none');
      break;
    default:
      break;
  }
  url.value = state.url;
};
