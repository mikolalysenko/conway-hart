var vows = require('vows');
var assert = require('assert');
var normals = require('../src/normals.js');
var vertex_normals = normals.vertex_normals;
var face_normals = normals.face_normals;
var shapes = require('../src/shapes.js');


vows.describe("surface normals").addBatch({
  'normals' : {
    topic: shapes.sphere_mesh(20, 1.0),
    
    'testing vertex normals': function(sphere) {
    
      var normals = vertex_normals(sphere);
      
      for(var i=0; i<normals.length; ++i) {
        var n = normals[i];
        var p = sphere.positions[i];
        
        var d = 0.0;
        for(var j=0; j<3; ++j) {
          d += Math.pow(n[j] - p[j], 2);
        }
        d = Math.sqrt(d);
        
        assert.ok(d < 5e-2, "Incorrect normal: " + JSON.stringify(n) + " vs. " + JSON.stringify(p) + ", err = " + d);
      }      
    },
    
    
    'testing face normals': function(sphere) {
    
      var normals = face_normals(sphere);
      
      //TODO: Test these
    },
  },
}).run();


