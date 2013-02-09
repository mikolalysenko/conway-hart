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
  
  function process(expr) {
    var poly = polyhedra(expr);
    displayPoly(poly);
  }
  
  function randomPoly() {
    var expr = [];
    while(Math.random() < 0.8) {
      var ops = "abdegjkmoprst";
      expr.push(ops.charAt(Math.floor(Math.random() * ops.length)));
    }
    if(Math.random() < 0.8) {
      var seeds = "TCODI";
      expr.push(seeds.charAt(Math.floor(Math.random() * seeds.length)));
    } else {
      var seeds = "PAY";
      expr.push(seeds.charAt(Math.floor(Math.random() * seeds.length)) + Math.floor(Math.random() * 10 + 3));
    }
    return expr.join("");
  }
  
  var qs = window.location.search;
  var values = require("querystring").parse(qs.substr(1, qs.length));
  var initial = values.e || randomPoly();
  
  $("#expression")[0].value = initial;
  $("#expression").change(function(e) {
    process($("#expression")[0].value);
  });
  process(initial);
});