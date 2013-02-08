//Simple mesh viewer
var $             = require('jquery-browserify')
  , GLOW          = require('./GLOW.js').GLOW
  , utils         = require('./utils.js')
  , trimesh       = require('trimesh');

exports.makeViewer = function(params) {

  if(!params) {
    params = {};
  }
  var shell = require('./shell.js').makeShell(params);
  
  if(!params.lightPosition) {
    params.lightPosition = [100,100,100];
  }

  var shaderInfo = {
    vertexShader: [
      "uniform     mat4     transform;",
      "uniform     mat4     cameraInverse;",
      "uniform     mat4     cameraProjection;",
      
      "attribute  vec3      position;",
      "attribute  vec3      color;",
      "attribute  vec3      normal;",
      
      "varying    vec3      eyeDir;",
      "varying    vec3      f_color;",
      "varying    vec3      f_normal;",
      "varying    vec3      f_position;",
      
      "void main(void) {",
        "vec4 t_position = transform * vec4( position, 1.0 );",
        "gl_Position = cameraProjection * cameraInverse * t_position;",
        "eyeDir = normalize(t_position.xyz);",
        "f_color = color;",
        "f_normal = normal;",
        "f_position = position;",
      "}"
    ].join("\n"),
    fragmentShader: [
      "#ifdef GL_ES",
        "precision highp float;",
      "#endif",
      
      "uniform    vec3  lightPosition;",
      
      "varying    vec3      eyeDir;",
      "varying    vec3      f_color;",
      "varying    vec3      f_normal;",
      "varying    vec3      f_position;",
      
      "void main() {",
      
        "vec3 lightDir = normalize(lightPosition - f_position);",

        "float diffuse = clamp(dot(lightDir, f_normal), 0.0, 1.0);",
        "float specular = clamp(dot(f_normal, normalize(lightDir + eyeDir)), 0.0, 1.0);",
        "specular = pow(specular, 32.0);",
        "float intensity = 0.4 + 0.6 * diffuse + 0.5 * specular;",
        
        "gl_FragColor = vec4(intensity * f_color, 1.0);",
      "}"
    ].join("\n"),
    data: {
      transform:        new GLOW.Matrix4(),
      cameraInverse:    GLOW.defaultCamera.inverse,
      cameraProjection: GLOW.defaultCamera.projection,
      position:         new Float32Array([0,0,0,1,0,0,0,1,0]),
      color:            new Float32Array([0,0,1,1,0,0,0,1,0]),
      normal:           new Float32Array([0,0,1,0,0,1,0,0,1]),
      lightPosition:    new GLOW.Vector3(params.lightPosition[0], params.lightPosition[1], params.lightPosition[2])
    },
    interleave: {
      position: false,
      normal:   false,
      color:    false
    },
    primitives: params.wireframe ? GL.LINES : GL.TRIANGLES,
    usage:     GL.DYNAMIC_DRAW
  };
  
  shell.shader = new GLOW.Shader(shaderInfo);
  
  //Update mesh
  shell.updateMesh = function(params) {
  
    /*
    //Update elements
    var faces = params.faces;
    var elements = shell.shader.elements;
    elements.length = faces.length*3;
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, elements.elements);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(utils.flatten(faces)), GL.DYNAMIC_DRAW);
    */
    
    
    //Update normals
    var normals = trimesh.vertex_normals(params);
    shell.shader.normal.bufferData(new Float32Array(utils.flattenFaces(params.faces, normals)));
    
    //Update colors
    if(params.colors) {
      shell.shader.color.bufferData(new Float32Array(utils.flattenFaces(params.faces, params.colors)));
    } else if(params.face_colors) {
      shell.shader.color.bufferData(new Float32Array(utils.flattenPerFace(params.faces, params.face_colors)));
    } else {
      for(var i=0; i<normals.length; ++i) {
        for(var j=0; j<3; ++j) {
          normals[i][j] = 0.5 * normals[i][j] + 0.5;
        }
      }
      shell.shader.color.bufferData(new Float32Array(utils.flattenFaces(params.faces, normals)));
    }
    
    //Update buffer data
    shell.shader.position.bufferData(new Float32Array(utils.flattenFaces(params.faces, params.positions)), GL.DYNAMIC_DRAW);
    
    shell.shader.elements.length = 3*utils.elementLen(params.faces);
  }

  //Draw mesh
  shell.events.on('render', function() {
    var matrix = shell.camera.matrix()
      , xform  = shell.shader.transform;
    for(var i=0; i<4; ++i) {
      for(var j=0; j<4; ++j) {
        xform.value[i+4*j] = matrix[i][j];
      }
    }
    shell.shader.draw();
  });

  return shell;
}