var streams = require('./../fantasy-streams'),
    Process = streams.Process;

(function() {
    console.log(Process.eval(function(x) {
        console.log("Running...");
    }).repeatedly().runLog());
})();