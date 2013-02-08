var vows = require('vows');
var assert = require('assert');
var distance = require('../src/distance.js');
var shapes = require('../src/shapes.js');


vows.describe("distance.js").addBatch({
  'quadratic_distance' : {
    'testing quadratic distance' : function() {
    
      var qd = distance.quadratic_distance([1, 0, 0], [0, 1, 0], [1, 1, 0], 1, 1, -1);
      assert.ok(Math.abs(qd - Math.sqrt(2.0)) < 1e-6, "Invalid quadratic distance");
    },
    
    'testing planar distances' : function() {
    
      var points = new Array(4);
      for(var i=0; i<4; ++i) {
        points[i] = new Array(3);
      }
      
      var distances = new Array(4);
    
      for(var i=0; i<1000; ++i) {
        for(var j=0; j<4; ++j) {
          distances[j] = 0.0;
          for(var k=0; k<3; ++k) {
            if(k !== 2) {
              points[j][k] = 1000.0 * (Math.random() - 1.0);
            } else {
              points[j][k] = 0;
            }
            distances[j] += Math.pow(points[j][k] - points[0][k], 2);
          }
          distances[j] = Math.sqrt(distances[j]);
        }
        
        //Sort points
        for(var j=0; j<4; ++j) {
          for(var k=0; k<j; ++k) {
            if(distances[j] < distances[k]) {
              var t0 = points[j];
              points[j] = points[k];
              points[k] = t0;
              
              var t1 = distances[j];
              distances[j] = distances[k];
              distances[k] = t1;
            }
          }
        }
        
        var d0 = distance.quadratic_distance(points[1], points[2], points[3], distances[1], distances[2], -1);
        var d1 = distance.quadratic_distance(points[1], points[2], points[3], distances[1], distances[2], 1);

        
        assert.ok(Math.abs(d0 - distances[3]) < 1e-6 || Math.abs(d1 - distances[3]) < 1e-6, "Incorrect distances: " + d0 + "," + d1 + ".\nPoints="+JSON.stringify(points)+"\nDistances= "+distances);
      }
    
    }
  },
  
  '5x5 grid': {
    topic: shapes.grid_mesh(5, 5),
    
    'testing all pairwise grid distances':  function(mesh) {
    
      //Testing pairwise distances
      for(var j=0; j<mesh.positions.length; ++j) {
        var p = mesh.positions[j];
        var distances = distance.geodesic_distance({
          positions:mesh.positions,
          faces: mesh.faces,
          initial_vertex: j
        });
        for(var i=0; i<mesh.positions.length; ++i) {
          var q = mesh.positions[i];
          var d = 0.0;
          for(var k=0; k<3; ++k) {
            d += Math.pow(p[k] - q[k], 2);
          }
          d = Math.sqrt(d);
          
          assert.ok(Math.abs(distances[i] - d) < 1e-4, "Incorrect distance from " + j + "->" + i + ". Expected: " + d + ", got: " + distances[i]);
        }
      }      
    },
    
    //This still doesn't quite work...
    'sphere': {
      topic: shapes.sphere_mesh(10, 1.0),
      
      'testing sphere pairwise distances': function(sphere) {
      
        for(var i=0; i<100; ++i) {
          var p_idx = Math.floor(Math.random() * sphere.positions.length);
          var distances = distance.geodesic_distance({
            positions: sphere.positions,
            faces: sphere.faces, 
            initial_vertex: p_idx, 
            max_distance: Math.PI/4.0
          });
          var p = sphere.positions[p_idx];
          
          for(var j in distances) {
            if(distances[j] > Math.PI/4) {
              continue;
            }
          
            var q = sphere.positions[j];
            var angle = 0.0;
            for(var k=0; k<3; ++k) {
              angle += p[k] * q[k];
            }
            angle = Math.min(1.0, Math.max(-1.0, angle));
            angle = Math.acos(angle);
            
            assert.ok(Math.abs(distances[j] - angle) < 0.2, "Incorrect distance from " + i + "->" + j + ". Expected: " + angle + ", got: " + distances[j]);
          }
        }
      
      }
    },
  },
}).run();


