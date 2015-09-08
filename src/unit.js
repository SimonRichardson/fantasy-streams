var daggy = require('daggy'),

    Unit = daggy.tagged();

Unit.of = function(x) {
    return Unit;
};

Unit.empty = function() {
    return Unit;
};

Unit.concat = function(x) {
    return Unit;
};

// Export
if (typeof module != 'undefined')
    module.exports = Unit;