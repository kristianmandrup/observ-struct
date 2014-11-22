function setNonEnumerable(object, key, value) {
    Object.defineProperty(object, key, {
        value: value,
        writable: true,
        configurable: true,
        enumerable: false
    })
}

var StructScheduler = require('./struct-scheduler')

module.exports = function(obj, opts) {
  opts = opts || {}
  opts.maxOpsPerFrame = opts.maxOpsPerFrame || StructScheduler.maxOpsPerFrame || 500
  outer = {
    obj: obj,
    maxOpsPerFrame: opts.maxOpsPerFrame,
    executeScheduled: function() {
      this.scheduled.execute();
    },
    schedule: function(mutator) {

      var frameIndex = this.scheduled.frameIndex();
      var max = this.maxOpsPerFrame;
      var ops = this.scheduled.ops[frameIndex];

      if (ops.length < max) {
        ops.push(mutator);
        this.onScheduled(ops)
      }
      return ops;
    },
    // hook: override to log scheduled operations as they are added
    onScheduled: function(ops) {
    }
  }

  var scheduled = {
    obj: obj,
    ops: [[]],
    frameIndex: function() {
      return Math.max(this.ops.length-1, 0);
    },
    numOps: function() {
      return this.ops[this.frameIndex()].length;
    },
    anyOps: function() {
      return this.numOps() > 0;
    },
    execute: function() {
      if (!this.anyOps())
        return;
      // take latest framebuffer and play it
      // if (currentTransaction === value) {
      //     return this.obj._set(value)
      // }

      var newState = this.obj;
      console.log('newState', newState)
      this.ops.shift().forEach(function(op) {
        newState = op(newState);
        console.log('newState', newState)
      })
      // setNonEnumerable(newState, "_diff", value)
      this.obj._set(newState)
    }
  };
  outer.scheduled = scheduled;
  return outer;
}
