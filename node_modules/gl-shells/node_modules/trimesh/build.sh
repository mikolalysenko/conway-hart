#!/bin/sh
mkdir build
./node_modules/browserify/bin/cmd.js ./client.js -o ./build/trimesh.js
./node_modules/uglify-js/bin/uglifyjs < ./build/trimesh.js > ./build/trimesh.js.min

