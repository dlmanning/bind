## Functions

<dl>
<dt><a href="#bind">bind(self, fn)</a> ⇒ <code><a href="#BoundFunction">BoundFunction</a></code></dt>
<dd><p>bind a function to the provided context</p>
</dd>
</dl>

<a name="BoundFunction"></a>

## BoundFunction : <code>function</code>
**Kind**: global interface  
**Properties**

| Name | Type |
| --- | --- |
| partial | <code>function</code> | 

<a name="BoundFunction+partial"></a>

### boundFunction.partial ⇒ <code>[BoundFunction](#BoundFunction)</code>
Perform a partial application of the provided parameters. The returned function
is memoized for a given set of parameters, so that repeated applications will
always return the same function object.

**Kind**: instance property of <code>[BoundFunction](#BoundFunction)</code>  
**Returns**: <code>[BoundFunction](#BoundFunction)</code> - another BoundFunction with the provided params applied  

| Param | Type | Description |
| --- | --- | --- |
| [...params] | <code>\*</code> | zero or more items to partially apply |

**Example**  
```js
const applied = boundMethod.partial('Hello', 'World')
// applied is a BoundFunction which will always be called with "Hello" and
// "World" as its first two params
```
<a name="bind"></a>

## bind(self, fn) ⇒ <code>[BoundFunction](#BoundFunction)</code>
bind a function to the provided context

**Kind**: global function  
**Returns**: <code>[BoundFunction](#BoundFunction)</code> - a bound function  

| Param | Type | Description |
| --- | --- | --- |
| self | <code>Object</code> | context to which the function will be bound |
| fn | <code>function</code> | function to be bound |

**Example**  
```js
var boundMethod = bind(this, this.aMethod)
boundMethod() // boundMethod is bound to this
```
<a name="bind.all"></a>

### bind.all(self, methods) ⇒ <code>Object.&lt;string, BoundFunction&gt;</code>
bind a collection of functions to the provided context.

**Kind**: static method of <code>[bind](#bind)</code>  

| Param | Type | Description |
| --- | --- | --- |
| self | <code>Object</code> | context to which the function will be bound |
| methods | <code>Array.&lt;string&gt;</code> &#124; <code>Object.&lt;string, function()&gt;</code> | If an array is given, it must be an array of strings whose names are methods on the provided context object. If an object is provided, the returned object will key the bound functions according to those provided. |

**Example**  
```js
// assumes hear, see and speak are methods on this
bind.all(this, ['hear', 'see', 'speak'])
// or you can pass an object with function values, which will be bound to this
bind.all(this, { hear: function1, see: function2, speak: function3 })
```
