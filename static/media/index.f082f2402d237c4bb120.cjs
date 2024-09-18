"use strict";function _interopRequireDefault(o){return o&&o.__esModule?o:{default:o}}Object.defineProperty(exports,"__esModule",{value:!0});var __defProp=Object.defineProperty,__name=(o,n)=>__defProp(o,"name",{value:n,configurable:!0}),_pointinpolygonhao=require("point-in-polygon-hao"),_pointinpolygonhao2=_interopRequireDefault(_pointinpolygonhao),_invariant=require("@turf/invariant");function booleanPointInPolygon(o,n,e={}){if(!o)throw new Error("point is required");if(!n)throw new Error("polygon is required");const i=_invariant.getCoord.call(void 0,o),t=_invariant.getGeom.call(void 0,n),r=t.type,l=n.bbox;let a=t.coordinates;if(l&&!1===inBBox(i,l))return!1;"Polygon"===r&&(a=[a]);let _=!1;for(var u=0;u<a.length;++u){const o=_pointinpolygonhao2.default.call(void 0,i,a[u]);if(0===o)return!e.ignoreBoundary;o&&(_=!0)}return _}function inBBox(o,n){return n[0]<=o[0]&&n[1]<=o[1]&&n[2]>=o[0]&&n[3]>=o[1]}__name(booleanPointInPolygon,"booleanPointInPolygon"),__name(inBBox,"inBBox");var turf_boolean_point_in_polygon_default=booleanPointInPolygon;exports.booleanPointInPolygon=booleanPointInPolygon,exports.default=turf_boolean_point_in_polygon_default;