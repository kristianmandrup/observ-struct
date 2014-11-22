var test    = require("tape")
var Observ  = require("observ")

var lazyStruct = require("../observ-lazy-struct")

test("lazyStruct is a function", function (assert) {
    assert.equal(typeof lazyStruct, "function")
    assert.end()
})


test("calling lazyStruct returns observable: function", function (assert) {
    assert.equal(typeof lazyStruct({x: 1}), "function")
    assert.end()
})
