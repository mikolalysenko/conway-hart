"use strict";
var repair = require('./repair.js');

//Creates a grid mesh
function grid_mesh(args) {
  var nx = args.width   || 10;
  var ny = args.height  || 10;

  var positions = new Array((nx+1) * (ny+1));
  for(var j=0; j<=ny; ++j) {
    for(var i=0; i<=nx; ++i) {
      positions[i + (nx+1)*j] = [i, j, 0];
    }
  }
  
  function p(x,y) { return x + (nx+1)*y; };
  
  var faces     = [];
  for(var j=0; j<ny; ++j) {
    for(var i=0; i<nx; ++i) {
      faces.push([ p(i,j), p(i+1, j), p(i, j+1) ]);
      faces.push([ p(i+1,j), p(i+1,j+1), p(i,j+1) ]);
    }
  }

  return {positions: positions, faces: faces};
}

//Creates a cubical mesh
// resolution is an integer representing number of subdivisions per linear dimension
// scale is a 3d vector representing the scale of the cube
function cube_mesh(args) {

  var resolution = args.resolution || 10;
  var scale      = typeof(args.scale) === "number" ? [args.scale, args.scale, args.scale] : (args.scale || [1.0, 1.0, 1.0]);

  var radius = resolution >> 1;
  var side_len = 2*radius + 1;
  function p(x,y,s) { 
    return x + side_len * (y + side_len * s); 
  }
  
  var positions = new Array(6 * side_len * side_len);
  var faces = [];  
  
  for(var d=0; d<3; ++d) {
    var u = (d+1)%3;
    var v = (d+2)%3;
    
    for(var s=0; s<2; ++s) {
      var f = 2*d + s;
      var x = new Array(3);
      
      x[u] = -radius;
      x[v] = -radius;
      x[d] = (1 - 2*s) * radius;
    
      for(var j=0; j<side_len; ++j, ++x[v]) {
        x[u] = -radius;
        for(var i=0; i<side_len; ++i, ++x[u]) {
          var pos = new Array(3);
          for(var k=0; k<3; ++k) {
            pos[k] = x[k] * scale[k] / radius;
          }
        
          positions[p(i, j, f)] = pos;
          
          if(i < side_len-1 && j < side_len-1) {
            if(s) {
              faces.push([ p(i,j,f), p(i,j+1,f), p(i+1,j,f) ]);
              faces.push([ p(i+1,j,f), p(i,j+1,f), p(i+1,j+1,f) ]);          
            } else {
              faces.push([ p(i,j,f), p(i+1,j,f), p(i,j+1,f) ]);
              faces.push([ p(i,j+1,f), p(i+1,j,f), p(i+1,j+1,f) ]);
            }
          }
        }
      }
    }
  }

  //Glue 6 faces together and return
  var tol = 0.5 * Math.min(scale[0], Math.min(scale[1], scale[2])) / radius;
  return repair.fuse_vertices({positions: positions, faces: faces}, tol);
};


//Creates a spherical mesh
//  resolution is an integer representing number of (vertices/6)^(1/2)
//  radius is the radius of the sphere
function sphere_mesh(args) {
  var resolution = args.resolution || 10;
  var radius     = args.radius || 1.0;

  var base = cube_mesh({ resolution: resolution });
  
  for(var i=0; i<base.positions.length; ++i) {
    var p = base.positions[i];
    var l = 0.0;
    for(var j=0; j<3; ++j) {
      l += p[j] * p[j];
    }
    l = radius / Math.sqrt(l);
    for(var j=0; j<3; ++j) {
      p[j] *= l;
    }
  }
  
  return base;
}


exports.grid_mesh = grid_mesh;
exports.cube_mesh = cube_mesh;
exports.sphere_mesh = sphere_mesh;
