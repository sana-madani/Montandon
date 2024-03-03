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

function goBackToList() {
  // Back to the list page
  disasterListContainer.style.display = 'block';
  disasterDetailContainer.style.display = 'none';
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



function rotatingCalipers(points) {
  const n = points.length;
  if (n < 3) {
    return points;
  }

  // 寻找初始边
  let minOrientation = Infinity;
  let baseEdge = [points[0], points[1]];

  for (let i = 2; i < n; i++) {
    const orientation = findOrientation(points[0], points[1], points[i]);
    if (orientation < minOrientation) {
      minOrientation = orientation;
      baseEdge = [points[0], points[i]];
    }
  }

  // 初始化最大面积
  let maxArea = 0;
  let convexHull = [];

  // 旋转卡壳
  let i = 0;
  let j = 1;
  while (i < n) {
    const nextI = (i + 1) % n;
    const nextJ = (j + 1) % n;

    const orientationI = findOrientation(baseEdge[0], baseEdge[1], points[nextI]);
    const orientationJ = findOrientation(baseEdge[0], baseEdge[1], points[nextJ]);

    // 计算当前凸包的面积
    const area = Math.abs(findOrientation(baseEdge[0], baseEdge[1], points[i]));

    // 如果点 i 在当前边上，则尝试移动 i
    if (orientationI < orientationJ) {
      i = nextI;
    }
    // 如果点 j 在当前边上，则尝试移动 j
    else if (orientationI > orientationJ) {
      j = nextJ;
    }
    // 如果边界没有改变，则尝试移动两个点
    else {
      i = nextI;
      j = nextJ;
    }

    // 更新最大面积的凸包
    if (area > maxArea) {
      maxArea = area;
      convexHull = [baseEdge[0], points[i], points[j]];
    }
  }

  return convexHull;
}

// 辅助函数：计算三个点的方向
function findOrientation(p, q, r) {
  const val = (q[1] - p[1]) * (r[0] - q[0]) - (q[0] - p[0]) * (r[1] - q[1]);
  if (val === 0) return 0; // 平行
  return val > 0 ? 1 : 2; // 顺时针或逆时针
}


function design_earthquake(earthquakeData, layer) {
  // Create a color scale based on intensity using Chroma.js
  var colorScale = chroma.scale(['#ffffb2', '#fecc5c', '#fd8d3c', '#e31a1c']).domain([0, 10]);

  // Add earthquake polygons to the map
  earthquakeData.forEach(function (quake) {
    var polygon = L.polygon(quake.coordinates, {
      color: 'red',  // Border color
      fillColor: colorScale(quake.intensity).hex(),  // Fill color based on intensity
      fillOpacity: 0.7
    }).addTo(layer);
  });

}


// k-means
function intensity_coordinates(coordinates, numberOfClusters) {
  const result = kmeans(coordinates, numberOfClusters);
  const clusters = result.assignments;
  const intensityMapping = {
    0: 3,
    1: 5,
    2: 7
  };

  const earthquakeData = coordinates.map((coord, index) => ({
    coordinates: coord,
    intensity: intensityMapping[clusters[index]]
  }));

  return earthquakeData;
}




// 定义计算凸多边形贝塞尔曲线路径的函数
function calculateConvexBezierCurve(startPoint, endPoint, convexVertices) {
  let curvePath = [];

  // 将起点、凸多边形顶点、终点添加到路径中
  let allPoints = [startPoint, ...convexVertices, endPoint];

  // 计算贝塞尔曲线的路径
  for (let t = 0; t <= 1; t += 0.1) {
    let x = calculateBezierPoint(allPoints.map(point => point[0]), t);
    let y = calculateBezierPoint(allPoints.map(point => point[1]), t);
    curvePath.push([x, y]);
  }

  return curvePath;
}

// 计算贝塞尔曲线上某点的值
function calculateBezierPoint(points, t) {
  let n = points.length - 1;
  let result = 0;
  for (let i = 0; i <= n; i++) {
    result += binomialCoefficient(n, i) * (1 - t) ** (n - i) * t ** i * points[i];
  }
  return result;
}

// 计算二项式系数
function binomialCoefficient(n, k) {
  let numerator = factorial(n);
  let denominator = factorial(k) * factorial(n - k);
  //if (denominator === 0) {
  console.log(numerator, denominator);
  //}
  return numerator / denominator;
}

// 计算阶乘
function factorial(n) {
  if (n === 0 || n === 1) {
    return 1;
  } else {
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
      // 如果结果已经很大，可以适时截断
      if (result > Number.MAX_SAFE_INTEGER) {
        return result;
      }
    }
    return result;
  }
}