Arcball
=======

A simple library-agnostic arcball camera in Javascript

Installation
============

    npm install arcball
    
Example
=======

    var ArcballCamera = require('arcball').ArcballCamera;
    var camera = new ArcballCamera();

    // ... in mouse event handler
    camera.update(mouse_x, mouse_y, {
      rotate:   mouse_left_clicked,
      pan:      mouse_right_clicked,
      zoom:     mouse_middle_clicked
    });
    
    // ... in rendering loop
    var camera_matrix = camera.matrix();


API
===

## `ArcballCamera()`

The main camera object

### `ArcballCamera.update(mouse_x, mouse_y, flags)`

Updates the camera state using the mouse input.  `mouse_x` and `mouse_y` are the x/y coordinates of the mouse, `flags` is an object containing the boolean flags `rotate`, `pan`, and `zoom` which determine how to rotate the camera.

### `ArcballCamera.matrix()`

Returns a 4x4 homogeneous transformation matrix representing the position of the object relative to the arcball camera.

Acknowledgements
================

(c) 2013 Mikola Lysenko (mikolalysenko@gmail.com).  MIT License