module.exports = ObservLazyStruct

var structScheduler  = require("./lazy/struct-scheduler.js")
var lazySet          = require('./lazy/lazy-set')

var ObservStruct = require('./index')

console.log('scheduler', structScheduler)

function ObservLazyStruct(struct, opts, lv) {
  opts = opts || {}
  var obj = ObservStruct(struct, opts, lv);
  obj.scheduler = new structScheduler.create(obj, opts);
  // override set function
  obj.set = lazySet(obj.scheduler);
  return obj;
}
