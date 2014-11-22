module.exports = deepSet

ObservArray   = require('observ-array')
ObservStruct  = require('./index')
Observ        = require('observ')

function deepSet(obj, opts, lv) {
  // we need to implement deep for observ-struct as well ;)
  if (!!opts.deep) {
    lv = lv || 0;
    opts.maxLv = opts.maxLv || 6;
    if (opts.maxLv < lv) {
      Object.keys(obj).forEach(function(key) {
        var value = obs[key];
        if (typeof value !== 'function') {
          lv = lv + 1
          if (value instanceof Array) {
            ObservArray(value, opts, lv);
          } else if (typeof value === 'object') {
            ObservStruct(value, opts, lv);
          } else {
            Observ(value);
          }
        }
      });
    }
  }
}
