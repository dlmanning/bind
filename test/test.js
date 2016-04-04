'use strict'

const tap = require('tap')
const bind = require('../')

const errors = bind._errors

tap.test('exports', t => {
  t.type(bind, 'function', 'bind is a function')
  t.type(bind.all, 'function', 'bindAll is a function')
  t.type(errors, 'object', 'errors exported')
  t.end()
})

tap.test('bind', t => {
  const dummy = {
    x: 'foo',
    aMethod (x) {
      return x || this.x
    }
  }

  const snowflake = {} // I am special

  const boundMethod = bind(dummy, dummy.aMethod)
  t.type(boundMethod, 'function', 'bind returns a function')
  t.equals(boundMethod(), dummy.aMethod() , 'binds to passed context')

  const partiallyAppliedMethod = boundMethod.partial(snowflake)
  t.type(partiallyAppliedMethod, 'function', 'bind().partial returns a function')
  t.equals(partiallyAppliedMethod(), dummy.aMethod(snowflake), 'bind().partial partially applies')

  const partiallyAppliedMethod2 = boundMethod.partial(snowflake)
  t.equals(partiallyAppliedMethod2, partiallyAppliedMethod, 'bind().partial is memoized')
  t.equals(partiallyAppliedMethod2(), dummy.aMethod(snowflake), 'memoized function has return value in closure')

  t.throws(
    () => bind(dummy, 10),
    new TypeError(errors.BIND_ARGS),
    'throws when the second param is not a function'
  )

  t.end()
})

tap.test('bind.all', t => {
  const dummy = {
    x: 'foo',
    y: 'bar',

    aMethod (x) {
      return x || this.x
    },

    anotherMethod (z) {
      return z == null
        ? this.x + this.y
        : this.x + this.y + z
    }
  }

  const runUnitTests = boundMethods => t => {
    t.type(boundMethods, 'object', 'bindAll returns an object')

    t.test('bindAll returns an object whose values are functions', t => {
      Object.keys(boundMethods).forEach(methodName =>
        t.type(
          boundMethods[methodName],
          'function',
          `${methodName} is a function`
        )
      )
      t.end()
    })

    const aMethod = boundMethods.aMethod
    const anotherMethod = boundMethods.anotherMethod

    t.test('bind.all returns bound methods', t => {
      t.equals(aMethod(), dummy.aMethod(), 'aMethod')
      t.equals(anotherMethod(), dummy.anotherMethod(), 'anotherMethod')
      t.end()
    })

    t.test('bound functions may be partially applied', t => {
      const aMethodPartiallyApplied = aMethod.partial('baz')
      const anotherMethodPartiallyApplied = anotherMethod.partial('baz')

      t.type(aMethodPartiallyApplied, 'function', 'aMethodPartiallyApplied is a function')
      t.type(anotherMethodPartiallyApplied, 'function', 'anotherMethodPartiallyApplied is a function')

      t.equals(aMethodPartiallyApplied(), dummy.aMethod('baz'), 'aMethod')
      t.equals(anotherMethodPartiallyApplied(), dummy.anotherMethod('baz'), 'anotherMethod')

      t.end()
    })

    t.end()
  }

  // Array syntax
  t.test('test array syntax', runUnitTests(
    bind.all(dummy, ['aMethod', 'anotherMethod'])
  ))

  // Object syntax
  t.test('test object syntax', runUnitTests(
    bind.all(dummy, {
      aMethod: dummy.aMethod,
      anotherMethod: dummy.anotherMethod
    })
  ))

  t.test('throws when passed a second param that is not an array or a plain object', t => {
    const badInputs = {
      boolean: true,
      number: 10,
      string: 'hello',
      date: new Date(),
      map: new Map(),
      set: new Set(),
      regexp: new RegExp(),
      function: function () {},
      classInstance: new (class A {})
    }

    Object.keys(badInputs).forEach(inputTypeName =>
      t.throws(
        () => bind.all(dummy, badInputs[inputTypeName]),
        new TypeError(errors.BINDALL_ARGS),
        `throws for ${inputTypeName}`
      )
    )

    t.end()
  })

  t.throws(
    () => bind.all(dummy, ['one', 2, 'three']),
    new TypeError(errors.BINDALL_STRING_ARRAY),
    ''
  )

  t.end()
})
