module.exports = lazySet

// `obs.set` is a LAZY mutable implementation of `array[index] = value`
// that schedules lazy mutation for later (ie. when a getter is called)
function lazySet(scheduler) {
  return function (newValue) {
    scheduler.schedule(setter(newValue));
  }
}

function setter(value) {
  return function(state) {
    return set(state, value);
  }
}

function set(state, value) {
  return extend(state, value);
}
