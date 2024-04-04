let datalistCounter = 1;

function getAllInputValues() {
  const inputElements = document.querySelectorAll('input[type="text"],input[type="date"]');
  const inputValues = Array.from(inputElements).map(input => ({ id: input.id, value: input.value }));
  // Transform the array into an object
  const inputObject = inputValues.reduce((acc, { id, value }) => {
    acc[id] = value;
    return acc;
  }, {});
  return inputObject;
}

function create_all_Containers() {
  const form = document.createElement('form');
  const parentContainer = document.createElement('div');
  parentContainer.style.display = 'flex';

  const spacer1 = document.createElement('div');
  spacer1.classList.add('space1');
  const spacer2 = document.createElement('div');
  spacer2.classList.add('space2');
  const spacer3 = document.createElement('div');
  spacer3.classList.add('space3');

  const country_label = "All Countries";
  const disaster_type_label = "All Disaster Types"
  const country_Container = create_key_Container(country_label, data[0].country);
  const type_Container = create_key_Container(disaster_type_label, data[0].type);
  const date_after_Container = create_date_Container("Start After");
  const date_before_Container = create_date_Container("Start Before");

  parentContainer.appendChild(date_after_Container);
  parentContainer.appendChild(spacer1);
  parentContainer.appendChild(date_before_Container);
  parentContainer.appendChild(spacer2);
  parentContainer.appendChild(country_Container);
  parentContainer.appendChild(spacer3);
  parentContainer.appendChild(type_Container);

  form.appendChild(parentContainer);
  const search_Container = document.getElementById('search_Container');
  search_Container.appendChild(form);

}
function create_key_Container(label, options) {
  const searchContainer = document.createElement('single_search_Container');
  const inputID = label + "Input";

  if (label === "All Disaster Types") {
    var prefixString = document.createElement('span');
    prefixString.textContent = "Type";
  } else {
    var prefixString = document.createElement('span');
    prefixString.textContent = "Country";
  }


  // create input table
  var searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.id = inputID;
  searchInput.setAttribute('list', label + 'types');
  searchInput.placeholder = label;

  // create data list
  var dataList = document.createElement('datalist');
  dataList.id = label + 'types';

  //option
  var disasterOptions = options;
  disasterOptions.forEach(function (disaster) {
    var option = document.createElement('option');
    option.value = disaster;
    dataList.appendChild(option);
  });

  searchInput.appendChild(dataList);
  searchContainer.appendChild(prefixString);
  searchContainer.appendChild(searchInput);

  searchInput.addEventListener('input', function () {
    search();
  });
  return searchContainer;
}


function create_date_Container(label) {
  const dateContainer = document.createElement("div");
  const inputID = label + "Input"
  dateContainer.id = "dateContainer";


  var prefixString = document.createElement('span');
  prefixString.textContent = label;

  const dateInput = document.createElement("input");
  dateInput.id = inputID;
  dateInput.type = "date";
  dateInput.name = "datepicker";

  dateContainer.appendChild(prefixString);
  dateContainer.appendChild(dateInput);

  dateInput.addEventListener('change', function () {
    search();
  });

  return dateContainer;
}


function search() {
  const data1 = getAllInputValues();
  fetch('http://127.0.0.1:5000', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data1)
  })
    .then(response => response.json())
    .then(result => {
      data = result;
      displayDisasterList(data);
    })
    .catch(error => {
      console.error('Error sending data to backend:', error);
    });
}



