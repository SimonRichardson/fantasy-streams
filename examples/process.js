var streams = require('./../fantasy-streams'),
    Process = streams.Process,
    Unit    = streams.Unit;

(function() {
    Process.eval(function() {
        console.log("Running...");
    }).repeatedly().run(Unit);
})();