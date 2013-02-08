function vmax(faces) {
  var vc = 0;
  for(var i=0; i<faces.length; ++i) {
    var f = faces[i];
    for(var j=0; j<f.length; ++j) {
      vc = Math.max(vc, f[j]);
    }
  }
  return vc+1;
}

/**
 * Returns an array containing the set of all faces incident to each vertex in the mesh.
 */
exports.vertex_stars = function(args) {
  var faces         = args.faces;
  var vertex_count  = args.vertex_count || vmax(faces);

  var stars = new Array(vertex_count);
  for(var i=0; i<stars.length; ++i) {
    stars[i] = [];
  }
  
  for(var i=0; i<faces.length; ++i) {  
    var f = faces[i];
    for(var j=0; j<f.length; ++j) {
      stars[f[j]].push(i);
    }
  }
  
  return stars;
};

// Compute all edges of a mesh
exports.edges = function(args) {
  var faces = args.faces;
  var edges = { };
  
  for(var i=0; i<faces.length; ++i) {
    var f = faces[i];
    for(var j=0; j<f.length; ++j) {
      var e = [ f[j], f[(j+1)%f.length] ];
      e.sort();
      if(e in edges) {
        edges[e].push(i);
      } else {
        edges[e] = [i];
      }
    }
  }
  
  return edges;
}


var edge_compare = new Function("a", "b", "return a[0] === b[0] ? a[1]-b[1] : a[0]-b[0];");

// Computes the 1-ring around each vertex
exports.rings = function(args) {
  var faces = args.faces;
  var stars = args.stars || exports.vertex_stars(args);
  var vertex_count = args.vertex_count || stars.length;
  var rings = new Array(vertex_count);
  
  for(var i=0; i<vertex_count; ++i) {
    var nbhd = stars[i];
    var edges = [];
    
    for(var n=0; n<nbhd.length; ++n) {
      var f = faces[nbhd[n]];
      for(var j=0; j<f.length; ++j) {
        var e = [f[j], f[(j+1)%3]];
        e.sort();
        edges.push(e);
      }
    }
    
    edges.sort(edge_compare);
    
    //Extract unique edges store in ring
  }
}

