var Observ = require("observ")
var extend = require("xtend")

var deepSet   = require("./deep-set")
var blackList = require("./blacklist")
var NO_TRANSACTION = {}

var isObservable  = require('observ/is-observable')
var isComputed    = require('observ/is-computed')

/* ObservStruct := (Object<String, Observ<T>>) =>
    Object<String, Observ<T>> &
        Observ<Object<String, T> & {
            _diff: Object<String, Any>
        }>

*/
module.exports = ObservStruct


function trackDiff(value) {
    if (currentTransaction === value) {
        return _set(value)
    }

    var newState = extend(value)
    setNonEnumerable(newState, "_diff", value)
    _set(newState)
}

function setNonEnumerable(object, key, value) {
    Object.defineProperty(object, key, {
        value: value,
        writable: true,
        configurable: true,
        enumerable: false
    })
}

function ObservStruct(struct, opts, lv) {
    opts = opts || {}

    var keys = Object.keys(struct)

    var initialState = {}
    var currentTransaction = NO_TRANSACTION
    var nestedTransaction = NO_TRANSACTION

    keys.forEach(function (key) {
        if (blackList.hasOwnProperty(key)) {
            throw new Error("cannot create an observ-struct " +
                "with a key named '" + key + "'.\n" +
                blackList[key]);
        }

        var observ = struct[key]
        initialState[key] = typeof observ === "function" ?
            observ() : observ
    })

    var obs = Observ(initialState)
    keys.forEach(function (key) {
        var observ = struct[key]
        obs[key] = observ

        if (typeof observ === "function") {
            observ(function (value) {
                if (nestedTransaction === value) {
                    return
                }

                var state = extend(obs())
                state[key] = value
                var diff = {}
                diff[key] = value && value._diff ?
                    value._diff : value

                setNonEnumerable(state, "_diff", diff)
                currentTransaction = state
                obs.set(state)
                currentTransaction = NO_TRANSACTION
            })
        }
    })
    var _set = obs.set
    obs._set = _set
    obs.set = function trackDiff(value) {
        if (currentTransaction === value) {
            return _set(value)
        }

        var newState = extend(value)
        setNonEnumerable(newState, "_diff", value)
        _set(newState)
    }

    obs(function (newState) {
        if (currentTransaction === newState) {
            return
        }

        keys.forEach(function (key) {
            var observ = struct[key]
            var newObservValue = newState[key]

            if (typeof observ === "function" &&
                observ() !== newObservValue
            ) {
                nestedTransaction = newObservValue
                observ.set(newState[key])
                nestedTransaction = NO_TRANSACTION
            }
        })
    })
    if (deepSet) {
      deepSet(obs, opts, lv);
    }

    // add basic introspection methods
    obs.isObservable = isObservable
    obs.isComputed   = isComputed

    var lazyness  = require('./lazyness')
    // add basic lazyness methods
    Object.keys(lazyness).forEach(function(key) {
      obs[key] = lazyness[key];
    })
    obs._lazy = false

    obs._type = "observ-struct"
    obs._version = "5"

    return obs
}
