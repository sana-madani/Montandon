export function updateEndDateMin() {
    var startDate = document.getElementById('chart1StartDate').value;
    document.getElementById('chart1EndDate').min = startDate;
}

export function validateDate() {
    var startDate = document.getElementById('chart1StartDate').value;
    var endDate = document.getElementById('chart1EndDate').value;
    var today = new Date().toISOString().split('T')[0]; // Get today's date in 'YYYY-MM-DD' format

    console.log(today, startDate)
    if (startDate > endDate) {
        alert('End date must be after start date');
        return false; // Prevent form submission
    }

    if ((endDate > today) || (startDate > today)) {
        alert('Inserted date range cannot be in the future');
        return false; // Prevent form submission
    }

    return true; // Allow form submission
}
