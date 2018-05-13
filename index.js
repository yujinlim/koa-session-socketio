const assert = require('assert')
const is = require('is-type-of')

const AUTHENTICATION_ERROR = new Error('authentication error')

/**
 * socket.io middleware to get session from cookie
 * @param  {string} name       key name, need to be the same
 * @param  {Object} [store={}] koa-session store
 * @param  {Object} [opts={}]  koa-session options
 * @return {Function}          middlware
 */
module.exports = (name, store = {}, opts = {}) => {
  assert(name && is.string(name), 'name is required')
  assert(store, 'store is required')
  assert(is.function(store.get), 'store.get must be function')
  assert(is.function(store.set), 'store.set must be function')
  assert(is.function(store.destroy), 'store.destroy must be function')

  return async (socket, next) => {
    // get header cookie from polling
    const cookie = socket.handshake.headers.cookie
    if (!cookie) {
      return next(AUTHENTICATION_ERROR)
    }

    // get cookie value
    const matches = cookie.match(getPattern(name))
    if (!matches) {
      return next(AUTHENTICATION_ERROR)
    }

    const key = matches[1]
    if (!key) {
      return next(AUTHENTICATION_ERROR)
    }

    socket.session = await store.get(key, opts.maxAge, { rolling: opts.rolling })
    next()
  }
}

function getPattern (name) {
  return new RegExp(
    '(?:^|;) *' +
    name.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&') +
    '=([^;]*)'
  )
}
