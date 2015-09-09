var λ           = require('fantasy-check/src/adapters/nodeunit'),
    functor     = require('fantasy-check/src/laws/functor'),
    monad       = require('fantasy-check/src/laws/monad'),
    monoid = require('fantasy-check/src/laws/monoid'),
    semigroup = require('fantasy-check/src/laws/semigroup'),

    streams = require('../fantasy-streams'),

    Process  = streams.Process;

Array.of = function(x) {
    return [x];
};

Array.empty = function() {
    return [];
};

Array.prototype.ap = function(x) {
    return this.chain(function(f) {
        return x.map(f);
    });
};

Array.prototype.chain = function(f) {
    var r = [];
    for(var i = 0, len = this.length; i < len; i++) {
        r.splice.apply(r, [r.length, 0].concat(f(this[i])));
    }
    return r;
};

Array.prototype.map = function(f) {
    return this.chain(function(x) {
        return [f(x)];
    });
};

function run(x) {
    return x.run(Array);
}

exports.process = {

    // Functor tests
    'All (Functor)': functor.laws(λ)(Process.of, run),
    'Identity (Functor)': functor.identity(λ)(Process.of, run),
    'Composition (Functor)': functor.composition(λ)(Process.of, run),

    // Monad tests
    'All (Monad)': monad.laws(λ)(Process, run),
    'Left Identity (Monad)': monad.leftIdentity(λ)(Process, run),
    'Right Identity (Monad)': monad.rightIdentity(λ)(Process, run),
    'Associativity (Monad)': monad.associativity(λ)(Process, run),

    // Monoid tests
    'All (Monoid)': monoid.laws(λ)(Process, run),
    'leftIdentity (Monoid)': monoid.leftIdentity(λ)(Process, run),
    'rightIdentity (Monoid)': monoid.rightIdentity(λ)(Process, run),
    'associativity (Monoid)': monoid.associativity(λ)(Process, run),

    // Semigroup tests
    'All (Semigroup)': semigroup.laws(λ)(Process.of, run),
    'associativity (Semigroup)': semigroup.associativity(λ)(Process.of, run)
};
