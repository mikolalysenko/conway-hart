//--------------------------------Dual------------------------------------------
// the makeDual function computes the dual's topology, needed for canonicalization,
// where positions's are determined.  It is then saved in a global variable globSavedDual.
// when the d operator is executed, d just returns the saved value.

"use strict";

var Assembler = require("./assembler.js");
var util = require("./util.js");

module.exports = function(poly) {   // compute dual of argument, matching V and F indices
  var result = new Assembler();
  var faces = new Array(poly.positions.length); // make table of face as fn of edge
  for (var i=0; i<poly.positions.length; i++) {
    faces[i] = new Object();    // create empty associative table
  }
  for (var i=0; i<poly.faces.length; i++) {
    var v1 = poly.faces[i][poly.faces[i].length-1];  // previous vertex
    for (j=0; j<poly.faces[i].length; j++) {
      var v2 = poly.faces[i][j];                  // this vertex
      faces[v1]["v" + v2] = i;    // fill it.  2nd index is associative
      v1 = v2;                                   // current becomes previous
    }
  }
  for (var i=0; i<poly.faces.length; i++) {         // create d's v's per p's f's
    result.newV(i, [0,0,0]);                      // only topology needed for canonicalize
  }
  for (var i=0; i<poly.faces.length; i++) {       // one new flag for each old one
    var v1 = poly.faces[i][poly.faces[i].length-1];  // previous vertex
    for (j=0; j<poly.faces[i].length; j++) {
      var v2 = poly.faces[i][j];                  // this vertex
      result.newFlag(v1, faces[v2]["v" + v1], i);        // look up face across edge
      v1 = v2;                                   // current becomes previous
    }
  }
  var ans = result.flags2poly();      // this gives one indexing of answer
  var sortF = new Array(ans.faces.length);     // but f's of dual are randomly ordered, so sort
  for (var i=0; i<ans.faces.length; i++) {
    var j = util.intersect(poly.faces[ans.faces[i][0]],poly.faces[ans.faces[i][1]],poly.faces[ans.faces[i][2]]);
    sortF[j] = ans.faces[i];  // p's v for d's f is common to three of p's f's
  }
  ans.faces = sortF;            // replace with the sorted list of faces
  if(poly.name) {
    if (poly.name.substr(0,1)!="d") {
      ans.name = "d" + poly.name;        // dual name is same with "d" added...
    } else {
      ans.name = poly.name.substr(1);    // ...or removed
    }
  }
  return ans;
}
