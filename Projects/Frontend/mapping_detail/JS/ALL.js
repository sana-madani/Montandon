// JavaScript code as it is, without <script> tags
data = null;

// DOM
const disasterListDiv = document.getElementById('disasterList');
const disasterDetailDiv = document.getElementById('disasterDetail');
const tableBody = document.querySelector('#disasterList tbody');

// Fetch data from backend
fetch('http://127.0.0.1:5000')
  .then(response => response.json())
  .then(receivedData => {
    data = receivedData;
    console.log(data);
    displayDisasterList(data);
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });

function displayDisasterList(data) {
  // Clear the table body
  tableBody.innerHTML = '';

  // Display data in the table
  data.forEach(item => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.id}</td>
      <td>${item.name}</td>
      <td>${item.country}</td>
      <td>${item.start_date}</td>
      <td>${item.finish_date}</td>
      <td><button onclick="showDisasterDetail('${item.id}');">Show Detail</button></td>
    `;
    tableBody.appendChild(row);
  });
}

function showDisasterDetail(itemid) {
  let item = data.find(disaster => disaster.id === itemid);

  // Hide the list, display the detail
  disasterListDiv.style.display = 'none';
  disasterDetailDiv.style.display = 'flex';

  // Display the detail
  disasterDetailDiv.innerHTML = `
    <h2 id="title">Disaster Detail</h2>
    <div style="display: flex; width: 100%;">
      <div id="mapContainer" style="height: 300px; width: 48%;"></div>
      <div id="infoTable" style="width: 48%;"></div>
    </div>
    <button onclick="goBackToList()">Go back</button>
  `;

  // Initialize the map when the detail div becomes visible
  setTimeout(() => {
    initializeMap(item.coord);
    populateInfoTable(item);
  }, 0);
}

function populateInfoTable(item) {
  const infoTableDiv = document.getElementById('infoTable');
  infoTableDiv.innerHTML = `
    <table>
      <tr>
        <th>ID</th>
        <td>${item.id}</td>
      </tr>
      <tr>
        <th>Name</th>
        <td>${item.name}</td>
      </tr>
      <tr>
        <th>Country</th>
        <td>${item.country}</td>
      </tr>
      <tr>
        <th>Start Date</th>
        <td>${item.start_date}</td>
      </tr>
      <tr>
        <th>Finish Date</th>
        <td>${item.finish_date}</td>
      </tr>
    </table>
  `;
}

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
  var gradient = { 0.05: 'orange', 0.2: 'red', 0.3: 'darkred' };
  Object.keys(gradient).forEach(function (key) {
    var color = gradient[key];
    gradient[key] = adjustColor(color, 0.8, 1.2); // Adjust brightness and saturation
  });
  var heatmapLayer = L.heatLayer(coordinates, { radius: 15, blur: 5, gradient: gradient }).addTo(map);
}

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
