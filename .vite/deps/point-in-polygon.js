import {
  __commonJS
} from "./chunk-AUZ3RYOM.js";

// node_modules/point-in-polygon/flat.js
var require_flat = __commonJS({
  "node_modules/point-in-polygon/flat.js"(exports, module) {
    module.exports = function pointInPolygonFlat(point, vs, start, end) {
      var x = point[0], y = point[1];
      var inside = false;
      if (start === void 0)
        start = 0;
      if (end === void 0)
        end = vs.length;
      var len = (end - start) / 2;
      for (var i = 0, j = len - 1; i < len; j = i++) {
        var xi = vs[start + i * 2 + 0], yi = vs[start + i * 2 + 1];
        var xj = vs[start + j * 2 + 0], yj = vs[start + j * 2 + 1];
        var intersect = yi > y !== yj > y && x < (xj - xi) * (y - yi) / (yj - yi) + xi;
        if (intersect)
          inside = !inside;
      }
      return inside;
    };
  }
});

// node_modules/point-in-polygon/nested.js
var require_nested = __commonJS({
  "node_modules/point-in-polygon/nested.js"(exports, module) {
    module.exports = function pointInPolygonNested(point, vs, start, end) {
      var x = point[0], y = point[1];
      var inside = false;
      if (start === void 0)
        start = 0;
      if (end === void 0)
        end = vs.length;
      var len = end - start;
      for (var i = 0, j = len - 1; i < len; j = i++) {
        var xi = vs[i + start][0], yi = vs[i + start][1];
        var xj = vs[j + start][0], yj = vs[j + start][1];
        var intersect = yi > y !== yj > y && x < (xj - xi) * (y - yi) / (yj - yi) + xi;
        if (intersect)
          inside = !inside;
      }
      return inside;
    };
  }
});

// node_modules/point-in-polygon/index.js
var require_point_in_polygon = __commonJS({
  "node_modules/point-in-polygon/index.js"(exports, module) {
    var pointInPolygonFlat = require_flat();
    var pointInPolygonNested = require_nested();
    module.exports = function pointInPolygon(point, vs, start, end) {
      if (vs.length > 0 && Array.isArray(vs[0])) {
        return pointInPolygonNested(point, vs, start, end);
      } else {
        return pointInPolygonFlat(point, vs, start, end);
      }
    };
    module.exports.nested = pointInPolygonNested;
    module.exports.flat = pointInPolygonFlat;
  }
});
export default require_point_in_polygon();
//# sourceMappingURL=point-in-polygon.js.map