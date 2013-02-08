var vows = require('vows');
var assert = require('assert');
var repair = require('../src/repair.js');

vows.describe("repair.js").addBatch({
  'fuse_vertices' : {
    topic: {
      positions: [ 
        [0, 0, 0],
        [0, 1, 0],
        [1, 0, 0],
        [0, 1.00001, 0],
        [1.001, 0, 0],
        [1, 1, 0] ],
      faces: [ [0, 1, 2], [3, 4, 5] ]
    },
    
    'fusing at tol = 0.01': function(mesh) {
      var fused = repair.fuse_vertices({ 
            positions:mesh.positions
          , faces:mesh.faces
          , tolerance:0.01 
        });
      
      assert.ok(fused.positions.length === 4);
      assert.ok(fused.faces.length === 2);
      
      for(var i=0; i<fused.faces.length; ++i) {
        var f = fused.faces[i];
        for(var j=0; j<f.length; ++j) {
          assert.ok(0 <= f[j] && f[j] < fused.positions.length, "vertex out of bounds: " + f);
        }
      }
    },
    
    'fusing at tol = 0.0001': function(mesh) {
      var fused = repair.fuse_vertices({ 
            positions:mesh.positions
          , faces:mesh.faces
          , tolerance:0.0001 
        });
      
      assert.ok(fused.positions.length === 5);
      assert.ok(fused.faces.length === 2);
      
      for(var i=0; i<fused.faces.length; ++i) {
        var f = fused.faces[i];
        for(var j=0; j<f.length; ++j) {
          assert.ok(0 <= f[j] && f[j] < fused.positions.length, "vertex out of bounds: " + f);
        }
      }
    },

    'fusing at tol = 0.000001': function(mesh) {
      var fused = repair.fuse_vertices({ 
            positions:mesh.positions
          , faces:mesh.faces
          , tolerance:0.000001 
        });
      
      assert.ok(fused.positions.length === 6);
      assert.ok(fused.faces.length === 2);
      
      for(var i=0; i<fused.faces.length; ++i) {
        var f = fused.faces[i];
        for(var j=0; j<f.length; ++j) {
          assert.ok(0 <= f[j] && f[j] < fused.positions.length, "vertex out of bounds: " + f);
        }
      }
    },
    
    
    'fusing at tol = 2.0': function(mesh) {
      var fused = repair.fuse_vertices({ 
            positions: mesh.positions
          , faces: mesh.faces
          , tolerance: 2.0
        });
              
      assert.ok(fused.positions.length === 1);
      assert.ok(fused.faces.length === 0);
      
      for(var i=0; i<fused.faces.length; ++i) {
        var f = fused.faces[i];
        for(var j=0; j<f.length; ++j) {
          assert.ok(0 <= f[j] && f[j] < fused.positions.length, "vertex out of bounds: " + f);
        }
      }
    },
  }
}).run();

