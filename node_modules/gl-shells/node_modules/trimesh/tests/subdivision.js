var vows = require('vows');
var assert = require('assert');
var loop_subdivision = require('../src/loop_subdivision.js').loop_subdivision;
var shapes = require('../src/shapes.js');


vows.describe('subdivision.js').addBatch({
  'loop_subdivision' : {
    topic: shapes.grid_mesh(5,5),
    'subdivide': function(mesh) {
      var subdiv = loop_subdivision(mesh);
      assert.ok(subdiv.faces.length === 4*mesh.faces.length);
    },
    
    'triangle': function() {
      var positions = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
      var faces    = [[0,1,2]];
      
      var mesh = { positions: positions, faces: faces };
      for(var i=0; i<2; ++i) {
        mesh = loop_subdivision(mesh);
        console.log(mesh);
      }
    }
  }
}).run();
