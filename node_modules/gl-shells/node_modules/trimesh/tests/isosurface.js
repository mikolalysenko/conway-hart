var vows = require('vows');
var assert = require('assert');
var marching_cubes = require('../src/marchingcubes.js').marching_cubes;
var marching_tetrahedra = require('../src/marchingtetrahedra.js').marching_tetrahedra;
var surface_nets = require('../src/surfacenets.js').surface_nets;

var TOLERANCE = 1e-3;


function sphere(x,y,z) {
  return Math.sqrt(x*x + y*y + z*z) - 1.0;
}

function validate_surface(mesh, potential) {
  for(var i=0; i<mesh.positions.length; ++i) {
    var p = mesh.positions[i];
    var s = potential(p[0], p[1], p[2]);
    assert.ok(Math.abs(s) < TOLERANCE, "Unacceptable error in isosurface");
  }
}

//These tests kind of suck, but
vows.describe("isosurfaces").addBatch({
  'sphere': {
    
    topic: {
        potential:  sphere
      , resolution: [64,64,64]
      , bounds:     [[-1.5, -1.5, -1.5], [1.5,1.5,1.5]]
    },
    
    'marching cubes': function(field) {
      validate_surface(marching_cubes(field), field.potential);
    },
  
    'marching tets': function(field) {
      validate_surface(marching_tetrahedra(field), field.potential);
    },
    
    'surface nets': function(field) {
      validate_surface(surface_nets(field), field.potential);
    }    
  },
  
}).run();

