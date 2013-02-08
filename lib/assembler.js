function Assembler() {
  this.flags      = {};
  this.positions  = {};
  this.faces      = {};
}

Assembler.prototype.newFlag = function(face, v1, v2) {
  if (!this.flags[face]) {
    this.flags[face] = { };
  }
  this.flags[face][v1] = v2;
}

Assembler.prototype.newV = function(name, p) {
  this.positions[name] = p;
}

Assembler.prototype.flags2poly = function() {
  var rpositions = [];
  var verts      = {};
  for (var i in this.positions) {
    verts[i] = rpositions.length;
    rpositions.push(this.positions[i]);
  }
  var rfaces = [];
  for (var i in this.flags) {
    var flag = this.flags[i];
    var f = [];
    var v0 = Object.keys(flag)[0];
    var v = v0;
    do {
      f.push(verts[v]);
      v = flag[v];
    } while (v != v0);
    rfaces.push(f);
  }
  return {
    name:       "?",
    positions:  rpositions,
    faces:      rfaces
  };
}

module.exports = Assembler;
