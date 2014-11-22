module.exports = ObservLazyStruct

var structScheduler  = require("./lazy/struct-scheduler.js")
var lazySet          = require('./lazy/lazy-set')

var ObservStruct = require('./index')

function ObservLazyStruct(struct, opts, lv) {
  opts = opts || {}
  var obj = ObservStruct(struct, opts, lv);

  console.log('observable', obj);

  obj.scheduler = new structScheduler.create(obj, opts);
  // override set function
  obj.set = lazySet(obj.scheduler);
  return obj;
}
