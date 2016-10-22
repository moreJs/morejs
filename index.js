'use strict';

const token = require('./lib/tokenizer');
const parser = require('./lib/parser');
const transfor = require('./lib/transformer');
const gen = require('./lib/codeGenerator');


module.exports = origin => {
    // origin code ==> origin token
    let tok = token.Create(origin);
    let tokens = tok.run();
    // origin token ==> origin ast
    let p = new parser(tokens);
    let ast = p.start();
    // origin ast ==> transfor ast
    let t = new transfor(ast);
    let nT = t.run();
    // transfor ast ==> stringly code
    let g = new gen(nT);
    return g.run();
};