gl-shells
=========

Simple ready-to-go WebGL shells for making spinning models

Usage
=====

Here is an example using jquery and some data from meshdata showing how to draw a bunny:

    var $ = require("jquery-browserify");
    $(document).ready(function() {
      var viewer = require("gl-shells").makeViewer();
      viewer.updateMesh(require("meshdata").bunny);
    });


Methods
=======

## `makeShell(params)` ##

Creates a viewer taking in an optional JSON object with some parameters

* `bg_color`: Background color of the viewer
* `camera_pos`: Default x,y,z position of camera (always points toward origin)
* `container`: A jquery selector for the element to add the GL context to

Returns a GL shell object which implements EventEmitter and exposes the following events:

### Event `render` ###

Triggered when a frame gets rendered


## `makeViewer(params)` ##

Similar to make shell, except it implements a mesh viewer.  Params has the same function as before, only with the following extra features added:

* `wireframe` : If set to true, then draws mesh in wireframe mode

Also, the viewer object has the following extra methods:

### `viewer.updateMesh(mesh)` ###

This takes a mesh object with two members `positions`, which is an array of 3D arrays representing the x/y/z coordinate of each vertex and `faces` which is an array of 3D arrays giving the indices of each face.


## `GLOW` ##

A WebGL GLOW object.

## `GL` ##

Added to window.GL (unfortunately), the current active GL context.


Installation
============

    npm install gl-shells