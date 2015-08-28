var combinators = require('fantasy-combinators'),
    daggy = require('daggy'),
    sorcery = require('fantasy-sorcery'),

    compose  = combinators.compose,
    constant = combinators.constant,
    empty    = sorcery.empty,
    point    = sorcery.point,

    Process = daggy.taggedSum({
        Halt: [],
        Emit: ['x', 'p'],
        Await: ['f']
    });

Process.of = function(x) {
    return Process.Emit(x, Process.Halt);
};

Process.empty = function() {
    return Process.Halt;
};

Process.prototype.ap = function(a) {
    return this.cata({
        Halt: constant(Process.Halt),
        Emit: function(x, p) {
            return x.ap(a).concat(t.ap(a));
        },
        Await: function(g) {
            return Process.Await(function(h) {
                return g(function(req, recv, fb) {
                    return h(req, function(res) {
                        return recv(res.ap(a));
                    }, fb.ap(a));
                });
            });
        }
    });
};

Process.prototype.map = function(f) {
    return this.cata({
        Halt: constant(Process.Halt),
        Emit: function(x, p) {
            return Process.Emit(f(x), p.map(f));
        },
        Await: function(g) {
            return Process.Await(function(h) {
                return g(function(req, recv, fb) {
                    return h(req, function(res) {
                        return recv(res).map(f);
                    }, fb.map(f));
                });
            });
        }
    });
};

Process.prototype.chain = function(f) {
    return this.cata({
        Halt: constant(Process.Halt),
        Emit: function(x, p) {
            return f(x).concat(p.chain(f));
        },
        Await: function(g) {
            return Process.Await(function(h) {
                return g(function(req, recv, fb) {
                    return h(req, function(res) {
                        return recv(res).chain(f);
                    }, fb.chain(f));
                });
            });
        }
    });
};

Process.prototype.concat = function(a) {
    return this.cata({
        Halt: constant(a),
        Emit: function(x, p) {
            return Process.Emit(x, p.concat(a));
        },
        Await: function(f) {
            return Process.Await(function(g) {
                return f(function(req, recv, fb) {
                    return g(req, (function(res) {
                        return rec(res.concat(a));
                    }), fb.concat(a));
                });
            });
        }
    });
};

Process.await = function(req, recv) {
    return Process.Await(function(f) {
        return f(req, recv, Process.Halt);
    })
};

Process.emit = function(x) {
    return Process.of(x);
};

Process.eval = function(x) {
    return Process.await(x, Process.emit);
};

Process.prototype.translate = function(f) {
    return this.cata({
        Halt: constant(Process.Halt),
        Emit: function(x, p) {
            return Process.Emit(x, t.translate(f));
        },
        Await: function(g) {
            return Process.Await(function(h) {
                return g(function(req, recv, fb) {
                    return h(f(req), function(b) {
                        return recv(b).translate(f);
                    }, fb.translate(f));
                });
            });
        }
    });
};

Process.prototype.flatten = function() {
    return this.cata({
        Halt: constant(Process.Halt),
        Emit: function(x, p) {
            return Process.Await(function(f) {
                return f(x, function(a) {
                    return Process.Emit(a, t.flatten())
                }, Process.Halt);
            });
        },
        Await: function(f) {
            return Process.Await(function(g) {
                return f(function(req, recv, fb) {
                    return g(req, function(a) {
                        return recv(a).flatten();
                    }, fb.flatten());
                });
            });
        }
    });
};

Process.prototype.repeatedly = function() {
    function go(p) {
        return p.cata({
            Halt: function() {
                return go(p);
            },
            Emit: function(h, t) {
                return Process.Emit(h, go(t));
            },
            Await: function(f) {
                return Process.Await(function(g) {
                    return f(function(req, recv, fb) {
                        return g(req, function(r) {
                            return go(recv(r));
                        }, fb);
                    });
                });
            }
        });
    }
    return go(this);
};

Process.prototype.evalMap = function(f) {
    return this.map(f).flatten();
};

Process.prototype.runFoldMap = function(f, p) {
    function go(x, acc) {
        return x.cata({
            Halt: constant(point(p, acc)),
            Emit: function(h, t) {
                return go(t, f(h).concat(acc));
            },
            Await: function(f) {
                return f(function(req, recv, fb) {
                    return req.chain(function(s) {
                        return go(recv(s), acc);
                    });
                });
            }
        });
    }
    return go(this, empty(p));
};

Process.prototype.runLog = function() {
    return this.runFoldMap(function(x) {
        return [x];
    }, []);
};

Process.prototype.run = function() {
    return this.runFoldMap(function(f) {
        return [];
    }, []);
};

// HACKS! Remove these
Array.empty = function() {
    return [];
};
Array.of = function(x) {
    return [x];
};

Function.prototype.chain = function(f) {
    return compose(f)(this);
};

// Export
if (typeof module != 'undefined')
    module.exports = Process;
