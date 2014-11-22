module.exports = Scheduler;


// TODO: make DRY!!! the scheduler is the same for all observable immutables.
// Better to put it in observ and be reused for -array and -struct ;)

// customize to fit your scenario (and machine speed of client)
Scheduler.prototype.maxOpsPerFrame = 500;

var Scheduler = function(obj, opts) {
  opts = opts || {maxOpsPerFrame: Scheduler.maxOpsPerFrame || 500}

  outer = {
    obj: obj
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
    }
    anyOps: function() {
      return this.ops.length > 0;
    }
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

function setNonEnumerable(object, key, value) {
    Object.defineProperty(object, key, {
        value: value,
        writable: true,
        configurable: true,
        enumerable: false
    })
}
