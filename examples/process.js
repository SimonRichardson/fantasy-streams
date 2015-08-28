var streams = require('./../fantasy-streams'),
    Process = streams.Process;

(function() {
    Process.eval(function(x) {
        return console.log("Running...");
    }).repeatedly().runLog();
})();