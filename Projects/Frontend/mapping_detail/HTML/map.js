// 创建 Leaflet 地图
var map = L.map('map').setView([51.505, -0.09], 13);

// 添加地图图层
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// 生成均匀分布的点的函数
function generatePointsOnEdges(points) {

  // 存储生成的点
  var generatedPoints = [];

  // 遍历多边形上的点，处理每一条边
  for (var i = 0; i < points.length - 1; i++) {
    var startPoint = points[i];
    var endPoint = points[i + 1];

    // 根据边的起点和终点，在这两个点之间生成均匀分布的点
    var numPoints = 10; // 生成点的数量，可以根据需要调整
    for (var j = 1; j < numPoints; j++) {
      var x = startPoint[0] + (endPoint[0] - startPoint[0]) * (j / numPoints);
      var y = startPoint[1] + (endPoint[1] - startPoint[1]) * (j / numPoints);
      generatedPoints.push([x, y]);
    }
  }

  // 将生成的点合并到原始点数组中
  points.push(...generatedPoints);

  // 对合并后的点数组再次进行排序
  points.sort((a, b) => a[0] - b[0]);

  return points;
}

// 示例：多边形上的点的二维数组
var points = [
  [0, 0], [10, 0], [10, 10], [0, 10]
];

var polyline = L.polyline(points, { color: 'blue' }).addTo(map);


// 生成均匀分布的点
var resultPoints = generatePointsOnEdges(points);

resultPoints.forEach(point => {
  L.marker(point).addTo(map);
});
