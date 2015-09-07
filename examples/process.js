var streams = require('./../fantasy-streams'),
    Process = streams.Process;

(function() {
    Process.eval(function(x) {
        console.log("Running...");
    }).runLog();
})();