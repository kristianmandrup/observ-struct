module.exports = ObservLazyStruct

var Scheduler   = require("./lazy/scheduler.js")
var lazySet     = require('./lazy/lazy-set')
var lazyPut     = require('./lazy/lazy-put')

var ObservStruct = require('./index')

function ObservLazyStruct(struct, opts, lv) {
  opts = opts || {}

  opts.set = lazySet;

  var obj = ObservStruct(struct, opts, lv);
  obj.scheduler = new Scheduler(obj, opts);
  return obj;
}
