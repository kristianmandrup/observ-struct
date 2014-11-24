module.exports = ObservLazyStruct

var scheduler  = require("./lazy/scheduler.js")
var lazySet    = require('./lazy/lazy-set')

var ObservStruct = require('./index')

function ObservLazyStruct(struct, opts, lv) {
  opts = opts || {}
  var obs = ObservStruct(struct, opts, lv);
  var schedulerBuilder = opts.schedulerBuilder || scheduler.create;

  obs.scheduler = new schedulerBuilder(obs, opts);
  obs.lazy();
  return obs;
}
