"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var __defProp=Object.defineProperty,__name=(e,o)=>__defProp(e,"name",{value:o,configurable:!0}),_meta=require("@turf/meta");function bbox(e,o={}){if(null!=e.bbox&&!0!==o.recompute)return e.bbox;const r=[1/0,1/0,-1/0,-1/0];return _meta.coordEach.call(void 0,e,(e=>{r[0]>e[0]&&(r[0]=e[0]),r[1]>e[1]&&(r[1]=e[1]),r[2]<e[0]&&(r[2]=e[0]),r[3]<e[1]&&(r[3]=e[1])})),r}__name(bbox,"bbox");var turf_bbox_default=bbox;exports.bbox=bbox,exports.default=turf_bbox_default;