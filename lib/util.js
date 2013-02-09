"use strict";

function clone(poly) {
  var npositions = new Array(poly.positions.length);
  for(var i=0; i<poly.positions.length; ++i) {
    npositions[i] = poly.positions[i].slice(0);
  }
  var nfaces = [];
  for(var i=0; i<poly.faces.length; ++i) {
    nfaces[i] = poly.faces[i].slice(0);
  }
  return {
    name: poly.name.slice(0),
    positions: npositions,
    faces: nfaces
  }
}
exports.clone = clone;

function intersect(set1, set2, set3) {  // find element common to 3 sets
  for (var i=0; i<set1.length; i++) {    // by brute force search
    for (var j=0; j<set2.length; j++) {
      if (set1[i]===set2[j]) {
        for (var k=0; k<set3.length; k++) {
          if (set1[i]===set3[k]) {
            return set1[i];
          }
        }
      }
    }
  }
  throw new Error("program bug in intersect()");
  return null;
}
exports.intersect = intersect;

function sequence(start, stop) {    // make list of integers, inclusive
  var ans = new Array();
  if (start <= stop) {
    for (var i=start; i<=stop; i++) {
      ans.push(i);
    }
  } else {
    for (var i=start; i>=stop; i--) {
      ans.push(i);
    }
  }
  return ans;
}
exports.sequence = sequence;

function orthogonal(v3, v2, v1) {   // find unit vector orthog to plane of 3 pts
  var d1 = sub(v2, v1);            // adjacent edge vectors
  var d2 = sub(v3, v2);
  return [  d1[1]*d2[2] - d1[2]*d2[1],    // cross product
            d1[2]*d2[0] - d1[0]*d2[2],
            d1[0]*d2[1] - d1[1]*d2[0] ]
}
exports.orthogonal = orthogonal;

function mag2(vec) {          // magnitude squared of 3-vector
  return vec[0]*vec[0] + vec[1]*vec[1] + vec[2]*vec[2];
}
exports.mag2 = mag2;

function tangentPoint(v1, v2) {    // point where line v1...v2 tangent to an origin sphere
  var d = sub(v2,v1);             // difference vector
  console.log(d);
  return(sub(v1, mult(dot(d,v1)/mag2(d), d)));
}
exports.tangentPoint = tangentPoint;

function edgeDist(v1, v2) {         // distance of line v1...v2 to origin
  return(Math.sqrt(mag2(tangentPoint(v1, v2))));
}
exports.edgeDist = edgeDist;

function vecZero() {
  return [0.0,0.0,0.0];
}
exports.vecZero = vecZero;

function mult(c, vec) {       // c times 3-vector
  return [ c*vec[0],
           c*vec[1],
           c*vec[2] ];
}
exports.mult = mult;

function add(vec1, vec2) {    // sum two 3-vectors
  return [  vec1[0]+vec2[0],
            vec1[1]+vec2[1],
            vec1[2]+vec2[2] ];
}
exports.add = add;

function sub(vec1, vec2) {    // subtract two 3-vectors
  return [  vec1[0]-vec2[0],
            vec1[1]-vec2[1],
            vec1[2]-vec2[2] ]
}
exports.sub = sub;

function dot(vec1, vec2) {    // dot product two 3-vectors
  return (vec1[0]*vec2[0] + vec1[1]*vec2[1] + vec1[2]*vec2[2]);
}
exports.dot = dot;

function midpoint(vec1, vec2) {    // mean of two 3-vectors
  return [  0.5*(vec1[0] + vec2[0]),
            0.5*(vec1[1] + vec2[1]),
            0.5*(vec1[2] + vec2[2]) ]
}
exports.midpoint = midpoint;

function oneThird(vec1, vec2) {    // approx. (2/3)v1 + (1/3)v2   (assumes 3-vector)
  return [  0.7*vec1[0] + 0.3*vec2[0],
            0.7*vec1[1] + 0.3*vec2[1],
            0.7*vec1[2] + 0.3*vec2[2] ]
  return ans;
}
exports.oneThird = oneThird;

function reciprocal(vec) {    // reflect 3-vector in unit sphere
  var factor = 1./mag2(vec);
  return [  factor*vec[0],
            factor*vec[1],
            factor*vec[2] ]
}
exports.reciprocal = reciprocal;

function unit(vec) {          // normalize 3-vector to unit magnitude
  var size = mag2(vec);
  if (size <= 1e-8) {          // remove this test someday...
    return (vec);
  }
  var c = 1./Math.sqrt(size);
  return mult(c, vec);
}
exports.unit = unit;
