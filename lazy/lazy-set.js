module.exports = lazySet

var extend = require('xtend')

// `obs.set` is a LAZY mutable implementation of `array[index] = value`
// that schedules lazy mutation for later (ie. when a getter is called)
function lazySet(scheduler) {
  return function (newValue) {
    scheduler.schedule(setter(newValue));
  }
}

function setter(value) {
  console.log('setter', value)
  return function(state) {
    console.log('set via state', state, value)
    return set(state, value);
  }
}

function set(state, value) {
  console.log('set - extend', state, value)
  return extend(state, value);
}
