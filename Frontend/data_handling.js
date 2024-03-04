import processData from './data_handling.js';

document.addEventListener('DOMContentLoaded', function () {
    processData().then(([eventNames, eventData, monthNamesKeys, monthCountsValues, topCountries]) => {
        const ctx1 = document.getElementById('bar_chart').getContext('2d');
        var chart1 = new Chart(ctx1, {
            type: 'bar',
            data: {
                labels: eventNames, // Example hazard labels
                datasets: [{
                    label: 'Number of Events',
                    data: eventData, // Example data (replace with actual data)
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                maintainAspectRatio: false,
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Number of events per hazard', // Title for the chart
                        font: {
                            size: 16 // Font size of the title
                        }
                    }
                }
            }
        });

        var ctx2 = document.getElementById('line_chart').getContext('2d');
        var chart2 = new Chart(ctx2, {
            type: 'line',
            data: {
                labels: monthNamesKeys, // Example labels
                datasets: [{
                    label: 'Overall Number of Hazards',
                    data: monthCountsValues, // Example data (replace with actual data)
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                maintainAspectRatio: false,
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Number of hazards occured per month', // Title for the chart
                        font: {
                            size: 16 // Font size of the title
                        }
                    }
                }
            }
        });
            // Example data for top ten countries affected by most hazards
        // Sample data in dictionary format
        var topCountriesDict = {
            "India": 21,
            "Turkey": 18,
            "Pakistan": 16,
            "Iran (Islamic Republic of)": 13,
            "Hungary": 13
        };

        console.log(topCountries)
        
        // Convert dictionary into an array of objects with required keys
        var topCountriesArray = Object.entries(topCountries).map(([country, numHazards]) => ({ country, numHazards }));

        // Function to populate the table with data
        function populateTopCountriesTable(data) {
            var tableBody = document.querySelector('#topCountriesTable tbody');
            tableBody.innerHTML = ''; // Clear existing data

            data.forEach(function (item) {
                var row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.country}</td>
                    <td>${item.numHazards}</td>
                `;
                tableBody.appendChild(row);
            });
        }

        // Populate the table with the converted array of objects
        populateTopCountriesTable(topCountriesArray);

    });
});
