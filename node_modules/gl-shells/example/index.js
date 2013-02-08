var $ = require("jquery-browserify");
$(document).ready(function() {
  var viewer = require("../src/index.js").makeViewer();
  viewer.updateMesh(require("meshdata").bunny);
});