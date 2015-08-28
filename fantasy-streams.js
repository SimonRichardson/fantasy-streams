var process = require('./src/process'),
    unit    = require('./src/unit');

if (typeof module != 'undefined')
    module.exports = {
        Process: process,
        Unit   : unit
    };
