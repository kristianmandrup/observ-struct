# observ-struct

<!--
    [![build status][1]][2]
    [![NPM version][3]][4]
    [![Coverage Status][5]][6]
    [![gemnasium Dependency Status][7]][8]
    [![Davis Dependency status][9]][10]
-->

<!-- [![browser support][11]][12] -->

An object with observable key value pairs

## Example

An observable will emit a new immutable value whenever one of
  its keys changes.

Nested keys will still be the same value if they were not changed
  in that particular `.set()` call.

```js
var ObservStruct = require("observ-struct")
var Observ = require("observ")
var assert = require("assert")

var state = ObservStruct({
    fruits: ObservStruct({
        apples: Observ(3),
        oranges: Observ(5)
    }),
    customers: Observ(5)
})

state(function (current) {
  console.log("apples", current.fruits.apples)
  console.log("customers", current.customers)
})

state.fruits(function (current) {
  console.log("apples", current.apples)
})

var initialState = state()
assert.equal(initialState.fruits.oranges, 5)
assert.equal(initialState.customers, 5)

state.fruits.oranges.set(6)
state.customers.set(5)
state.fruits.apples.set(4)
```

## Docs

### `var obj = ObservStruct(opts)`

`ObservStruct()` takes an object literal of string keys to either
  normal values or observable values.

It returns an `Observ` instance `obj`. The value of `obj` is
  a plain javascript object where the value for each key is either
  the normal value passed in or the value of the observable for
  that key.

Whenever one of the observables on a `key` changes the `obj` will
  emit a new object that's a shallow copy with that `key` set to
  the value of the appropiate observable on that `key`.

## Lazy struct

*Experimental - WIP*

A lazy struct will use lazy versions of `set` (and possible other mutation functions will follow...). Instead of executing the operations directly on the state, the operations will be stored for later execution in a scheduler for that array.

```js
// Note: The require will likely be made more convenient ;)
var ObservLazyStruct = require('observ-struct/observ-lazy-struct');

var keys = lookupTable();
var lazyStruct = ObservLazyStruct(struct);

// schedules operations for later
for (var i=3; i < someList.length; i = i + 2) {
  lazyStruct.set(keys[i], someList[i]);
}
```

The scheduler can later be asked to "play" those operations when convenient. This way we can buffer operations and only execute them once per redraw to gain more control and performance boost.

Note however, that you must be careful with this approach, and try to avoid buffering more operations than can be executed for a single frame update, including the DOM patch rendering itself.

For this reason the schedule uses a multi-framed buffer. It creates each buffer with max 500 scheduled operations per frame (default). You can configure this setting on a per array basis like this: `lazyList.scheduler.maxOpsPerFrame = 1300`. You can also set the global default used by all lazy observables when instantiated: `Scheduler.prototype.maxOpsPerFrame = 500;`

Using a "multi-framed buffer" let's us schedule a huge number of operations to be played over multiple frames so we can still get a fluid visual experience.

Note that we will likely be using a common `Scheduler` from `observ` as the base prototype. Then for each type of observable, the Scheduler might behave a little differently or at least have a different `maxOpsPerFrame` default value.

```js
var LazyArrayScheduler.prototype =  Scheduler.prototype`
LazyArrayScheduler.maxOpsPerFrame = 800

var LazyStructScheduler.prototype =  Scheduler.prototype`
LazyArrayScheduler.maxOpsPerFrame = 500
```

We can use all this infrastructure as part of the [main-loop](https://github.com/Raynos/main-loop) implementation...


```js
// inside main-loop update function
// we then instead call `doScheduledAndRedraw(state)` which calls `executeScheduled()` on the state
// if such a method exists, in order to lazily update the state "at the last minute".
function update(state) {
  ...
  if (currentState === null && !redrawScheduled) {
      redrawScheduled = true
      raf(doScheduledAndRedraw(state))
  }
  ...
}

function executeScheduled(state) {
  ...
}

function doScheduledAndRedraw(state) {
  executeScheduled(state);
  redraw();
}

function redraw() {
  ...
```

## Installation

`npm install observ-struct`

## Contributors

 - Raynos

## MIT Licenced

  [1]: https://secure.travis-ci.org/Raynos/observ-struct.png
  [2]: https://travis-ci.org/Raynos/observ-struct
  [3]: https://badge.fury.io/js/observ-struct.png
  [4]: https://badge.fury.io/js/observ-struct
  [5]: https://coveralls.io/repos/Raynos/observ-struct/badge.png
  [6]: https://coveralls.io/r/Raynos/observ-struct
  [7]: https://gemnasium.com/Raynos/observ-struct.png
  [8]: https://gemnasium.com/Raynos/observ-struct
  [9]: https://david-dm.org/Raynos/observ-struct.png
  [10]: https://david-dm.org/Raynos/observ-struct
  [11]: https://ci.testling.com/Raynos/observ-struct.png
  [12]: https://ci.testling.com/Raynos/observ-struct
