module.exports = {
  outer: {
    schedule: function(mutator) {
      var frameOps = this.scheduled.frameOps();
      var max = this.maxOpsPerFrame;
      var ops = this.scheduled.ops;

      if (frameOps.length < max) {
        frameOps.push(mutator);
        this.onScheduled(frameOps)
      }
      return frameOps;
    }
  },
  scheduled: {
    executeNext: require('./execute')
  }
}
