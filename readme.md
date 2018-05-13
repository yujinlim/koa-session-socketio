# koa-session-socketio  [![Build Status](https://img.shields.io/travis/yujinlim/koa-session-socketio.svg?style=flat-square)](https://travis-ci.org/yujinlim/koa-session-socketio) ![npm](https://img.shields.io/npm/dt/koa-session-socketio.svg?style=flat-square) ![npm](https://img.shields.io/npm/v/koa-session-socketio.svg?style=flat-square)
> socket.io middleware to get session from cookie, this is useful when running socket.io independently from any http framework such as koa/express

## Installation
```bash
npm i koa-session-socketio
```

## Example
```js
const Server = require('socket.io')
const session = require('koa-session-socketio')
const redisStore = require('koa-redis')

const redisConfig = {
  host: 'localhost',
  port: 6379
}

const store = redisStore(redisConfig)
const io = new Server('3000')

io.use(session('koa.sess', store))

io.on('connection', socket => {
  // socket.session contains session object
})
```

## API
### `session(name, store, [opts])`

#### name
Type: `string`  
session key id

#### store
Type: `Object`  
`koa-session` store object
