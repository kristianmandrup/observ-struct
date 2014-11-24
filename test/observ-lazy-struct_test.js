var test    = require("tape")
var Observ  = require("../index")
var lazyStruct = require("../observ-lazy-struct")

test("lazyStruct is a function", function (assert) {
    assert.equal(typeof lazyStruct, "function")
    assert.end()
})


test("calling lazyStruct returns observable: function", function (assert) {
    assert.equal(typeof lazyStruct({x: 1}), "function")
    assert.end()
})

test("lazy Observ has lazyness API", function (assert) {
    var obj = lazyStruct({x: 1});

    // assert.equal(arr[0], 3)
    assert.equal(typeof obj.lazySet, "function")

    assert.equal(obj.isObservable(), true)
    assert.equal(obj.isComputed(), false)
    assert.equal(obj.isLazy(), true)
    obj = obj.unlazy()
    assert.equal(obj.isLazy(), false)
    assert.end()
})


test("Observ can be turned into lazy Observ", function (assert) {
    var obj = Observ({x: 1});

    assert.equal(typeof obj.lazySet, "undefined")

    assert.equal(obj.isLazy(), false)
    assert.equal(obj.isObservable(), true)
    obj = obj.lazy()
    assert.equal(obj.isLazy(), true)
    assert.equal(typeof obj.lazySet, "function")
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
