var vows = require('vows');
var assert = require('assert');
var topology = require('../src/topology.js');
var shapes = require('../src/shapes.js');


vows.describe("topology.js").addBatch({
  'vertex_stars' : {
    topic: shapes.grid_mesh(5, 5),
    
    'computing star' : function(mesh) {
      var stars = topology.vertex_stars({
            vertex_count: mesh.positions.length
          , faces:        mesh.faces 
        });
      for(var i=0; i<stars.length; ++i) {
        var s = stars[i];
        for(var j=0; j<s.length; ++j) {
          assert.ok(mesh.faces[s[j]].indexOf(i) >= 0, 'Invalid face in star #' + i + ", face=" + mesh.faces[s[j]] + ", star= " + stars[i]);
        }
      }
    },
  }
}).run();


