var $ = require("jquery-browserify");
var polyhedra = require("../index.js");

var palette = [
  [0.5, 0.5, 0.5],
  [1, 1, 1],
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1],
  [1, 1, 0],
  [1, 0, 1],
  [0, 1, 1],
  [0.7,0.2,0.5],
  [0.2,0.5,0.7],
  [0.5,0.7,0.2],
  [0.7,0.5,0.2],
  [0.5,0.2,0.7],
  [0.2,0.7,0.2]
];

$(document).ready(function() {
  var viewer = require("gl-shells").makeViewer({flatShaded: true, wireframe: true});
  
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
  
  $("#expression").change(function(e) {
    var expr = $("#expression")[0].value;
    var poly = polyhedra(expr);
    displayPoly(poly);
  });
  
  displayPoly(polyhedra("C"));
});