"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var __defProp=Object.defineProperty,__name=(e,t)=>__defProp(e,"name",{value:t,configurable:!0}),_distance=require("@turf/distance"),_helpers=require("@turf/helpers"),_invariant=require("@turf/invariant"),_meta=require("@turf/meta"),_rhumbdistance=require("@turf/rhumb-distance");function pointToLineDistance(e,t,n={}){if(n.method||(n.method="geodesic"),n.units||(n.units="kilometers"),!e)throw new Error("pt is required");if(Array.isArray(e)?e=_helpers.point.call(void 0,e):"Point"===e.type?e=_helpers.feature.call(void 0,e):_invariant.featureOf.call(void 0,e,"Point","point"),!t)throw new Error("line is required");Array.isArray(t)?t=_helpers.lineString.call(void 0,t):"LineString"===t.type?t=_helpers.feature.call(void 0,t):_invariant.featureOf.call(void 0,t,"LineString","line");let i=1/0;const r=e.geometry.coordinates;return _meta.segmentEach.call(void 0,t,(e=>{const t=e.geometry.coordinates[0],o=e.geometry.coordinates[1],a=distanceToSegment(r,t,o,n);a<i&&(i=a)})),_helpers.convertLength.call(void 0,i,"degrees",n.units)}function distanceToSegment(e,t,n,i){const r=[n[0]-t[0],n[1]-t[1]],o=dot([e[0]-t[0],e[1]-t[1]],r);if(o<=0)return calcDistance(e,t,{method:i.method,units:"degrees"});const a=dot(r,r);if(a<=o)return calcDistance(e,n,{method:i.method,units:"degrees"});const c=o/a;return calcDistance(e,[t[0]+c*r[0],t[1]+c*r[1]],{method:i.method,units:"degrees"})}function dot(e,t){return e[0]*t[0]+e[1]*t[1]}function calcDistance(e,t,n){return"planar"===n.method?_rhumbdistance.rhumbDistance.call(void 0,e,t,n):_distance.distance.call(void 0,e,t,n)}__name(pointToLineDistance,"pointToLineDistance"),__name(distanceToSegment,"distanceToSegment"),__name(dot,"dot"),__name(calcDistance,"calcDistance");var turf_point_to_line_distance_default=pointToLineDistance;exports.default=turf_point_to_line_distance_default,exports.pointToLineDistance=pointToLineDistance;