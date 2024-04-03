import processData from './data_handling.js';

var map = L.map('map').setView([0, 0], 2.5);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    className: 'monochrome-tile-layer'
}).addTo(map);

processData().then(([topEventNames, topEventCounts, monthNamesKeys, monthCountsValues, topCountriesMostFrequentDisasters, countries, countryCount]) => {
    countries = [...new Set(countries)];
    console.log("Countries:", countries)
    fetch('http://127.0.0.1:5000')
        .then(response => response.json())
        .then(receivedData => {
            console.log(receivedData);
            const summary_map_data = receivedData[0].summary_map;
            console.log("Data", summary_map_data);
            const all_countries = Object.keys(summary_map_data);
            countries.forEach(function (country) {
                let search_country = all_countries.find(item => item === country);
                if (search_country === undefined) {
                    search_country = all_countries.find(item => item.includes(country));
                }
                //console.log(country, search_country);
                if (search_country === undefined) {
                    return;
                }
                const coordinates = summary_map_data[search_country];
                console.log(country, coordinates);
                const locationMarker = L.circleMarker(coordinates, {
                    radius: 5,
                    color: 'red',
                    fillColor: '#f03',
                    fillOpacity: 0.5,
                }).addTo(map);
                locationMarker.bindPopup("<b><span style='font-size: 16px;'>" + country + "</span></b><br>" + "Number: " + String(countryCount[country])).openPopup();
                //setTimeout(sendRequest, 100);
            })
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
})


document.addEventListener('DOMContentLoaded', async function () {
    // Function to update the charts with processed data
    async function updateChart1(startDate, endDate) {
        // Call the processData function with submitted start and end dates
        if (!isNaN(startDate) && !isNaN(endDate)) {
            const [eventNames, eventData, monthNamesKeys, monthCountsValues, topCountries] = await processData(startDate, endDate, null);
            // Update chart1
            chart1.data.labels = eventNames;
            chart1.data.datasets[0].data = eventData;
            chart1.update();
        }
    }

    async function updateChart2(year) {
        // Call the processData function with the selected year
        const [eventNames, eventData, monthNamesKeys, monthCountsValues, topCountries] = await processData(null, null, year);

        // Update chart2
        chart2.data.labels = monthNamesKeys;
        chart2.data.datasets[0].data = monthCountsValues;
        chart2.update();
    }

    // Add event listener for form submission
    document.getElementById('chart1Form').addEventListener('submit', async function (event) {
        event.preventDefault(); // Prevent the default form submission behavior
        const startDateString = document.getElementById('chart1StartDate').value;
        const endDateString = document.getElementById('chart1EndDate').value;

        // Convert start and end date strings to Date objects
        const startDate = new Date(startDateString);
        const endDate = new Date(endDateString);

        // Update the charts with the submitted start and end dates
        await updateChart1(startDate, endDate);
    });

    document.getElementById('chart2Form').addEventListener('submit', async function (event) {
        event.preventDefault(); // Prevent the default form submission behavior
        const selectedYear = document.getElementById('chart2Year').value;
        console.log(selectedYear)

        await updateChart2(selectedYear);
    });

    // Call the processData function to fetch and process the data with initial dates
    const [eventNames, eventData, monthNamesKeys, monthCountsValues, topCountriesMostFrequentDisasters] = await processData();

    const ctx1 = document.getElementById('bar_chart').getContext('2d');
    var chart1 = new Chart(ctx1, {
        type: 'bar',
        data: {
            labels: eventNames,
            datasets: [{
                label: 'Number of Events',
                data: eventData,
                backgroundColor: 'rgba(255, 0, 0, 0.9)',
                borderColor: 'rgba(255, 0, 0, 1)',
                borderWidth: 1
            }]
        },
        options: {
            maintainAspectRatio: false,
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Hazard Types',
                        color: 'rgba(50, 50, 50, 1)', // Optional: Customize the color
                        font: {
                            size: 14,
                            weight: "bold"
                        }
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Number of Events',
                        color: 'rgba(50, 50, 50, 1)', // Optional: Customize the color
                        font: {
                            size: 14,
                            weight: "bold"
                        }
                    }
                }
            },
        }
    });

    var ctx2 = document.getElementById('line_chart').getContext('2d');
    var chart2 = new Chart(ctx2, {
        type: 'line',
        data: {
            labels: monthNamesKeys,
            datasets: [{
                label: 'Overall Number of Hazards',
                data: monthCountsValues,
                backgroundColor: 'rgba(255, 0, 0, 0.8)',
                borderColor: 'rgba(252, 153, 146, 1))',
                borderWidth: 1
            }]
        },
        options: {
            maintainAspectRatio: false,
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Month',
                        color: 'rgba(50, 50, 50, 1)', // Optional: Customize the color
                        font: {
                            size: 14,
                            weight: "bold"
                        }
                    }
                },
                y: {
                    min: 0,
                    title: {
                        display: true,
                        text: 'Number of hazards',
                        color: 'rgba(50, 50, 50, 1)', // Optional: Customize the color
                        font: {
                            size: 14,
                            weight: "bold"
                        }
                    }
                }
            },
        }
    });

    // Function to populate the table with data
    function populateTopCountriesTable(data) {
        var tableBody = document.querySelector('#topCountriesTable tbody');
        tableBody.innerHTML = ''; // Clear existing data

        data.forEach(function (item) {
            var row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.country}</td>
                <td>${item.number}</td>
                <td>${item.disaster}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    // Populate the table with the converted array of objects
    populateTopCountriesTable(topCountriesMostFrequentDisasters);

});