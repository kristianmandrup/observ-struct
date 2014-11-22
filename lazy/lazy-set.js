module.exports = lazySet

// `obs.set` is a LAZY mutable implementation of `array[index] = value`
// that schedules lazy mutation for later (ie. when a getter is called)
function lazySet(index, value) {
  this.scheduler.schedule(setter(this));
}

function setter(list) {
  return function() {
    trackDiff(value).bind(list);
  }
}

// TODO: make DRY!!! extract into set.js file
// need tp
function trackDiff(value) {
    if (currentTransaction === value) {
        return _set(value)
    }

    var newState = extend(value)
    setNonEnumerable(newState, "_diff", value)
    _set(newState)
}

function setNonEnumerable(object, key, value) {
    Object.defineProperty(object, key, {
        value: value,
        writable: true,
        configurable: true,
        enumerable: false
    })
}
