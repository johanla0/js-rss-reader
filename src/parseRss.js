import hash from './getHash.js';

export default (xmlString) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, 'application/xml');
  const title = doc.querySelector('channel title').textContent;
  const description = doc.querySelector('channel title ~ description')
    .textContent;
  const link = doc.querySelector('channel title ~ link').textContent;
  const feedId = hash(link);
  const feed = {
    title,
    description,
    link,
    id: feedId,
  };
  const items = Array.from(doc.querySelectorAll('item'));
  const posts = items.map((item) => ({
    title: item.querySelector('title').textContent,
    description: item.querySelector('description').textContent,
    link: item.querySelector('link').textContent,
    guid: item.querySelector('guid').textContent,
    pubDate: item.querySelector('pubDate').textContent,
    feedId,
  }));
  return { feed, posts };
};
