# dotf

Manage multiple dotfile.

```sh
yarn add dotf
```

## Features

- Absolute or relative dotfiles

## Example

```js
let dotf = require('dotf');

let dotrc = dotf('~/myrc'); // Global (~)
let dotignore = dotf('./myignore'); // Local (./)
let dotsettings = dotf('mysettings'); // Local (./)

dotrc.exists().then((exists) => {
  // boolean
  console.log(exists);
})

dotrc.read().then((data) => {
  // read data
  console.log(data);
})

dotrc.write({a: 1}).then((data) => {
  // overwrote data
  console.log(data);
});

```
