
function kis(poly, n) {     // only kis n-sided faces, but n==0 means kiss all.
   state ("Taking kis of " + (n==0?"":n + "-sided faces of ") + poly.name + "...");
   newPoly();
   for (var i=0; i<poly.positions.length; i++) 
       newV("v"+i, poly.positions[i]);              // each old vertex is a new vertex
   var centers = faceCenters(poly);           // new vertices in centers of n-sided face
   var foundAny = false;                      // alert if don't find any
   for (var i=0; i<poly.face.length; i++) {
       var v1 = "v" + poly.face[i][poly.face[i].length-1];  // previous vertex
       for (j=0; j<poly.face[i].length; j++)  {
           var v2 = "v" + poly.face[i][j];                  // this vertex
           if (poly.face[i].length == n || n==0) {    // kiss the n's, or all
              foundAny = true;                // flag that we found some
              newV("f"+i, centers[i]);        // new vertex in face center
              var fname = i + v1;             
              newFlag(fname, v1, v2);         // three new flags, if n-sided
              newFlag(fname, v2, "f"+i);
              newFlag(fname, "f"+i, v1);
              }
           else
              newFlag(i, v1, v2);             // same old flag, if non-n
           v1 = v2;                           // current becomes previous
           }
       }
   if (!foundAny)
      alert ("No "+n+"-fold components were found.");
   var ans = flags2poly();
   ans.name = "k" + (n==0?"":n) + poly.name;
   ans.positions = adjustpositions(ans, 3);               // adjust and
//   ans.positions = canonicalpositions(ans, 3);            // canonicalize lightly
   return (ans);
   }

function ambo(poly) {                      // compute ambo of argument
   state ("Taking ambo of " + poly.name + "...");
   newPoly();
   for (var i=0; i<poly.face.length; i++) {
       var v1 = poly.face[i][poly.face[i].length-2];  // preprevious vertex
       var v2 = poly.face[i][poly.face[i].length-1];  // previous vertex
       for (var j=0; j<poly.face[i].length; j++)  {
           var v3 = poly.face[i][j];        // this vertex
           if (v1 < v2)                     // new vertices at edge midpoints
              newV(midName(v1,v2), midpoint(poly.positions[v1],poly.positions[v2]));
           newFlag("f"+i, midName(v1,v2), midName(v2,v3));     // two new flags
           newFlag("v"+v2, midName(v2,v3), midName(v1,v2));
           v1 = v2;                         // shift over one
           v2 = v3;
           }
       }
   var ans = flags2poly();
   ans.name = "a" + poly.name;
   ans.positions = adjustpositions(ans, 2);             // canonicalize lightly
   return (ans);
   }

function midName(v1,v2) {              // unique symbolic name, e.g. "1_2"
   if (v1<v2)
      return (v1 + "_" + v2);
   else
      return (v2 + "_" + v1);
   }

function gyro(poly) {                      // compute gyro of argument
   state ("Taking gyro of " + poly.name + "...");
   newPoly();
   for (var i=0; i<poly.positions.length; i++) 
       newV("v"+i, unit(poly.positions[i]));           // each old vertex is a new vertex
   var centers = faceCenters(poly);              // new vertices in center of each face
   for (var i=0; i<poly.face.length; i++) 
       newV("f"+i, unit(centers[i]));
   for (var i=0; i<poly.face.length; i++) {
       var v1 = poly.face[i][poly.face[i].length-2];  // preprevious vertex
       var v2 = poly.face[i][poly.face[i].length-1];  // previous vertex
       for (j=0; j<poly.face[i].length; j++)  {
           var v3 = poly.face[i][j];                  // this vertex
           newV(v1+"~"+v2, oneThird(poly.positions[v1],poly.positions[v2]));  // new v in face
           var fname = i + "f" + v1;
           newFlag(fname, "f"+i, v1+"~"+v2);          // five new flags
           newFlag(fname, v1+"~"+v2, v2+"~"+v1);
           newFlag(fname, v2+"~"+v1, "v"+v2);
           newFlag(fname, "v"+v2, v2+"~"+v3);
           newFlag(fname, v2+"~"+v3, "f"+i);
           v1 = v2;                                   // shift over one
           v2 = v3;
           }
       }
   var ans = flags2poly();
   ans.name = "g" + poly.name;
   ans.positions = adjustpositions(ans, 3);                       // canonicalize lightly
   return (ans);
   }

function propellor(poly) {                             // compute propellor of argument
   state ("Taking propellor of " + poly.name + "...");
   newPoly();
   for (var i=0; i<poly.positions.length; i++) 
       newV("v"+i, unit(poly.positions[i]));           // each old vertex is a new vertex
   for (var i=0; i<poly.face.length; i++) {
       var v1 = poly.face[i][poly.face[i].length-2];  // preprevious vertex
       var v2 = poly.face[i][poly.face[i].length-1];  // previous vertex
       for (j=0; j<poly.face[i].length; j++)  {
           var v3 = poly.face[i][j];                  // this vertex
           newV(v1+"~"+v2, oneThird(poly.positions[v1],poly.positions[v2]));  // new v in face
           var fname = i + "f" + v2;
           newFlag("v"+i, v1+"~"+v2, v2+"~"+v3);      // five new flags
           newFlag(fname, v1+"~"+v2, v2+"~"+v1);
           newFlag(fname, v2+"~"+v1, "v"+v2);
           newFlag(fname, "v"+v2, v2+"~"+v3);
           newFlag(fname, v2+"~"+v3, v1+"~"+v2);
           v1 = v2;                                   // shift over one
           v2 = v3;
           }
       }
   var ans = flags2poly();
   ans.name = "p" + poly.name;
   ans.positions = adjustpositions(ans, 3);                       // canonicalize lightly
   return (ans);
   }

function reflect(poly) {                              // compute reflection through origin
   state ("Taking reflection of " + poly.name + "...");
   for (var i=0; i<poly.positions.length; i++)   
       poly.positions[i] = mult(-1, poly.positions[i]);           // reflect each point
   for (var i=0; i<poly.face.length; i++) 
       poly.face[i] = poly.face[i].reverse();         // repair clockwise-ness
   poly.name = "r" + poly.name;
   poly.positions = adjustpositions(poly, 1);                     // build dual
   return (poly);
   }
