function setNonEnumerable(object, key, value) {
    Object.defineProperty(object, key, {
        value: value,
        writable: true,
        configurable: true,
        enumerable: false
    })
}

var StructScheduler = require('./struct-scheduler')

var extend = require('xtend')
var blackList = require("../blacklist")

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
      var ops = this.scheduled.ops;
      var frameOps = ops[frameIndex] || [];

      if (frameOps.length < max) {
        frameOps.push(mutator);
        this.onScheduled(frameOps)
      }
      return frameOps;
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

      var newState = {} // extend({}, this.obj)
      this.ops.shift().forEach(function(op) {
        newState = op(newState);
      })
      setNonEnumerable(this.obj, "_diff", newState)
      // console.log('newState', newState)

      var obj = this.obj
      Object.keys(newState).forEach( function(key) {

          // TODO: add set and _set to blacklist as well?
          if (!blackList.hasOwnProperty(key)) {
            // console.log('set', key, newState[key])
            obj[key] = newState[key]
          }
      })
      // newState = extend(this.obj, newState)
      this.obj.set(newState)
    }
  };
  outer.scheduled = scheduled;
  return outer;
}
