var combinators = require('fantasy-combinators'),
    Unit        = require('./unit'),
    ST          = require('./st'),

    compose  = combinators.compose,
    constant = combinators.constant,
    identity = combinators.identity;

function error() {
    throw new TypeError('Expected Right, got Left.');
}

function tailRec(f, a) {
    var r = ST.of(f(a)),
        go = function(x) {
            return fold(error, identity);
        };
    until(function() {
        return r.readRef().cata({
            Left: function(a) {
                r.writeRef(f(a));
                return false;
            },
            Right: constant(true)
        });
    });
    return go(r.readRef());
}

function until(f) {
    while(!f());
    return Unit;
}

function forever(f) {
    return tailRec(function(x) {
        return Either.Left(x);
    });
}

// Export
if (typeof module != 'undefined')
    module.exports = {
        tailRec: tailRec,
        until  : until,
        forever: forever
    };