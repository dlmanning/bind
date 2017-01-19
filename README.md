# @dlmanning/bind

Bind and partially apply functions with memoization.

## Install

```
npm install @dlmanning/bind
```

## Usage

```js
const bind = require('@dlmanning/bind')

function fn (str) {
  console.log(this + ' ' + str)
}

const hi = bind('hello', fn)

hi('world') // => hello world

const yo = hi.partial('earth')

yo() // => hello earth
```

## API

See [API.md](API.md) for detailed documentation.

## License

[ISC](LICENSE.md)
