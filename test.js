import test from 'ava'
import noop from 'lodash.noop'
import sinon from 'sinon'

import session from './'

test('name is required', t => {
  t.throws(session.bind(session), /name is required/)
})

test('store is required', t => {
  t.throws(session.bind(session, 'koa.sess', null), /store is required/)
})

test('store properties are required', t => {
  t.throws(session.bind(session, 'koa.sess'), /store.get must be function/)
  t.throws(session.bind(session, 'koa.sess', {get: function () {}}), /store.set must be function/)
  t.throws(session.bind(session, 'koa.sess', {get: function () {}, set: function () {}}), /store.destroy must be function/)
})

test.cb('should throw AUTHENTICATION_ERROR when cookie header not found', t => {
  const store = {
    get: noop,
    set: noop,
    destroy: noop
  }
  const socket = {
    handshake: {
      headers: {}
    }
  }

  const middleware = session('koa.sess', store)
  middleware(socket, err => {
    t.regex(err.message, /authentication error/)
    t.end()
  })
})

test.cb('should throw AUTHENTICATION_ERROR when cookie header doesn\'t match', t => {
  const store = {
    get: noop,
    set: noop,
    destroy: noop
  }
  const socket = {
    handshake: {
      headers: {
        cookie: 'koa.notfound=1234'
      }
    }
  }

  const middleware = session('koa.sess', store)
  middleware(socket, err => {
    t.regex(err.message, /authentication error/)
    t.end()
  })
})

test.cb('should able to set session object', t => {
  const sessionObj = {
    account: {}
  }
  const store = {
    get: sinon.stub().returns(sessionObj),
    set: noop,
    destroy: noop
  }
  const socket = {
    handshake: {
      headers: {
        cookie: 'koa.sess=1234'
      }
    }
  }

  const middleware = session('koa.sess', store)
  middleware(socket, err => {
    t.is(err, undefined)
    t.true(store.get.called)
    t.is(socket.session, sessionObj)
    t.end()
  })
})
