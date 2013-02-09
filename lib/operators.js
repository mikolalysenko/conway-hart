"use strict";

var util = require("./util.js");
var makeDual = require("./dual.js");
var Assembler = require("./assembler.js");
var canonicalize = require("./canonicalize.js");

exports.dual = function(poly) {
  var dpoly = makeDual(poly);
  dpoly.positions = canonicalize.faceCenters(poly);
  return dpoly;
}

exports.canonicalize = function(poly) {
  poly = util.clone(poly);
  canonicalize.canonicalpositions(poly);
  return poly;
}

function kis(poly, n) {     // only kis n-sided faces, but n==0 means kiss all.
  var result = new Assembler();
  for (var i=0; i<poly.positions.length; i++) {
    result.newV("v"+i, poly.positions[i]);              // each old vertex is a new vertex
  }
  var centers = canonicalize.faceCenters(poly);           // new vertices in centers of n-sided face
  var foundAny = false;                      // alert if don't find any
  for (var i=0; i<poly.faces.length; i++) {
    var v1 = "v" + poly.faces[i][poly.faces[i].length-1];  // previous vertex
    for (var j=0; j<poly.faces[i].length; j++)  {
      var v2 = "v" + poly.faces[i][j];                  // this vertex
      if (poly.faces[i].length == n || n==0) {    // kiss the n's, or all
        foundAny = true;                // flag that we found some
        result.newV("f"+i, centers[i]);        // new vertex in face center
        var fname = i + v1;
        result.newFlag(fname, v1, v2);         // three new flags, if n-sided
        result.newFlag(fname, v2, "f"+i);
        result.newFlag(fname, "f"+i, v1);
      }
      else
        result.newFlag(i, v1, v2);             // same old flag, if non-n
      v1 = v2;                           // current becomes previous
    }
  }
  var ans = result.flags2poly();
  ans.name = "k" + (n===0?"":n) + poly.name;
  canonicalize.adjustpositions(ans, 3);               // adjust and
  return (ans);
}
exports.kis = kis;

function ambo(poly) {                      // compute ambo of argument
  var result = new Assembler();
  for (var i=0; i<poly.faces.length; i++) {
    var v1 = poly.faces[i][poly.faces[i].length-2];  // preprevious vertex
    var v2 = poly.faces[i][poly.faces[i].length-1];  // previous vertex
    for (var j=0; j<poly.faces[i].length; j++)  {
      var v3 = poly.faces[i][j];        // this vertex
      if (v1 < v2)                     // new vertices at edge midpoints
        result.newV(midName(v1,v2), util.midpoint(poly.positions[v1],poly.positions[v2]));
      result.newFlag("f"+i, midName(v1,v2), midName(v2,v3));     // two new flags
      result.newFlag("v"+v2, midName(v2,v3), midName(v1,v2));
      v1 = v2;                         // shift over one
      v2 = v3;
    }
  }
  var ans = result.flags2poly();
  ans.name = "a" + poly.name;
  canonicalize.adjustpositions(ans, 2);             // canonicalize lightly
  return (ans);
}
exports.ambo = ambo;

function midName(v1,v2) {              // unique symbolic name, e.g. "1_2"
  if (v1<v2)
    return (v1 + "_" + v2);
  else
    return (v2 + "_" + v1);
}

function gyro(poly) {                      // compute gyro of argument
  var result = new Assembler();
  for (var i=0; i<poly.positions.length; i++)
    result.newV("v"+i, util.unit(poly.positions[i]));           // each old vertex is a new vertex
  var centers = canonicalize.faceCenters(poly);              // new vertices in center of each face
  for (var i=0; i<poly.faces.length; i++)
    result.newV("f"+i, util.unit(centers[i]));
  for (var i=0; i<poly.faces.length; i++) {
    var v1 = poly.faces[i][poly.faces[i].length-2];  // preprevious vertex
    var v2 = poly.faces[i][poly.faces[i].length-1];  // previous vertex
    for (var j=0; j<poly.faces[i].length; j++)  {
      var v3 = poly.faces[i][j];                  // this vertex
      result.newV(v1+"~"+v2, util.oneThird(poly.positions[v1],poly.positions[v2]));  // new v in face
      var fname = i + "f" + v1;
      result.newFlag(fname, "f"+i, v1+"~"+v2);          // five new flags
      result.newFlag(fname, v1+"~"+v2, v2+"~"+v1);
      result.newFlag(fname, v2+"~"+v1, "v"+v2);
      result.newFlag(fname, "v"+v2, v2+"~"+v3);
      result.newFlag(fname, v2+"~"+v3, "f"+i);
      v1 = v2;                                   // shift over one
      v2 = v3;
    }
  }
  var ans = result.flags2poly();
  ans.name = "g" + poly.name;
  canonicalize.adjustpositions(ans, 3);                       // canonicalize lightly
  return (ans);
}
exports.gyro = gyro;

function propellor(poly) {                             // compute propellor of argument
  var result = new Assembler();
  for (var i=0; i<poly.positions.length; i++)
    result.newV("v"+i, util.unit(poly.positions[i]));           // each old vertex is a new vertex
  for (var i=0; i<poly.faces.length; i++) {
    var v1 = poly.faces[i][poly.faces[i].length-2];  // preprevious vertex
    var v2 = poly.faces[i][poly.faces[i].length-1];  // previous vertex
    for (var j=0; j<poly.faces[i].length; j++)  {
      var v3 = poly.faces[i][j];                  // this vertex
      result.newV(v1+"~"+v2, util.oneThird(poly.positions[v1],poly.positions[v2]));  // new v in face
      var fname = i + "f" + v2;
      result.newFlag("v"+i, v1+"~"+v2, v2+"~"+v3);      // five new flags
      result.newFlag(fname, v1+"~"+v2, v2+"~"+v1);
      result.newFlag(fname, v2+"~"+v1, "v"+v2);
      result.newFlag(fname, "v"+v2, v2+"~"+v3);
      result.newFlag(fname, v2+"~"+v3, v1+"~"+v2);
      v1 = v2;                                   // shift over one
      v2 = v3;
    }
  }
  var ans = result.flags2poly();
  ans.name = "p" + poly.name;
  canonicalize.adjustpositions(ans, 3);                       // canonicalize lightly
  return (ans);
}
exports.propellor = propellor;

function reflect(poly) {                              // compute reflection through origin
  poly = util.clone(poly);
  for (var i=0; i<poly.positions.length; i++)
    poly.positions[i] = util.mult(-1, poly.positions[i]);           // reflect each point
  for (var i=0; i<poly.faces.length; i++)
    poly.faces[i] = poly.faces[i].reverse();         // repair clockwise-ness
  poly.name = "r" + poly.name;
  canonicalize.adjustpositions(poly, 1);                     // build dual
  return (poly);
}
exports.reflect = reflect;


exports.expand = function(poly) {
  return ambo(ambo(poly));
}

exports.bevel = function(poly) {
  return truncate(ambo(poly));
}

exports.ortho = function(poly) {
  return join(join(poly));
}

exports.meta = function(poly) {
  return kis(join(poly));
}

exports.truncate = function(poly, n) {
  return dual(kis(dual(poly), n));
}

exports.join = function(poly) {
  return dual(ambo(dual(poly)));
}

exports.split = function(poly) {
  return dual(gyro(dual(poly)));
}
