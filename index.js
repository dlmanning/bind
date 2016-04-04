'use strict'

var memoize = require('./memoize-args')

module.exports = exports = bind

/**
 * @param {Object} self - context to which the function will be bound
 * @param {function} fn - function to be bound
 */
function bind (self, fn) {
  if (typeof fn !== 'function') throw new TypeError(errors.BIND_ARGS)

  bound.partial = memoize(partialApply)

  return bound

  function bound () {
    if (arguments.length > 0) {
      return fn.apply(self, arguments)
    } else {
      return fn.call(self)
    }
  }

  function partialApply () {
    var args = []

    for (var i = 0; i < arguments.length; i++) args[i] = arguments[i]

    return function partiallyApplied () {
      for (var j = 0; j < arguments.length; j++) args[i + j] = arguments[j]
      return fn.apply(self, args)
    }
  }
}

/**
 * @param {Object} self - context to which the function will be bound
 * @param {string[] | Object.<string, function>} methods - An array of method names on self, or an object whose values are functions
 */
bind.all = function all (self, methods) {
  if (
    methods.constructor !== Object &&
    !Array.isArray(methods)
  ) throw new TypeError(errors.BINDALL_ARGS)

  if (Array.isArray(methods)) {
    methods = methods.reduce(function checkMethod (accum, methodName) {
      if (typeof methodName !== 'string') {
        throw new TypeError(errors.BINDALL_STRING_ARRAY)
      }

      accum[methodName] = self[methodName]
      return accum
    }, {})
  }

  return Object.keys(methods).reduce(function doBinding (bound, methodName) {
    bound[methodName] = bind(self, methods[methodName])
    return bound
  }, {})
}

var errors = {
  BINDALL_ARGS: 'bindAll: second param must be a plain object or an array',
  BINDALL_STRING_ARRAY: 'bindAll: methods array must only contain strings',
  BIND_ARGS: 'bind: second param of bind must be a function'
}

exports._errors = errors
