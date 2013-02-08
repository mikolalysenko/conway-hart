exports.parse_obj = function(obj) {
  var lines = obj.split("\n");
  
  var positions           = [];
  var texture_coordinates = [];
  var normals             = [];
  var parameters          = [];
  var faces               = [];
  var materials           = {};
  for(var i=0; i<lines.length; ++i) {
    var toks = lines[i].split(" ");
    if(toks[0] === '#') {
      continue;
    } else if(toks[0] === 'v') {
      positions.push([parseFloat(toks[1]), parseFloat(toks[2]), parseFloat(toks[3])]);
    } else if(toks[0] === 'vt') {
      //Add texture coordinate
    } else if(toks[0] === 'vn') {
      //Add normal
    } else if(toks[0] === 'vp') {
      //Add free parameter
    } else if(toks[0] === 'f') {
      //Add face
    } else {
      //Ignore field
    }
  }
  
  //Return all of the 
  
}

exports.export_obj = function(args) {
}
