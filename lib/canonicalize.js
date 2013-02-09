//-------------------Canonicalization Algorithm--------------------------
// True canonicalization rather slow.  Using center of gravity of vertices for each
// face gives a quick "adjustment" which planarizes faces at least.
"use strict";

var util = require("./util.js");
var makeDual = require("./dual.js");

function reciprocalN(poly) {    // make array of vertices reciprocal to given planes
  var ans = new Array(poly.faces.length);
  for (var i=0; i<poly.faces.length; ++i) {    // for each face:
    var centroid = [0.0, 0.0, 0.0];           // running sum of vertex coords
    var normal = [0.0, 0.0, 0.0];             // running sum of normal vectors
    var avgEdgeDist = 0.;               // running sum for avg edge distance
    var v1 = poly.faces[i][poly.faces[i].length-2];  // preprevious vertex
    var v2 = poly.faces[i][poly.faces[i].length-1];  // previous vertex
    for (var j=0; j<poly.faces[i].length; j++)  {
      var v3 = poly.faces[i][j];                  // this vertex
      centroid = util.add(centroid, poly.positions[v3]);
      normal = util.add(normal, util.orthogonal(poly.positions[v1], poly.positions[v2], poly.positions[v3]));
      avgEdgeDist = avgEdgeDist + util.edgeDist(poly.positions[v1], poly.positions[v2]);
      v1 = v2;                                   // shift over one
      v2 = v3;
    }
    centroid = util.mult(1.0/poly.faces[i].length, centroid);
    normal = util.unit(normal);
    avgEdgeDist = avgEdgeDist / poly.faces[i].length;
    ans[i] = util.reciprocal(util.mult(util.dot(centroid, normal), normal));  // based on face
    ans[i] = util.mult((1+avgEdgeDist)/2, ans[i]);                  // edge correction
  }
  return (ans);
}

function reciprocalC(poly) {           // return array of reciprocals of face centers
  var center = faceCenters(poly);
  for (var i=0; i<poly.faces.length; i++) {
    var m2 = center[i][0]*center[i][0] + center[i][1]*center[i][1] + center[i][2]*center[i][2];
    center[i][0] = center[i][0] / m2;   // divide each coord by magnitude squared
    center[i][1] = center[i][1] / m2;
    center[i][2] = center[i][2] / m2;
  }
  return(center);
}

function faceCenters(poly) {              // return array of "face centers"
  var ans = new Array(poly.faces.length);
  for (var i=0; i<poly.faces.length; i++) {
    ans[i] = util.vecZero();                      // running sum
    for (var j=0; j<poly.faces[i].length; j++)    // just average vertex coords:
      ans[i] = util.add(ans[i], poly.positions[poly.faces[i][j]]);  // sum and...
    ans[i] = util.mult(1./poly.faces[i].length, ans[i]);        // ...divide by n
  }
  return (ans);
}
exports.faceCenters = faceCenters;

function canonicalpositions(poly, nIterations) {      // compute new vertex coords.
  var dpoly = makeDual(poly)     // v's of dual are in order or arg's f's
  for (var count=0; count<nIterations; count++) {    // iteration:
    dpoly.positions = reciprocalN(poly);
    poly.positions = reciprocalN(dpoly);
  }
}
exports.canonicalpositions = canonicalpositions;

function adjustpositions(poly, nIterations) {
  var dpoly = makeDual(poly)     // v's of dual are in order or arg's f's
  for (var count=0; count<1; count++) {    // iteration:
    dpoly.positions = reciprocalC(poly);             // reciprocate face centers
    poly.positions = reciprocalC(dpoly);             // reciprocate face centers
  }
}
exports.adjustpositions = adjustpositions;
