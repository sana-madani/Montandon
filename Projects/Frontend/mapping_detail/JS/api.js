// api.js
let data = null;
const itemsPerPage = 15;
let currentPage = 1;


function fetchData() {
  return fetch('http://127.0.0.1:5000')
    .then(response => response.json())
    .then(receivedData => {
      data = receivedData;
      createContainers(data);
      create_all_Containers();
      createENDContainer();
      console.log(data);
      displayDisasterList(data);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
}

function createContainers(data) {
  createAndAppendElements(data);
  globalThis.disasterListContainer = document.getElementById('disasterList');
  globalThis.disasterDetailContainer = document.getElementById('disasterDetail');
  globalThis.search_Container = document.getElementById('search_Container');
  globalThis.END_Container = document.getElementById('END_Container');
  globalThis.tableBody = document.querySelector('#disasterList tbody');
}


// Function to create and append HTML elements
function createAndAppendElements(data) {
  const number_of_disaster = data.length - 1;


  // Get the body element
  globalThis.body = document.body;

  //create Search Container
  globalThis.search_Container = document.createElement('div');
  search_Container.id = 'search_Container';
  search_Container.className = 'ifrc-style';

  globalThis.END_Container = document.createElement('div');
  END_Container.id = 'END_Container';

  // Create disasterList div
  globalThis.disasterListContainer = document.createElement('div');
  disasterListContainer.id = 'disasterList';
  disasterListContainer.className = 'ifrc-style';
  disasterListContainer.innerHTML = `
    <h2 class="centered-h2">All Events(${number_of_disaster})</h2>
    <span><a href="/Projects/Frontend/landing_page/index.html">Home </a> <span> > </span> <a href = "/Projects/Frontend/mapping_detail/HTML/interactive_mapping.html">Events</a></span>
    <div id="search_Container"></div>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Disaster Type</th>
          <th>Country</th>
          <th>Start Date</th>
          <th>Finish Date</th>
        </tr>
      </thead>
      <tbody>
      </tbody>
    </table>
    <div id="paginationContainer">
      <ul id="pagination" class="pagination"></ul>
    </div>
  `;
  //disasterListContainer.appendChild(END_Container);
  body.appendChild(disasterListContainer);

  // Create disasterDetail div
  globalThis.disasterDetailContainer = document.createElement('div');
  disasterDetailContainer.id = 'disasterDetail';
  disasterDetailContainer.style.display = 'none';
  disasterDetailContainer.className = 'ifrc-style';
  body.appendChild(disasterDetailContainer);

  body.appendChild(END_Container);

}

function displayDisasterList(data) {
  // Clear the table body
  tableBody.innerHTML = '';


  // Display data in the table based on the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const disasters = data.slice(1);

  for (let i = startIndex; i < endIndex && i < disasters.length; i++) { //length+1000
    const item = disasters[i];
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="clickable-name" onclick="showDisasterDetail('${item.id}');">${item.name}</td>
      <td>${item.type}</td>
      <td>${item.country}</td>
      <td>${item.start_date}</td>
      <td>${item.finish_date}</td>
      `;
    tableBody.appendChild(row);
  }
  // Display pagination links
  displayPagination(disasters.length);// + 1000);
}



function displayPagination(totalItems) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginationElement = document.getElementById('pagination');
  paginationElement.innerHTML = '';

  const maxPagesToShow = 6; // Adjust the total number of pages to show

  let startPage, endPage;

  if (totalPages <= maxPagesToShow) {
    startPage = 1;
    endPage = totalPages;
  } else {
    if (currentPage <= 3) {
      startPage = 1;
      endPage = Math.min(maxPagesToShow - 1, totalPages); // Limit max display to 5 pages for the first three pages
    } else if (currentPage >= totalPages - 3) {
      startPage = totalPages - 4;
      endPage = totalPages;
    } else {
      startPage = currentPage - 1;
      endPage = currentPage + 2;
    }
  }

  if (currentPage > 3) {
    // Always display the first page
    const firstPage = document.createElement('li');
    const firstPageLink = document.createElement('a');
    firstPageLink.href = '#';
    firstPageLink.textContent = 1;
    firstPageLink.onclick = () => {
      currentPage = 1;
      console.log(data);
      displayDisasterList(data);
    };
    if (totalPages > 6) {
      paginationElement.appendChild(firstPage);
      firstPage.appendChild(firstPageLink);
    }
    // Add ellipsis after the first page if necessary
    if (startPage > 2) {
      const firstEllipsis = document.createElement('span');
      firstEllipsis.textContent = '...';
      paginationElement.appendChild(firstEllipsis);
    }
  }

  for (let i = startPage; i <= Math.min(endPage, startPage + maxPagesToShow - 1); i++) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = '#';
    a.textContent = i;

    if (i === currentPage) {
      a.classList.add('active');
    }

    a.onclick = () => {
      currentPage = i;
      console.log(data);
      displayDisasterList(data);
    };

    li.appendChild(a);
    paginationElement.appendChild(li);
  }

  // Add ellipsis before the last page if necessary
  if (endPage < totalPages - 1) {
    const lastEllipsis = document.createElement('span');
    lastEllipsis.textContent = '...';
    paginationElement.appendChild(lastEllipsis);
  }

  if (currentPage < totalPages - 3 && totalPages > maxPagesToShow) {
    // Always display the last page
    const lastPage = document.createElement('li');
    const lastPageLink = document.createElement('a');
    lastPageLink.href = '#';
    lastPageLink.textContent = totalPages;
    lastPageLink.onclick = () => {
      currentPage = totalPages;
      console.log(data);
      displayDisasterList(data);
    };
    paginationElement.appendChild(lastPage);
    lastPage.appendChild(lastPageLink);
  }
}


function showDisasterDetail(itemid) {
  let item = data.find(disaster => disaster.id === itemid);
  // Hide the list, display the detail
  disasterListContainer.style.display = 'none';
  disasterDetailContainer.style.display = 'flex';

  // Display the detail
  disasterDetailContainer.innerHTML = `
    <h2 class="centered-h2">Disaster Detail</h2>
    <span><a href="/Projects/Frontend/landing_page/index.html">Home </a> > <a href = "/Projects/Frontend/mapping_detail/HTML/interactive_mapping.html">Events</a> > <span class="clickable-name" onclick="showDisasterDetail('${item.id}');">${item.name}</span></span>
    <h3>Emergency Overview</h3>
    <hr>
    <div id="infoTable"></div>
    <h3>Affected Area</h3>
    <hr>
    <div id="mapContainer"></div>
    <h3>Source</h3>
    <hr>
    <div id="sourceContainer">
      <div class="sticker-border">
        <p>Disaster Souce</p>
          <a href=${item.file_location}>Data file</a>
      </div>
      <div class="sticker-border">
        <p>Source Database URL</p>
          <a href=https://www.gdacs.org>Data URL</a>
      </div> 
    </div>
    `;
  //disasterDetailContainer.appendChild(END_Container);

  setTimeout(() => {
    initializeMap(item.coord, item.type, item.name);
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
        <th>Continent</th>
        <td>${item.continent}</td>
      </tr>
      <tr>
        <th>Country</th>
        <td>${item.country}</td>
      </tr>
      <tr>
        <th>World Bank Income</th>
        <td>${item.WorldBankIncome}</td>
      </tr>
      </table>
      <table>
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
        <th>${item.impact}</th>
        <td>${item.impact_value}</td>
      </tr>
    </table>
  `;
}
