// api.js
let data = null;
const itemsPerPage = 2;
let currentPage = 1;

function fetchData() {
  return fetch('http://127.0.0.1:5000')
    .then(response => response.json())
    .then(receivedData => {
      data = receivedData;
      create_all_Containers();
      console.log(data);
      displayDisasterList(data);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
}

// function displayDisasterList(data) {
//   // Clear the table body
//   tableBody.innerHTML = '';
//   // Display data in the table
//   const disasters = data.slice(1);
//   disasters.forEach(item => {
//     const row = document.createElement('tr');
//     row.innerHTML = `
//       <td>${item.id}</td>
//       <td>${item.name}</td>
//       <td>${item.country}</td>
//       <td>${item.start_date}</td>
//       <td>${item.finish_date}</td>
//       <td><button onclick="showDisasterDetail('${item.id}');">Show Detail</button></td>
//     `;
//     tableBody.appendChild(row);
//   });
// }
function displayDisasterList(data) {
  // Clear the table body
  tableBody.innerHTML = '';

  // Display data in the table based on the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const disasters = data.slice(1);

  for (let i = startIndex; i < endIndex && i < disasters.length; i++) {
    const item = disasters[i];
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
  }

  // Display pagination links
  displayPagination(disasters.length);
}

function displayPagination(totalItems) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginationElement = document.getElementById('pagination');
  paginationElement.innerHTML = '';

  for (let i = 1; i <= totalPages; i++) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = '#';
    a.textContent = i;
    a.onclick = () => {
      currentPage = i;
      console.log(data);
      displayDisasterList(data);
    };
    li.appendChild(a);
    paginationElement.appendChild(li);
  }
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
      <tr>
        <th>Disaster Type</th>
        <td>${item.type}</td>
      </tr>
      <tr>
        <th>Max Value</th>
        <td>${item.max_value}</td>
      </tr>
      <tr>
        <th>Unit</th>
        <td>${item.maxunit_code}</td>
      </tr>
    </table>
  `;
}
