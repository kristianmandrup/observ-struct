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


test("calling lazyStruct returns observable: function", function (assert) {
    var obj = lazyStruct({x: 1});

    assert.equal(obj.x, 1)
    obj.lazySet({y:2});
    obj.lazySet({z:3});

    var scheduler = obj.scheduler;
    assert.equal(typeof scheduler, "object")
    assert.equal(scheduler.scheduled.anyOps(), true)
    assert.equal(scheduler.scheduled.numOps(), 2)

    scheduler.executeScheduled();
    // console.log('OBJECT', obj);
    assert.equal(obj.x, 1)
    assert.equal(obj.y, 2)
    assert.equal(obj.z, 3)

    assert.end()
})
