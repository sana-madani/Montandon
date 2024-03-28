// Import the processData function
import processData from '../Frontend/summary_mapping/data_handling';

// Mock the fetch function for testing purposes
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(mockJsonData), // Mock the response.json() method
  })
);

// Mock JSON data for testing
const mockJsonData = [
  {
    ev_name: "\\Floods\\\"\"",
    ev_sdate: "2024-01-15",
    Country: "USA"
  },
  {
    ev_name: "\\Earthquake\\\"\"",
    ev_sdate: "2023-02-20",
    Country: "Japan"
  },
  {
    ev_name: "\\Cyclone\\\"\"",
    ev_sdate: "2023-03-10",
    Country: "India"
  },
  {
    ev_name: "\\Drought\\\"\"",
    ev_sdate: "2024-04-05",
    Country: "Australia"
  },
  {
    ev_name: "\\Wildfire\\\"\"",
    ev_sdate: "2024-05-22",
    Country: "USA"
  },
  {
    ev_name: "\\Tornado\\\"\"",
    ev_sdate: "2024-06-30",
    Country: "Canada"
  },
  {
    ev_name: "\\Blizzard\\\"\"",
    ev_sdate: "2024-07-18",
    Country: "Russia"
  },
  {
    ev_name: "\\Typhoon\\\"\"",
    ev_sdate: "2024-08-12",
    Country: "Philippines"
  },
  {
    ev_name: "\\Volcano Eruption\\\"\"",
    ev_sdate: "2024-09-08",
    Country: "Italy"
  },
  {
    ev_name: "\\Landslide\\\"\"",
    ev_sdate: "2024-10-25",
    Country: "China"
  },
  // Add more mock data as needed
];


// Write your test cases
describe('processData function', () => {
  it('should fetch and process JSON data correctly without filters', async () => {
    // Define test inputs
    const startDate = null; // No start date filter
    const endDate = null; // No end date filter
    const year = null; // No year filter

    // Call the processData function with test inputs
    const result = await processData(startDate, endDate, year);

    // Assert the expected output based on mock JSON data and test inputs

    // Assert top event names
    expect(result[0]).toEqual(['Floods', 'Earthquake', 'Cyclone', 'Drought', 'Wildfire', 'Tornado', 'Blizzard', 'Typhoon']);

    // Assert top event counts
    expect(result[1]).toEqual([1, 1, 1, 1, 1, 1, 1, 1]);

    // Assert month names
    expect(result[2]).toEqual(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']);

    // Assert month counts
    expect(result[3]).toEqual([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0]);

    // Assert top countries with most frequent disasters
    expect(result[4]).toEqual([
      { country: 'USA', number: 2, disaster: 'Floods' },
      { country: 'Japan', number: 1, disaster: 'Earthquake' },
      { country: 'India', number: 1, disaster: 'Cyclone' },
      { country: 'Australia', number: 1, disaster: 'Drought' },
      { country: 'Canada', number: 1, disaster: 'Tornado' },
      { country: 'Russia', number: 1, disaster: 'Blizzard' },
      { country: 'Philippines', number: 1, disaster: 'Typhoon' },
      { country: 'Italy', number: 1, disaster: 'Volcano Eruption' },
      { country: 'China', number: 1, disaster: 'Landslide' }
    ]);
  });

  it('should fetch and process JSON data correctly with filters', async () => {
    // Define test inputs with filters
    const startDate = new Date('2024-01-01');
    const endDate = new Date('2024-12-31');
    const year = '2024';

    // Call the processData function with test inputs
    const result = await processData(startDate, endDate, year);

    // Assert the expected output based on mock JSON data and test inputs

    // Assert top event names
    expect(result[0]).toEqual(['Floods', 'Drought', 'Wildfire', 'Tornado', 'Blizzard', 'Typhoon', 'Volcano Eruption', 'Landslide']);

    // Assert top event counts
    expect(result[1]).toEqual([1, 1, 1, 1, 1, 1, 1, 1]);

    // Assert month names
    expect(result[2]).toEqual(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']);

    // Assert month counts
    expect(result[3]).toEqual([1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0]);

    // Assert top countries with most frequent disasters
    expect(result[4]).toEqual([
      { country: 'USA', number: 2, disaster: 'Floods' },
      { country: 'Japan', number: 1, disaster: 'Earthquake' },
      { country: 'India', number: 1, disaster: 'Cyclone' },
      { country: 'Australia', number: 1, disaster: 'Drought' },
      { country: 'Canada', number: 1, disaster: 'Tornado' },
      { country: 'Russia', number: 1, disaster: 'Blizzard' },
      { country: 'Philippines', number: 1, disaster: 'Typhoon' },
      { country: 'Italy', number: 1, disaster: 'Volcano Eruption' },
      { country: 'China', number: 1, disaster: 'Landslide' }
    ]);
  });

  it('should fetch the error message', async () => {
    console.error = jest.fn();
    global.fetch.mockRejectedValueOnce(new Error('Network error'));
    const result = await processData();
    expect(result).toEqual([[], [], [], []]);
    expect(console.error).toHaveBeenCalledWith('Error fetching or parsing JSON data:', new Error('Network error'));
  });
});

