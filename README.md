# RSS Reader Class Project

[![Node.js CI](https://github.com/johanla0/frontend-project-lvl3/actions/workflows/node.js.yml/badge.svg)](https://github.com/johanla0/frontend-project-lvl3/actions/workflows/node.js.yml)
[![Actions Status](https://github.com/johanla0/frontend-project-lvl3/workflows/hexlet-check/badge.svg)](https://github.com/johanla0/frontend-project-lvl3/actions)
[![Maintainability](https://api.codeclimate.com/v1/badges/11f981ca3aa2078678d9/maintainability)](https://codeclimate.com/github/johanla0/frontend-project-lvl3/maintainability)

## Web-service that helps to read RSS feeds

1. To start editing fork or clone this repository
  ```
  $ git clone https://github.com/johanla0/frontend-project-lvl3.git
  ```
2. Install dependencies
  ```
  $ make install
  ```

[Service is available here](https://frontend-project-lvl3-johanla0.vercel.app/)

### State description

feeds: {title, description, link, id}
posts: {title, description, link, feedId, guid, pubDate}

#### Finite-state machine states:

*state.form.state* corresponds to the FSM state:

```
empty ->
  editing ->
    invalid ->
      editing
    valid ->
      sent ->
        success ->
          empty
        invalid ->
          editing
```