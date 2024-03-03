// map.js

function initializeMap(coord, disaster_type) {
  var southWest = L.latLng(-90, -180);
  var northEast = L.latLng(90, 180);
  var bounds = L.latLngBounds(southWest, northEast);
  let keysArray = Object.keys(coord);
  var center = calculateCentralPoint(coord[keysArray[0]]);
  var map = L.map('mapContainer', { center: center, zoom: 3, maxBounds: bounds });
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
  var points_layer = L.layerGroup();
  points_layer.addTo(map);
  var polygon_layer = L.layerGroup();
  polygon_layer.addTo(map);
  var line_layer = L.layerGroup();
  line_layer.addTo(map);

  if (disaster_type === "Earthquake") {
    loop_coordinates(line_layer, points_layer, polygon_layer, coord, disaster_type);
  }
  else if (disaster_type === "Tropical cyclone") {
    loop_coordinates(line_layer, points_layer, polygon_layer, coord, disaster_type);
  }
  else {
    loop_coordinates(line_layer, points_layer, polygon_layer, coord, disaster_type);
  }



  //initializeMap_polygon(polygon_layer, coordinates);
  //initializeMap_Points(points_layer, coordinates);
  //initializeMap_multiPolygon(multipolygon_layer, coordinates);
  var bounds = calculateCoordBounds(coord[keysArray[0]].map(reverseCoordinates));
  map.fitBounds(bounds);

  //   L.control.layers(null, {
  //     'Line Layer': line_layer,
  //     'Polynomial Layer': polygon_layer,
  //     'Points Layer': points_layer,
  //     'MultiPolygon Layer': multipolygon_layer
  //   }).addTo(map);
}

function loop_coordinates(line_layer, points_layer, polygon_layer, coord, disaster_type) {
  for (let l in coord) {
    if (disaster_type === "Earthquake") {
      var intensity = Number((l.match(/\d+(\.\d+)?/g))[0]); // extract intensity number
      if (intensity >= 7) {
        var color = "red";
      }
      else if (intensity >= 5) {
        var color = "yellow";
      }
      else {
        var color = "green";
      }
      var coordinates = coord[l].map(reverseCoordinates);
      //initializeMap_Points(points_layer, coordinates);
      initializeMap_polygon(polygon_layer, coordinates, color);
    }
    else if (disaster_type === "Tropical cyclone") {
      var speed = Number((l.match(/\d+(\.\d+)?/g))[0]);
      var coordinates = coord[l].map(reverseCoordinates);
      if (speed >= 100) {
        var color = "red";
        console.log("coords", coordinates);
        console.log('coord:', coordinates[0], coordinates[coordinates.length - 2])
        initializeMap_Points(points_layer, [coordinates[0], coordinates[coordinates.length - 1]]);
        //initializeMap_line(line_layer, sorted_coordinates);
        initializeMap_polygon(polygon_layer, coordinates, color);
      }
      else if (speed >= 70) {
        var color = "yellow";
      }
      else {
        var color = "green";
      }
      var sorted_coordinates = coordinates.slice();
      sorted_coordinates = sorted_coordinates.sort((a, b) => a[1] - b[1])
      //let startPoint = sorted_coordinates[0]//.reduce((maxPoint, currentPoint) => maxPoint[1] > currentPoint[1] ? maxPoint : currentPoint);
      //let endPoint = sorted_coordinates[sorted_coordinates.length - 1]//.reduce((minPoint, currentPoint) => minPoint[1] < currentPoint[1] ? minPoint : currentPoint);

      var convexVertices = coordinates;
      //initializeMap_Points(points_layer, [coordinates[0], coordinates[coordinates.length - 1]]);
      //initializeMap_line(line_layer, sorted_coordinates);
      //initializeMap_polygon(polygon_layer, coordinates, color);
    }
    else {
      var color = "red";
      var coordinates = coord[l].map(reverseCoordinates);
      //initializeMap_Points(points_layer, coordinates);
      initializeMap_polygon(polygon_layer, coordinates, color);
    }

  }
}



function initializeMap_line(line_layer, dataPoints) {
  let xValues = dataPoints.map(point => point[0]);
  let yValues = dataPoints.map(point => point[1]);
  // var curvePath = calculateConvexBezierCurve(startPoint, endPoint, convexVertices);
  let result = regression.polynomial(dataPoints, { order: 4 });
  let coefficients = result.equation;
  console.log("coefficients", coefficients);
  let minX = Math.min(...xValues);
  let maxX = Math.max(...xValues);
  // 生成拟合曲线上的点
  let fittedPoints = [];
  for (let x = minX; x <= maxX; x += 0.1) {
    let y = 0;
    for (let i = 0; i < coefficients.length; i++) {
      y += coefficients[i] * Math.pow(x, coefficients.length - 1 - i);
    }
    fittedPoints.push([x, y]);
  }

  // 在 Leaflet 地图上绘制坐标点
  dataPoints.slice(0, 50).forEach(coord => {
    L.circle(coord, { radius: 500, color: 'blue' }).addTo(line_layer);
  });
  fittedPoints.slice(0, 50).forEach(coord => {
    L.circle(coord, { radius: 500, color: 'black' }).addTo(line_layer);
  });
  //var polyline1 = L.polyline(dataPoints, { color: 'yellow' });
  //var polyline = L.polyline(fittedPoints, { color: 'blue' });
  //polyline1.addTo(line_layer);
  //polyline.addTo(line_layer);
}

function initializeMap_polygon(polygon_layer, coordinates, color1) {
  //var convexHuallVertices = turf.convex(turf.points(coordinates));//convexHuallVertices.geometry.coordinates
  var convexHullPolygon = L.polygon(coordinates, { color: color1 });
  convexHullPolygon.addTo(polygon_layer);
}


function initializeMap_Points(points_layer, coordinates) {
  coordinates.forEach(function (coord) {
    var coordString = coord.toString();
    var redMarker = L.marker(coord, { icon: L.divIcon({ className: 'red-marker' }) }).addTo(points_layer);
    redMarker.bindPopup(coordString).openPopup();
  })


}


function initializeMap_multiPolygon(multipolygon_layer, coordinates) {
  var earthquakeData = intensity_coordinates(coordinates, 3);
  var earthquakeData = intensity_group(earthquakeData);
  console.log(earthquakeData);
  // Create a color scale based on intensity using Chroma.js
  var colorScale = chroma.scale(['#ffffb2', '#fecc5c', '#fd8d3c', '#e31a1c']).domain([0, 10]);

  // Add earthquake polygons to the map
  // earthquakeData.forEach(function (quake) {
  //   var polygon = L.polygon(quake.coordinates, {
  //     color: 'black',  // Border color
  //     fillColor: colorScale(quake.intensity).hex(),  // Fill color based on intensity
  //     fillOpacity: 0.7,
  //     radius: 50000
  //   });
  //   polygon.addTo(multipolygon_layer);
  //   //});
  // })
  earthquakeData.forEach(function (quake) {
    if (quake.intensity === 3) {
      color1 = 'green';
    }
    else if (quake.intensity === 5) {
      color1 = 'yellow';
    }
    else {
      color1 = 'red'
    }

    quake.coordinates.forEach(function (coord) {
      var circleMarker = L.circleMarker(coord, { color: color1, radius: 8 });
      circleMarker.addTo(multipolygon_layer);
    })
    //});
  })
}
