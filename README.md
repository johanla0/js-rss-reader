# RSS Reader Class Project

[![Node.js CI](https://github.com/johanla0/frontend-project-lvl3/actions/workflows/node.js.yml/badge.svg)](https://github.com/johanla0/frontend-project-lvl3/actions/workflows/node.js.yml)
[![Actions Status](https://github.com/johanla0/frontend-project-lvl3/workflows/hexlet-check/badge.svg)](https://github.com/johanla0/frontend-project-lvl3/actions)
[![Maintainability](https://api.codeclimate.com/v1/badges/11f981ca3aa2078678d9/maintainability)](https://codeclimate.com/github/johanla0/frontend-project-lvl3/maintainability)

[Service is available here](https://frontend-project-lvl3-johanla0.vercel.app/)

## Web-service that helps to read RSS feeds

1. To start editing fork or clone this repository
  ```
  $ git clone https://github.com/johanla0/frontend-project-lvl3.git
  ```
2. Install dependencies
  ```
  $ make install
  ```

### State description

* feeds: [ { title, description, link }, ] // feeds

* posts: [ { title, description, link, guid, pubDate }, ] // posts

* urls: [] // urls added

* form: { url, state, error } // used to render form

* modal: { state, postId } // used to render form
  
* ui: { openedPosts: [], } // used to render content
  
* request: { state, error } // used to render request result

* lng // used to render language dropdown

#### Finite-state machine states:

*state.form.state*:

```
empty ->
  valid ->
    empty
  invalid ->
    valid
    empty
```

*state.modal.state*:

```
hidden ->
  shown ->
    hidden
```

*state.request.state*:

```
idle ->
  sent ->
    success ->
      idle
    error ->
      idle
```