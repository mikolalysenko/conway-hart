# trimesh.js

... is an ever expanding collection of algorithms for processing triangulated meshes in Javascript.

## Server side (node.js)

First, install the library using npm:

    npm install trimesh
    
Then include the library in your project like usual:

    var trimesh = require('trimesh');


## Client side

First download the script from the following URL:

https://raw.github.com/mikolalysenko/TrimeshJS/master/build/trimesh.js.min

Add a reference to the script in your header:

    <script src="trimesh.min.js"></script>
    
Which will create an object called `trimesh` in the global namespace that contains the API.

## Getting Test Data

If you want to get some mesh data to mess around with and the built in shape generators are not enough for you, you can also take a look at the stuff stored in the sister MeshData npm module:

https://github.com/mikolalysenko/MeshData


# General Philosophal and Religious Discussion

Working with meshes is hard -- and yet it has to be done if we are to compute on surfaces. The situation is not helped by the enormous confusion of data structures for optimizing spatial and topological queries on meshes. Picking a single representation, like a winged edge, half edge or cell tuple complex brings with it many tradeoffs and introduces enormous complexity into algorithms which operate on these meshes. These choices cause implementations of mesh based algorithms to rapidly diverge, resulting in an enormous proliferation and duplication of effort. Clearly this situation is unacceptable from the stand point of interoperability and coder sanity.  The core philosophy of trimesh.js is a reaction to this offensive mess and can be summed up in the following central thesis:

> ** Meshes do not need their own data structure. **

To avoid falling into the trap of overengineering that seems to sidetrack other mesh libraries, trimesh.js adopts a "Just the facts, ma'am" personality, with each method taking only enough data to answer the necessary basic queries required to implement the described functionality. Guided by these ideals, trimesh.js departs radically from other mesh libraries in the following ways:

* No in place updates or side effects.
* No 'cute' accessors for member components (eg. x/y/z values of a 3D vector).  If an array will suffice to store the data, use an array.  Don't make a new object type.
* Along the same lines, store multiple vertex attributes in separate arrays.  This allows for more efficient iteration, since properties which are not needed are not stored.
* Spatial/topological indices (like grids/winged edge data) are maintained separately from mesh data.  If an index is needed, either build it from scratch or if possible reuse an existing index.

The advantage to this more functional style of mesh computation is that many algorithms can be written in a very straightforward manner.  However, it is not without consequences.  Most severely, because in place updates are not supported, this library may not suitable for large scale interactive mesh processing.  (Of course for those sort of problems you should probably not be using javascript anyway and should look for a way to engineer some sort of streaming solution...)  The other more serious problem is that because indices are not maintained, it may be necessary to rebuild certain indices that could have been computed more efficiently by merging or amortized over mesh operations.  However, it again my opinion that this tradeoff may be worthwhile, since most index calculations scale roughly linearly or log-linearly with the size of the mesh and so asymptotically the added cost is typically at most an extra log factor.  

Removing custom vertex/vector types may also offend some, however I find the x/y/z notation quite tedious and error prone, (as does Carmack, who after documenting his various programming mistakes found that x/y/z notation was the most frequent source of his errors).  Using numerical indices makes it much easier to write per component operations in a generic way.


# API

Trimesh.JS is just a big bag of functions.  Like any library of numerical recipes, many of these functions take a large number of arguments, some of which are optional.  Since javascript does not support features like named arguments, these methods are all called by passing in a dictionary (or object) containing all the parameters.  For example, to call a method which computes the stars of a mesh you would do the following:

    var stars = trimesh.vertex_stars({ faces: [ [0, 1, 2], [1, 2, 3] ], vertex_count: 4 });

Since certain parameters are used frequently, we use the following conventions:

* `faces` is always an array of triples representing the indices of each face in the mesh.
* `positions` is an array of length 3 arrays representing the position of each vertex.
* `stars` is an array of vertex stars, which can be precomputed using the `vertex_stars` function.


## Topology

### `edges`

Finds all edges in a mesh.

#### Parameters:
* `faces`:  The mesh topology

#### Returns:
A dictionary mapping pairs of vertex indices to lists of incident faces.

#### Running time: `O(faces.length)`

### `vertex_stars`

Computes the set of incident faces for each vertex

#### Parameters:
* `faces`: The mesh topology
* `vertex_count`: (Optional) The number of vertices in the mesh.  If not present, is computed from `faces`.

#### Returns:
An array of length `vertex_count`, containing for each vertex an array of all faces incident to it.

#### Running time: `O(faces.length + vertex_count)`



## Mesh Repair and Validation

### `fuse_vertices`

Welds nearby vertices together, removing small cracks and sliver faces within a mesh.

#### Parameters:

* `positions`: Vertex positions
* `faces`: Mesh faces
* `tolerance`: Distance within which vertices must be welded

#### Returns:

* `positions`: The updated fused positions
* `faces`: Fused face topology

#### Running time: `O(positions.length + faces.length)`


## Implicit Function Modeling

Trimesh.JS has 3 different methods for converting implicit functions into triangulated meshes.  They each take the same arguments and produce similar results.  For more information about the differences, see the following post: http://0fps.wordpress.com/2012/07/12/smooth-voxel-terrain-part-2/


### `marching_cubes`, `marching_tetrahedra`, `surface_nets`

#### Parameters:

* `potential` : A function f(x,y,z) that represents the potential function.  (<0 for in, >0 for out)
* `resolution` : A triple [nx,ny,nz] representing the resolution of the isosurface
* `bounds`:  (Optional) A pair of ranges [[x0,y0,z0], [x1,y1,z1]] representing the bounds for the volume.

#### Returns:

* `positions`: The positions of the vertices on the isosurface
* `faces`: The faces of the isosurface

#### Running time: Makes `O(nx * ny * nz)` calls to `potential()`.



## Differential Geometry

### `vertex_normals`

#### Parameters:

* `positions`
* `faces`
* `stars` (Optional)

#### Returns:

An array representing an estimate for the normals of the mesh computed using cotangent weights.

#### Running time: `O( |stars| )`

### `face_normals`

#### Parameters:

* `positions`
* `faces`

#### Returns:

An array of normals for each face

#### Running time: `O( number of faces )`

### `geodesic_distance`

#### Parameters:

* `initial_vertex`
* `positions`
* `faces`
* `max_distance` (Optional)
* `stars` (Optional)

#### Returns:

Hash map of distance to point

#### Running Time: Worse than `O( number of vertices^2 )`  (bad)

#### Notes:

The current implementation of this method is bad.

## Subdivision Surfaces

### `loop_subdivision`

Evaluates one iteration of Loop's algorithm

#### Parameters:

* `positions`
* `faces`
* `stars` (Optional)

#### Returns:

* `positions`
* `faces`



# Acknowledgements





