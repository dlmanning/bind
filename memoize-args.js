'use strict'

var Map = require('es6-map')

function memoize (fn) {
  var cache = new Cache()

  function memoized (/* ...args */) {
    var args = []
    for (var i = 0; i < arguments.length; i++) args[i] = arguments[i]

    var cached = cache.get(args)
    if (cached != null) {
      return cached
    }

    var value = fn.apply(null, args)
    cache.set(args, value)

    return value
  }

  return memoized
}

function Cache () {
  this.root = new Node ()
}

Cache.prototype.get = function (path) {
  var current = this.root

  for (var i = 0; i < path.length; i++) {
    current = current.get(path[i])
    if (current == null) return null
  }

  return current.value
}

Cache.prototype.set = function (path, value) {
  var current = this.root

  for (var i = 0; i < path.length; i++) {
    current = current.get(path[i])
  }

  current.set(value)
}

function Node () {
  this.value = null
  this.children = new Map()
}

Node.prototype.get = function (key) {
  var child = this.children.get(key)

  if (child == null) {
    child = new Node()
    this.children.set(key, child)
  }

  return child
}

Node.prototype.set = function (value) {
  this.value = value
  return this
}

module.exports = memoize
