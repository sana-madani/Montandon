// utils.js

function reverseCoordinates(pair) {
  return [pair[1], pair[0]];
}

function adjustColor(color, brightness, saturation) {
  var dummy = document.createElement('div');
  dummy.style.color = color;
  dummy.style.filter = 'brightness(' + brightness + ') saturate(' + saturation + ')';
  return dummy.style.color;
}

function calculateCentralPoint(coordinates) {
  var minLat = Infinity;
  var maxLat = -Infinity;
  var minLng = Infinity;
  var maxLng = -Infinity;

  coordinates.forEach(function (coord) {
    minLat = Math.min(minLat, coord[0]);
    maxLat = Math.max(maxLat, coord[0]);
    minLng = Math.min(minLng, coord[1]);
    maxLng = Math.max(maxLng, coord[1]);
  });

  var centerLat = (minLat + maxLat) / 2;
  var centerLng = (minLng + maxLng) / 2;

  return [centerLat, centerLng];
}


function calculateCenter(coordinates) {
  //console.log(coordinates.length);
  // 计算经度和纬度的平均值
  var sumLat = 0, sumLng = 0;
  coordinates.forEach(function (coord) {
    //console.log(coord)
    sumLat += coord[0];
    sumLng += coord[1];
    //console.log([sumLat, sumLng])
  });

  var avgLat = sumLat / coordinates.length;
  var avgLng = sumLng / coordinates.length;
  console.log([avgLat, avgLng]);
  return [avgLat, avgLng];
}


function calculateCoordBounds(coordinates) {
  var latitudes = coordinates.map(coord => coord[0]);
  var longitudes = coordinates.map(coord => coord[1]);

  var minLat = Math.min(...latitudes);
  var maxLat = Math.max(...latitudes);
  var minLng = Math.min(...longitudes);
  var maxLng = Math.max(...longitudes);

  return [[minLat, minLng], [maxLat, maxLng]];
}


function grahamScan(points) {
  points.sort(function (a, b) {
    return a[1] - b[1] || a[0] - b[0];
  });

  function polarAngle(a, b, c) {
    return (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
  }

  var stack = [];
  for (var i = 0; i < points.length; i++) {
    while (stack.length >= 2 && polarAngle(stack[stack.length - 2], stack[stack.length - 1], points[i]) <= 0) {
      stack.pop();
    }
    stack.push(points[i]);
  }

  return stack;
}


function generatePointsAlongLine(X, slope, intercept, numberOfPoints) {
  var points = [];
  var minX = Math.min(...X);
  var maxX = Math.max(...X);

  for (var i = 1; i <= numberOfPoints; i++) {
    var x = minX + (i / (numberOfPoints + 1)) * (maxX - minX);
    var y = slope * x + intercept;
    points.push([x, y]);
  }

  return points;
}

function generatePoints(coordinates, numberOfPoints) {
  var X = coordinates.map(coord => coord[0]);
  var Y = coordinates.map(coord => coord[1]);

  var result = regression.linear(coordinates, { precision: 10 });
  var slope = result.equation[0];
  var intercept = result.equation[1];
  var additionalPoints = generatePointsAlongLine(X, slope, intercept, numberOfPoints);
  var updatedCoordinates = coordinates.concat(additionalPoints);
  return updatedCoordinates;

}


function sortCoordinates(coordinate) {
  const keys = Object.keys(coordinate);
  const digitKeys = {};
  const sortedCoordinates = {};

  for (const key of keys) {
    if (!/\d/.test(key) || keys.length <= 1) {
      return coordinate;
    } else {
      const digit = key.match(/\b\d+(?:\.\d+)?\b/);
      digitKeys[parseFloat(digit[0])] = key;
    }
  }

  const sortedKeys = Object.keys(digitKeys).sort((a, b) => a - b);
  for (const key of sortedKeys) {
    sortedCoordinates[digitKeys[key]] = coordinate[digitKeys[key]];
  }

  console.log(Object.keys(sortedCoordinates));
  return sortedCoordinates;
}


function generateGaussianPoints(polygon, numPoints) {
  const center = calculatePolygonCenter(polygon);
  const covarianceMatrix = calculateCovarianceMatrix(polygon, center);
  const points = [];

  for (let i = 0; i < numPoints; i++) {
    const newPoint = generateRandomPoint(center, covarianceMatrix);
    if (isPointInsidePolygon(newPoint, polygon)) {
      points.push(newPoint);
    }
  }

  return points;
}

function calculatePolygonCenter(polygon) {
  const numVertices = polygon.length;
  const center = [0, 0];

  for (const vertex of polygon) {
    center[0] += vertex[0];
    center[1] += vertex[1];
  }

  center[0] /= numVertices;
  center[1] /= numVertices;

  return center;
}


function generate_contronl_points(real_coordinates) {
  const minX = Math.min(...real_coordinates.map(function (point) { return point[0]; }));
  const maxX = Math.max(...real_coordinates.map(function (point) { return point[0]; }));
  const minY = Math.min(...real_coordinates.map(function (point) { return point[1]; }));
  const maxY = Math.max(...real_coordinates.map(function (point) { return point[1]; }));
  if (Math.abs(maxX - minX) < Math.abs(maxY - minY)) {
    var sortedCoordinates = real_coordinates.slice();
    sortedCoordinates.sort(function (a, b) {
      return a[1] - b[1];
    });
  } else {
    var sortedCoordinates = real_coordinates.slice();
    sortedCoordinates.sort(function (a, b) {
      return a[0] - b[0];
    });
  }
  return sortedCoordinates;
}


function calculateBezierPoints(points, segments) {
  var bezierPoints = [];
  for (var i = 0; i < segments; i++) {
    var t1 = i / segments;
    var t2 = (i + 1) / segments;
    var segmentPoints = calculateSegmentBezierPoints(points, t1, t2);
    bezierPoints = bezierPoints.concat(segmentPoints);
  }
  return bezierPoints;
}

function calculateSegmentBezierPoints(points, t1, t2) {
  if (points.length === 1) {
    return [points[0]];
  }

  var interpolatedPoints = [];
  for (var i = 0; i < points.length - 1; i++) {
    var x = (1 - t1) * points[i][0] + t1 * points[i + 1][0];
    var y = (1 - t1) * points[i][1] + t1 * points[i + 1][1];
    interpolatedPoints.push([x, y]);
  }

  return calculateSegmentBezierPoints(interpolatedPoints, t1, t2);
}


function generate_bezierPoints(controlPoints) {
  var segments = 100;
  var bezierPoints = calculateBezierPoints(controlPoints, segments);
  return bezierPoints;
}


function getColorForMagnitude(magnitude) {
  var minMagnitude = 0;
  var maxMagnitude = 10;

  var red = 255 * (magnitude - minMagnitude) / (maxMagnitude - minMagnitude);
  var green = 0;
  var blue = 0;

  return 'rgb(' + Math.round(red) + ', ' + Math.round(green) + ', ' + Math.round(blue) + ')';
}