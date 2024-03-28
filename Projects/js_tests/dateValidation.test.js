// Import the functions to be tested
const { updateEndDateMin, validateDate } = require('./dateValidation.js');

// Mock the DOM environment using jsdom
const { JSDOM } = require('jsdom');
const { document } = new JSDOM('<!doctype html><html><body></body></html>').window;
global.document = document;
global.window = document.defaultView;

// Mock the alert function
global.alert = jest.fn();

// Your test suite
describe('updateEndDateMin', () => {
    test('should update minimum value of end date', () => {
        // Create DOM elements needed for testing
        document.body.innerHTML = `
            <input type="date" id="chart1StartDate" value="2024-03-20">
            <input type="date" id="chart1EndDate">
        `;

        // Call the function to be tested
        updateEndDateMin();

        // Assert that the minimum value of end date is updated to start date
        expect(document.getElementById('chart1EndDate').min).toBe('2024-03-20');
    });
});

describe('validateDate', () => {
    test('should return false if end date is before start date', () => {
        // Create DOM elements needed for testing
        document.body.innerHTML = `
            <input type="date" id="chart1StartDate" value="2024-03-20">
            <input type="date" id="chart1EndDate" value="2024-03-19">
        `;

        // Call the function to be tested
        const result = validateDate();

        // Assert that the alert function is called with the appropriate message
        expect(global.alert).toHaveBeenCalledWith('End date must be after start date');

        // Assert that the function returns false
        expect(result).toBe(false);
    });

    test('should return false if date range is in the future', () => {
        // Create DOM elements needed for testing
        document.body.innerHTML = `
            <input type="date" id="chart1StartDate" value="2025-03-20">
            <input type="date" id="chart1EndDate" value="2025-03-21">
        `;

        // Call the function to be tested
        const result = validateDate();

        // Assert that the alert function is called with the appropriate message
        expect(global.alert).toHaveBeenCalledWith('Inserted date range cannot be in the future');

        // Assert that the function returns false
        expect(result).toBe(false);
    });

    test('should return true if validation passes', () => {
        // Create DOM elements needed for testing
        document.body.innerHTML = `
            <input type="date" id="chart1StartDate" value="2024-03-20">
            <input type="date" id="chart1EndDate" value="2024-03-20">
        `;

        // Call the function to be tested
        const result = validateDate();

        // Assert that the function returns true
        expect(result).toBe(true);
    });
});
