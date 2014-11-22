module.exports = lazySet

// `obs.set` is a LAZY mutable implementation of `array[index] = value`
// that schedules lazy mutation for later (ie. when a getter is called)
function lazySet(obj) {
  this.scheduler.schedule(setter(value, obj));
}

function setter(value, obj) {
  return function() {
    return set(value).bind(obj);
  }
}

function set(value) {
  return extend(this, value);
}
