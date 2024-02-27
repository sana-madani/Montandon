// map.js
function initializeMap(coord) {
  var southWest = L.latLng(-90, -180);
  var northEast = L.latLng(90, 180);
  var bounds = L.latLngBounds(southWest, northEast);
  var coordinates = coord.map(reverseCoordinates);

  // Calculate the center of the circle based on the densest point
  var center = calculateCentralPoint(coordinates);

  var map = L.map('mapContainer', { center: center, zoom: 3, maxBounds: bounds });
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

  // Create a heatmap using L.heatLayer
  //map = initializeMap_polygon(map, coordinates);
  map = initializeMap_line(map, coordinates);

}


function initializeMap_line(map, coordinates) {
  var xData = coordinates.map(coord => coord[0]);
  var yData = coordinates.map(coord => coord[1]);
  var result = regression.polynomial(coordinates, { order: 2, precision: 200 });
  var regressionLine = result.points.map(point => [point[0], point[1]]);

  var polyline = L.polyline(regressionLine, { color: 'red' }).addTo(map);
  map.fitBounds(polyline.getBounds());

}

function initializeMap_polygon(map, coordinates) {
  var gradient = { 0.05: 'orange', 0.2: 'red', 0.3: 'darkred' };
  Object.keys(gradient).forEach(function (key) {
    var color = gradient[key];
    gradient[key] = adjustColor(color, 0.8, 1.2); // Adjust brightness and saturation
  });
  var heatmapLayer = L.heatLayer(coordinates, { radius: 15, blur: 5, gradient: gradient }).addTo(map);
  return map;
}


function hasDuplicateCoordinates(coordinates) {
  // 使用 Set 来检查坐标数组中是否有重复
  const uniqueCoordinates = new Set(coordinates.map(coord => coord.join(',')));

  // 如果存在重复坐标，则数组长度和 Set 大小不一致
  return coordinates.length !== uniqueCoordinates.size;
}

