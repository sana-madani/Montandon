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
  disasterListDiv.style.display = 'block';
  disasterDetailDiv.style.display = 'none';
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
