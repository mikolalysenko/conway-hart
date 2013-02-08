exports.flatten = function(arr) {
  var result = new Array(arr.length * 3);
  for(var i=0,j=0; i<arr.length; ++i, j+=3) {
    var p = arr[i];
    for(var k=0; k<3; ++k) {
      result[j+k] = p[k];
    }
  }
  return result;
}

function pushVert(result, p) {
  for(var k=0; k<3; ++k) {
    result.push(p[k]);
  }
}

exports.elementLen = function(faces) {
  var count = 0;
  for(var i=0; i<faces.length; ++i) {
    count += faces[i].length - 2;
  }
  return count;
}

exports.flattenFaces = function(faces, arr) {
  var result = [];
  for(var i=0; i<faces.length; ++i) {
    var f = faces[i];
    for(var j=2; j<f.length; ++j) {
      pushVert(result, arr[f[0]]);
      pushVert(result, arr[f[j-1]]);
      pushVert(result, arr[f[j]]);
    }
  }
  return result;
}

exports.flattenPerFace = function(faces, arr) {
  var result = [];
  for(var i=0; i<faces.length; ++i) {
    var f = faces[i];
    for(var j=2; j<f.length; ++j) {
      pushVert(result, arr[i]);
      pushVert(result, arr[i]);
      pushVert(result, arr[i]);
    }
  }
  return result;
}

var nextFrame = (function(){
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame || 
            window.mozRequestAnimationFrame    || 
            window.oRequestAnimationFrame      || 
            window.msRequestAnimationFrame     || 
            function( callback ){
              window.setTimeout(callback, 1000 / 60);
            };
  })();

exports.nextFrame = function(f) { nextFrame(f); };

exports.printVec3 = function(vec) {
  return "vec3(" + vec[0] + "," + vec[1] + "," + vec[2] + ")";
}