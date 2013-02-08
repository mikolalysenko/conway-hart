var $ = require("jquery-browserify");
var polyhedra = require("../index.js");

var palette = [
  [1, 1, 1],
  [0, 0, 0],
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1],
  [1, 1, 0],
  [1, 0, 1],
  [0, 1, 1]
];

$(document).ready(function() {
  var viewer = require("gl-shells").makeViewer();
  
  function displayPoly(poly) {
    var colors = new Array(poly.faces.length);
    for(var i=0; i<colors.length; ++i) {
      colors[i] = palette[poly.faces[i].length % palette.length];
    }
    for(var i=0; i<poly.positions.length; ++i) {
      var p = poly.positions[i];
      for(var j=0; j<3; ++j) {
        p[j] *= 8;
      }
    }
    poly.face_colors = colors;
    viewer.updateMesh(poly);
  }
  
  displayPoly(polyhedra("Y17"));
  
});