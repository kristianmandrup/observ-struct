function setNonEnumerable(object, key, value) {
    Object.defineProperty(object, key, {
        value: value,
        writable: true,
        configurable: true,
        enumerable: false
    })
}

module.exports = function(obj, opts) {
  opts = opts || {maxOpsPerFrame: StructScheduler.maxOpsPerFrame || 500}

  outer = {
    obj: obj,
    maxOpsPerFrame: opts.maxOpsPerFrame,
    executeScheduled: function() {
      this.scheduled.execute();
    },
    schedule: function(mutator) {
      var ops = this.scheduled.ops[this.scheduled.frameIndex];
      if (ops.length < this.maxOpsPerFrame) {
        // add one more frame buffer
        ops = this.scheduled.ops.unshift();
        ops.push(mutator);
      }
      return ops;
    }
  }

  scheduled = {
    obj: obj,
    ops: [[]],
    frameIndex: function() {
      return this.ops.length;
    },
    anyOps: function() {
      return this.ops.length > 0;
    },
    execute: function() {
      if (!this.anyOps())
        return;
      // take latest framebuffer and play it
      if (currentTransaction === value) {
          return this.obj._set(value)
      }

      var newState = this.obj;
      this.ops.shift().forEach(function(op) {
        newState = op(newState);
      })
      setNonEnumerable(newState, "_diff", value)
      this._set(newState)
    }
  }
  outer.scheduled = scheduled;
  return outer;
}
