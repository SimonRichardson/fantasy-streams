var daggy = require('daggy'),

    ST = daggy.tagged('x');

ST.of = function(x) {
    return ST(x);
};

ST.prototype.readRef = function() {
    return this.x;
};

ST.prototype.modifyRef = function(f) {
    /* jshint boss: true */
    return this.x = f(this.x);
};

ST.prototype.writeRef = function(x) {
    /* jshint boss: true */
    return this.x = a;
};

// Export
if (typeof module != 'undefined')
    module.exports = ST;
