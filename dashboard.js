document.addEventListener('DOMContentLoaded', function () {

    // Chart 1: Number of events per hazard
    var ctx1 = document.getElementById('bar_chart').getContext('2d');
    const cars = ['Hazard 1', 'Hazard 2', 'Hazard 3', 'Hazard 4', 'Hazard 10']
    var chart1 = new Chart(ctx1, {
        type: 'bar',
        data: {
            labels: cars, // Example hazard labels
            datasets: [{
                label: 'Number of Events',
                data: [25, 30, 20, 15, 10], // Example data (replace with actual data)
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


    // Chart 2: Time plot of overall number of hazards
    var ctx2 = document.getElementById('line_chart').getContext('2d');
    var chart2 = new Chart(ctx2, {
        type: 'line',
        data: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August'], // Example labels
            datasets: [{
                label: 'Overall Number of Hazards',
                data: [100, 120, 90, 110, 80, 100, 130, 200], // Example data (replace with actual data)
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
                    text: 'Line Chart', // Title for the chart
                    font: {
                        size: 16 // Font size of the title
                    }
                }
            }
        }
    });

    // Example data for top ten countries affected by most hazards
    var topCountriesData = [
        { country: 'Country 1', numHazards: 50 },
        { country: 'Country 2', numHazards: 45 },
        { country: 'Country 3', numHazards: 40 },
        { country: 'Country 4', numHazards: 35 },
        { country: 'Country 5', numHazards: 30 },
    ];

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

    // Populate the table with example data
    populateTopCountriesTable(topCountriesData);
});
