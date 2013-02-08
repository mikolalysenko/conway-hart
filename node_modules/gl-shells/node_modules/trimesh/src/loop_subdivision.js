var topology = require('./topology.js');

function opposite(u, v, f) {
  for(var i=0; i<3; ++i) {
    if(f[i] !== u && f[i] !== v) {
      return f[i];
    }
  }
  return 0;
}

//A super inefficient implementation of Loop's algorithm
exports.loop_subdivision = function(args) {
  var positions   = args.positions;
  var faces       = args.faces;
  var edges       = args.edges || topology.edges({faces: faces});
  var stars       = args.stars || topology.vertex_stars({ vertex_count: positions.length, faces: faces });
  var npositions  = [];
  var nfaces      = [];
  var e_indices   = {};
  var v_indices   = new Array(positions.length);  
  
  var e_verts = new Array(3);
  var v_verts = new Array(3);
  
  for(var f=0; f<faces.length; ++f) {
    var face = faces[f];
    
    for(var d=0; d<3; ++d) {
      var v = face[d];
      var u = face[(d+1)%3];
      var e = [u,v];
      e.sort();
      
      if(e in e_indices) {
        e_verts[d] = e_indices[e];
      } else {
        //Compute edge-vertex
        var wing = edges[e];
        var v0 = positions[u];
        var v1 = positions[v];
        var vertex = new Array(3);
        
        if(wing.length === 2) {
          var v2 = positions[opposite(u, v, faces[wing[0]])];
          var v3 = positions[opposite(u, v, faces[wing[1]])];
          
          for(var i=0; i<3; ++i) {
            vertex[i] = (3.0 * (v0[i] + v1[i]) + v2[i] + v3[i]) / 8.0;
          }
        } else {
          for(var i=0; i<3; ++i) {
            vertex[i] = 0.5 * (v0[i] + v1[i]);
          }
        }
        
        //Store vertex and continue
        e_indices[e] = e_verts[d] = npositions.length;
        npositions.push(vertex);
      }
      
      if(v in v_indices) {
        v_verts[d] = v_indices[v];
      } else {
        //Compute vertex-vertex weight
        
        //First, extract vertex neighborhood (slow and stupid here)
        var star = stars[v];
        var nbhd = [v];
        for(var i=0; i<star.length; ++i) {
          var tri = faces[star[i]];
          for(var j=0; j<3; ++j) {
            if(nbhd.indexOf(tri[j]) !== -1) {
              nbhd.push(tri[j]);
            }
          }
        }
        
        //Next, compute weights
        var beta = (star.length === 3 ? 3.0/16.0 : 3.0/(8.0*star.length) );
        var center_weight = 1.0 - star.length * beta;
        
        //Finally sum up weights
        var pos  = positions[v];
        var vertex = new Array(3);
        for(var i=0; i<3; ++i) {
          vertex[i] = center_weight * pos[i];
        }
        for(var i=1; i<nbhd.length; ++i) {
          var p = positions[nbhd[i]];
          for(var j=0; j<3; ++j) {
            vertex[j] += beta * p[j];
          }
        }

        //Store result and continue        
        v_verts[d] = v_indices[v] = npositions.length;
        npositions.push(vertex);
      }
    }
    
    //Add subdivided faces
    nfaces.push([v_verts[0], e_verts[0], e_verts[2]]);
    nfaces.push([e_verts[0], e_verts[1], e_verts[2]]);
    nfaces.push([e_verts[0], v_verts[1], e_verts[1]]);
    nfaces.push([e_verts[1], v_verts[2], e_verts[2]]);
  }
  
  return { positions: npositions, faces: nfaces };
};
