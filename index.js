'use strict'

var memoize = require('./memoize-args')

module.exports = exports = bind

/**
 * bind a function to the provided context
 * @param {Object} self - context to which the function will be bound
 * @param {function} fn - function to be bound
 * @return {BoundFunction} a bound function
 * @example
 * var boundMethod = bind(this, this.aMethod)
 * boundMethod() // boundMethod is bound to this
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

/**
 * Perform a partial application of the provided parameters. The returned function
 * is memoized for a given set of parameters, so that repeated applications will
 * always return the same function object.
 * @param {...*} [params] - zero or more items to partially apply
 * @name BoundFunction#partial
 * @return {BoundFunction}
 * another BoundFunction with the provided params applied
 * @example
 * const applied = boundMethod.partial('Hello', 'World')
 * // applied is a BoundFunction which will always be called with "Hello" and
 * // "World" as its first two params
 */
  function partialApply () {
    var args = []
    for (var i = 0; i < arguments.length; i++) args[i] = arguments[i]

    partiallyApplied.partial = partialApply

    return partiallyApplied

    function partiallyApplied () {
      for (var j = 0; j < arguments.length; j++) args[i + j] = arguments[j]
      return fn.apply(self, args)
    }
  }
}

/**
* bind a collection of functions to the provided context.
* @param {Object} self
* context to which the function will be bound
* @param {string[] | Object.<string, function>} methods
* If an array is given, it must be an array of strings whose names are methods
* on the provided context object. If an object is provided, the returned object
* will key the bound functions according to those provided.
* @return {Object.<string, BoundFunction>}
* @example
* // assumes hear, see and speak are methods on this
* bind.all(this, ['hear', 'see', 'speak'])
* // or you can pass an object with function values, which will be bound to this
* bind.all(this, { hear: function1, see: function2, speak: function3 })
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

/**
 * @interface BoundFunction
 * @type {function}
 * @property {function} partial
 */

var errors = {
  BINDALL_ARGS: 'bindAll: second param must be a plain object or an array',
  BINDALL_STRING_ARRAY: 'bindAll: methods array must only contain strings',
  BIND_ARGS: 'bind: second param of bind must be a function'
}

exports._errors = errors
