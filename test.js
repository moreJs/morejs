'use strict';

const complier = require('./index');


let str = "const a = item => console.log('xxx');";
console.log(complier(str));