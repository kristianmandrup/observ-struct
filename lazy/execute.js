var blacklist = require('../blacklist')

module.exports = function() {
  if (!this.anyOps())
    return;
  // take latest framebuffer and play it
  // if (currentTransaction === value) {
  //     return this.obj._set(value)
  // }

  var newState = {} // extend({}, this.obj)
  this.ops.shift().forEach(function(op) {
    newState = op(newState);
  })
  setNonEnumerable(this.obj, "_diff", newState)

  var obj = this.obj

  Object.keys(newState).forEach( function(key) {
    if (!blacklist.hasOwnProperty(key)) {
      obj[key] = newState[key]
    }
  })
  // newState = extend(this.obj, newState)
  this.obj.set(newState)
}

function setNonEnumerable(object, key, value) {
    Object.defineProperty(object, key, {
        value: value,
        writable: true,
        configurable: true,
        enumerable: false
    })
}
