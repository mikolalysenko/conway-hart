"use strict";

var util          = require("./util.js");
var canonicalize  = require("./canonicalize.js");

module.exports = {
  tetrahedron: function() {
    return {
      name:       "T",
      faces:      [ [0,1,2], [0,2,3], [0,3,1], [1,3,2] ],
      positions:  [ [1.,1.,1.], [1.,-1.,-1.], [-1.,1.,-1.], [-1.,-1.,1.] ]
    };
  },
  octahedron: function() {
    return {
      name:       "O",
      faces:      [ [0,1,2], [0,2,3], [0,3,4], [0,4,1], [1,4,5], [1,5,2], [2,5,3], [3,5,4] ],
      positions:  [ [0,0,1.414], [1.414,0,0], [0,1.414,0], [-1.414,0,0], [0,-1.414,0], [0,0,-1.414] ]
    };
  },
  cube: function() {
    return {
      name:       "C",
      faces:      [ [3,0,1,2], [3,4,5,0], [0,5,6,1], [1,6,7,2], [2,7,4,3], [5,4,7,6] ],
      positions:  [ [ 0.707, 0.707,0.707], [-0.707,0.707,0.707],
                    [-0.707,-0.707,0.707], [0.707,-0.707,0.707],
                    [0.707,-0.707,-0.707], [0.707,0.707,-0.707],
                    [-0.707,0.707,-0.707], [-0.707,-0.707,-0.707] ]
    };
  },
  icosahedron: function() {
    return {
      name:       "I",
      faces:      [ [0,1,2],  [0,2,3],   [0,3,4],  [0,4,5],
                    [0,5,1],  [1,5,7],   [1,7,6],  [1,6,2],
                    [2,6,8],  [2,8,3],   [3,8,9],  [3,9,4],
                    [4,9,10], [4,10,5],  [5,10,7], [6,7,11],
                    [6,11,8], [7,10,11], [8,11,9], [9,11,10] ],
      positions:  [ [0,0,1.176],            [1.051,0,0.526],
                    [0.324,1.,0.525],       [-0.851,0.618,0.526],
                    [-0.851,-0.618,0.526],  [0.325,-1.,0.526],
                    [0.851,0.618,-0.526],   [0.851,-0.618,-0.526],
                    [-0.325,1.,-0.526],     [-1.051,0,-0.526],
                    [-0.325,-1.,-0.526],    [0,0,-1.176] ]

    };
  },
  dodecahedron: function() {
    return {
      name:       "D",
      faces:      [ [0,1,4,7,2],      [0,2,6,9,3],      [0,3,8,5,1],
                    [1,5,11,10,4],    [2,7,13,12,6],    [3,9,15,14,8],
                    [4,10,16,13,7],   [5,8,14,17,11],   [6,12,18,15,9],
                    [10,11,17,19,16], [12,13,16,19,18], [14,15,18,19,17] ],
      positions:  [ [0,0,1.07047], [0.713644,0,0.797878],
                    [-0.356822,0.618,0.797878], [-0.356822,-0.618,0.797878],
                    [0.797878,0.618034,0.356822], [0.797878,-0.618,0.356822],
                    [-0.934172,0.381966,0.356822], [0.136294,1.,0.356822],
                    [0.136294,-1.,0.356822], [-0.934172,-0.381966,0.356822],
                    [0.934172,0.381966,-0.356822], [0.934172,-0.381966,-0.356822],
                    [-0.797878,0.618,-0.356822], [-0.136294,1.,-0.356822],
                    [-0.136294,-1.,-0.356822], [-0.797878,-0.618034,-0.356822],
                    [0.356822,0.618,-0.797878], [0.356822,-0.618,-0.797878],
                    [-0.713644,0,-0.797878], [0,0,-1.07047] ]
    };
  },
  prism: function(n) {
    var theta     = Math.PI * 2.0 / n;
    var h         = Math.sin(theta/2);
    var positions = [];
    for (var i=0; i<n; i++) {
      positions.push([Math.cos(i*theta), Math.sin(i*theta), h]);
    }
    for (var i=0; i<n; i++) {
      positions.push([Math.cos(i*theta), Math.sin(i*theta),-h]);
    }
    var faces     = [ util.sequence(n-1, 0), util.sequence(n, 2*n-1) ];
    for(var i=0; i<n; ++i) {
      faces.push([i, (i+1)%n, (i+1)%n+n, i+n]);
    }
    var result = {
      name:       "P" + n,
      positions:  positions,
      faces:      faces
    };
    canonicalize.adjustpositions(result, 1);
    return result;
  },
  antiprism: function(n) {
    var theta = Math.PI * 2.0 / n;
    var h = Math.sqrt(1-4/(4+2*Math.cos(theta/2)-2*Math.cos(theta)));
    var r = Math.sqrt(1-h*h);
    var f = Math.sqrt(h*h + Math.pow(r*Math.cos(theta/2), 2)); 
    r=r/f;
    h=h/f;
    var positions = [];
    for (var i=0; i<n; i++) {
      positions.push([r*Math.cos(i*theta), r*Math.sin(i*theta), h]);
    }
    for (var i=0; i<n; i++) {
      positions.push([r*Math.cos((i+0.5)*theta), r*Math.sin((i+0.5)*theta), -h]);
    }
    var faces = [ util.sequence(n-1, 0), util.sequence(n, 2*n-1) ]
    for (var i=0; i<n; i++) {
      faces.push([i, (i+1)%n, i+n]);
      faces.push([i, i+n,     ((n+i-1)%n+n)]);
    }
    var result = {
      name:         "A" + n,
      positions:    positions,
      faces:        faces
    };
    canonicalize.adjustpositions(result, 1);
    return result;
  },
  pyramid: function(n) {
    var theta = Math.PI * 2.0 / n;
    var positions = [];
    for(var i=0; i<n; ++i) {
      positions.push([Math.cos(i*theta), Math.sin(i*theta), .2]);
    }
    positions.push([0, 0, -2]);
    var faces = [ util.sequence(n-1, 0) ];
    for (var i=0; i<n; ++i) {
      faces.push([i, (i+1)%n, n]);
    }
    var result = {
      name:       "Y" + n,
      positions:  positions,
      faces:      faces
    };
    canonicalize.canonicalpositions(result, 3);
    return result;
  }
}
