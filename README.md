conway-hart
===========
A port of [George Hart's JavaScript implementation/extension of Conway's polyhedral notation](http://www.georgehart.com/virtual-polyhedra/conway_notation.html) to the CommonJS module system.  Here are some useful links that can help explain what it all means:

* George Hart's original implementation:  http://www.georgehart.com/virtual-polyhedra/conway_notation.html
* [The Wikipedia page on Conway's notation](http://en.wikipedia.org/wiki/Conway_polyhedron_notation)

Installation
============
Just use npm:

    npm install conway-hart
    
Example
=======
Here is an example showing how to use this library to generate a shape:

    require("conway-hart")("I");
    
Which produces the following output

  

If you want to try it out for yourself without installing node.js, here is ansome other polytopes for yourself, here is an interactive WebGL demo.

Usage
=====
Conway/Hart notation is a way of specifying spherical polyhedra by subdividing regular polyhedra.  The way it works is that you first specify a **seed** polyhedra, and then apply a sequence of operators.  For more illu

Seeds
-----

### `"T"` Tetrahedron

### `"C"` Cube

### `"O"` Octahedron

### `"D"` Dodecahedron

### `"I"` Icosahedron

### `"Pn"` Prism

### `"An"` Antiprism

### `"Yn"` Pyramid


Operations
----------

### `a` Ambo

### `b` Bevel

### `d` Dual

### `e` Expand

### `g` Gyro

### `j` Join

### `kn` Kis

### `m` Meta

### `o` Ortho

### `p` Propellor

### `r` Reflect

### `s` Split

### `tn` Truncate


Credits
=======
(c) 1998 George Hart. GPL

CommonJS port maintained by Mikola Lysenko.
