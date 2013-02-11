"use strict";

//Import operators
var seeds = require("./lib/seeds.js");
var operators = require("./lib/operators.js");

//Seed types
var SEED_FUNCS = {
  "T":  seeds.tetrahedron,
  "O":  seeds.octahedron,
  "C":  seeds.cube,
  "I":  seeds.icosahedron,
  "D":  seeds.dodecahedron,
  "P":  seeds.prism,
  "A":  seeds.antiprism,
  "Y":  seeds.pyramid
};

//Operator types
var OPERATOR_FUNCS = {
  "k":  operators.kis,
  "a":  operators.ambo,
  "g":  operators.gyro,
  "p":  operators.propellor,
  "d":  operators.dual,
  "r":  operators.reflect,
  "c":  operators.canonicalize
};

//Checks if a seed is a token
function isToken(c) {
  return "kagpdcrTOCIDPAY".indexOf(c) >= 0;
}

//Checks if a value is numeric
function isNumeric(c) {
  return 48 <= c && c <= 57;
}

//Tokenize an expression in Conway notation
function tokenize(expr) {
  expr = expr.replace(/P4$/g, "C")  // P4 --> C   (C is prism)
             .replace(/A3$/g, "O")  // A3 --> O   (O is antiprism)
             .replace(/Y3$/g, "T")  // Y3 --> T   (T is pyramid)
             .replace(/e/g, "aa")   // e --> aa   (abbr. for explode)
             .replace(/b/g, "ta")   // b --> ta   (abbr. for bevel)
             .replace(/o/g, "jj")   // o --> jj   (abbr. for ortho)
             .replace(/m/g, "kj")   // m --> kj   (abbr. for meta)
             .replace(/t(\d*)/g, "dk$1d")  // t(n) --> dk(n)d  (dual operations)
             .replace(/j/g, "dad")  // j --> dad  (dual operations)
             .replace(/s/g, "dgd")  // s --> dgd  (dual operations)
             .replace(/dd/g, "")    // dd --> null  (order 2)
             .replace(/ad/g, "a")   // ad --> a   (a_ = ad_)
             .replace(/gd/g, "g")   // gd --> g   (g_ = gd_)
             .replace(/aY/g, "A")   // aY --> A   (interesting fact)
             .replace(/dT/g, "T")   // dT --> T   (self-dual)
             .replace(/gT/g, "D")   // gT --> D   (symm change)
             .replace(/aT/g, "O")   // aT --> O   (symm change)
             .replace(/dC/g, "O")   // dC --> O   (dual pair)
             .replace(/dO/g, "C")   // dO --> C   (dual pair)
             .replace(/dI/g, "D")   // dI --> D   (dual pair)
             .replace(/dD/g, "I")   // dD --> I   (dual pair)
             .replace(/aO/g, "aC")  // aO --> aC  (for uniqueness)
             .replace(/aI/g, "aD")  // aI --> aD  (for uniqueness)
             .replace(/gO/g, "gC")  // gO --> gC  (for uniqueness)
             .replace(/gI/g, "gD"); // gI --> gD  (for uniqueness)
  var toks = [];
  var ptr = 0;
  while(ptr < expr.length) {
    var op = expr.charAt(ptr);
    if(!isToken(op)) {
      throw new Error("Unexpected token: " + c + " in input " + expr + " at " + ptr);
    }
    var start_n = ++ptr;
    while(ptr < expr.length && isNumeric(expr.charCodeAt(ptr))) {
      ++ptr;
    }
    var n = parseInt(expr.substr(start_n, ptr));
    toks.push({
      op: op,
      n:  n | 0
    });
  }
  toks.reverse();
  return toks;
}

//Main expression interpreter
function evalConwayHart(expr) {

  //Parse expression
  var toks = tokenize(expr);
  
  //Initialize seed
  var ctor = SEED_FUNCS[toks[0].op];
  if(!ctor) {
    throw Error("Invalid seed type: " + JSON.stringify(ops[0]));
  } else if("PAY".indexOf(toks[0].op) >= 0) {
    if(toks[0].n < 3) {
      throw Error("Invalid number of faces for seed");
    }
  } else if(toks[0].n !== 0) {
    throw Error("Seed "  + toks[0].op + " does not use a parameter");
  }
  var poly = ctor(toks[0].n);
  
  //Apply operators
  for(var i=1; i<toks.length; ++i) {
    var op = OPERATOR_FUNCS[toks[i].op];
    if(!op) {
      throw Error("Invalid operator: " + toks[i]);
    }
    poly = op(poly, toks[i].n);
  }  
  return { name: poly.name, cells: poly.faces, positions: poly.positions };
}
module.exports = evalConwayHart;

