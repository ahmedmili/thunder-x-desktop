declare module 'point-in-polygon' {
    function pointInPolygon(point: [number, number], polygon: Array<[number, number]>): boolean;
    export = pointInPolygon;
  }