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

    require("conway-hart")("djmeD");

Which produces the following polygon:

<img src="https://raw.github.com/mikolalysenko/conway-hart/master/images/splash.png" width="40%" style="margin-left=auto; margin-right=auto;" />

If you want to try it out for yourself without installing node.js, [here is an interactive WebGL demo.](http://mikolalysenko.github.com/conway-hart/example/www/index.html)

Usage
=====
Conway/Hart notation is a way of specifying spherical polyhedra by subdividing regular polyhedra.  The way it works is that you first specify a **seed** polyhedra, and then apply a sequence of **operators**.  At the end, it returns a JavaScript object with 3 fields:

* `name`: The name of the solid.
* `cells`: The faces of the solid, represented as a list of indices into the vertices.
* `positions`: The positions of the vertices of the solid.

If there is an error parsing the input, an exception is thrown.

Seeds
-----
Here is a list of all the available seeds.  The ones with an `n` next to their symbol take an extra parameter describing how many faces are on their base.

### <img src="https://raw.github.com/mikolalysenko/conway-hart/master/images/T.png" width="10%" /> `"T"` Tetrahedron

### <img src="https://raw.github.com/mikolalysenko/conway-hart/master/images/C.png" width="10%" /> `"C"` Cube

### <img src="https://raw.github.com/mikolalysenko/conway-hart/master/images/O.png" width="10%" /> `"O"` Octahedron

### <img src="https://raw.github.com/mikolalysenko/conway-hart/master/images/D.png" width="10%" /> `"D"` Dodecahedron

### <img src="https://raw.github.com/mikolalysenko/conway-hart/master/images/I.png" width="10%" /> `"I"` Icosahedron

### <img src="https://raw.github.com/mikolalysenko/conway-hart/master/images/P.png" width="10%" /> `"Pn"` Prism

### <img src="https://raw.github.com/mikolalysenko/conway-hart/master/images/A.png" width="10%" /> `"An"` Antiprism

### <img src="https://raw.github.com/mikolalysenko/conway-hart/master/images/Y.png" width="10%" /> `"Yn"` Pyramid

Operations
----------

### <img src="https://raw.github.com/mikolalysenko/conway-hart/master/images/a_.png" width="10%" /> `a` Ambo

### <img src="https://raw.github.com/mikolalysenko/conway-hart/master/images/b.png" width="10%" />`b` Bevel

### <img src="https://raw.github.com/mikolalysenko/conway-hart/master/images/c_.png" width="10%" /> `c` Canonicalize

### <img src="https://raw.github.com/mikolalysenko/conway-hart/master/images/d_.png" width="10%" /> `d` Dual

### <img src="https://raw.github.com/mikolalysenko/conway-hart/master/images/e.png" width="10%" /> `e` Expand

### <img src="https://raw.github.com/mikolalysenko/conway-hart/master/images/g.png" width="10%" /> `g` Gyro

### <img src="https://raw.github.com/mikolalysenko/conway-hart/master/images/j.png" width="10%" /> `j` Join

### <img src="https://raw.github.com/mikolalysenko/conway-hart/master/images/k.png" width="10%" /> `kn` Kis

### <img src="https://raw.github.com/mikolalysenko/conway-hart/master/images/m.png" width="10%" /> `m` Meta

### <img src="https://raw.github.com/mikolalysenko/conway-hart/master/images/o_.png" width="10%" /> `o` Ortho

### <img src="https://raw.github.com/mikolalysenko/conway-hart/master/images/p_.png" width="10%" /> `p` Propellor

### <img src="https://raw.github.com/mikolalysenko/conway-hart/master/images/r.png" width="10%" /> `r` Reflect

### <img src="https://raw.github.com/mikolalysenko/conway-hart/master/images/s.png" width="10%" /> `s` Split

### <img src="https://raw.github.com/mikolalysenko/conway-hart/master/images/t_.png" width="10%" /> `tn` Truncate

Credits
=======
(c) 1998 George Hart. GPL

CommonJS port maintained by Mikola Lysenko.
