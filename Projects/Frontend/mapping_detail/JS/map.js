// map.js
var points = [];
var total_coordinates = [];


function initializeMap(coord, disaster_type, name) {
  var southWest = L.latLng(-90, -180);
  var northEast = L.latLng(90, 180);
  var bounds = L.latLngBounds(southWest, northEast);
  let keysArray = Object.keys(coord);
  var center = calculateCentralPoint(coord[keysArray[0]]);
  var map = L.map('mapContainer', { center: center, zoom: 3, maxBounds: bounds });
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    className: 'monochrome-tile-layer' // Add a class to the tile layer
  }).addTo(map);
  var points_layer = L.layerGroup();
  points_layer.addTo(map);
  var polygon_layer = L.layerGroup();
  polygon_layer.addTo(map);
  var line_layer = L.layerGroup();
  line_layer.addTo(map);

  if (disaster_type === "Earthquake") {
    loop_coordinates(line_layer, polygon_layer, coord, disaster_type, name);
  }
  else if (disaster_type === "Tropical cyclone") {
    loop_coordinates(line_layer, polygon_layer, coord, disaster_type, name);
  }
  else {
    loop_coordinates(line_layer, polygon_layer, coord, disaster_type, name);
  }
  var bounds = calculateCoordBounds(coord[keysArray[0]].map(reverseCoordinates));
  map.fitBounds(bounds);
}

// loop the different labels with coordinates
function loop_coordinates(line_layer, polygon_layer, coord, disaster_type, name) {
  coord = sortCoordinates(coord);
  for (const label in coord) {
    coordinates = coord[label];
    var real_coordinates = coordinates.map(reverseCoordinates);
    total_coordinates = total_coordinates.concat(real_coordinates);
    if (disaster_type === "Earthquake") {
      var intensity = Number((label.match(/\d+(\.\d+)?/g))[0]); // extract intensity number
      var color = getColorForMagnitude(intensity);
    }
    else if (disaster_type === "Tropical cyclone") {
      var speed = Number((label.match(/\d+(\.\d+)?/g))[0]);
      if (speed >= 100) {
        var color = "red";
      }
      else if (speed >= 70) {
        var color = "orange";
      }
      else {
        var color = "green";
        const control_coordinates = generate_contronl_points(real_coordinates);
        const bezierPoints = generate_bezierPoints(control_coordinates);
        initializeMap_line(line_layer, bezierPoints);
      }
    }
    else {
      var color = "blue";
    }
    initializeMap_polygon(polygon_layer, real_coordinates, color, label, name);
  }
}


// plot the cyclone line using bezier curve
function initializeMap_line(line_layer, bezierPoints) {
  L.polyline(bezierPoints, { color: 'yellow' }).addTo(line_layer);
}

// plot single/multiple polygons
function initializeMap_polygon(polygon_layer, coordinates, color1, l, name) {
  var convexHullPolygon = L.polygon(coordinates, { color: color1 });
  convexHullPolygon.bindPopup("<b><span style='font-size: 16px;'>" +
    name + "</span></b><br>" + l).openPopup();
  convexHullPolygon.addTo(polygon_layer);
}


