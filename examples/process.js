var streams = require('./../fantasy-streams'),
    Process = streams.Process,
    Unit    = streams.Unit;

(function() {
    Process.input(function() {
        return Date.now();
    }).map(function(x) {
        console.log("Running...", x);
    }).repeatedly().run(Unit);
})();