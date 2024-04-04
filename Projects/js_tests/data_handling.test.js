// Import the processData function
import processData from '../Frontend/summary_mapping/data_handling.js';

// Mock the fetch function for testing purposes
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(mockJsonData),
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
    {
        ev_name: "\\Floods\\\"\"",
        ev_sdate: "2023-09-08",
        Country: "Italy"
      },
  ];
  

describe('processData', () => {
    it('should return top event names correctly without date range', async () => {    
        // Call the processData function with test inputs
        const result = await processData(null, null, null);
    
        // Assert the expected output based on mock JSON data and test inputs
        expect(result[0]).toEqual(['Floods', 'Earthquake', 'Cyclone', 'Drought', 'Wildfire', 'Tornado', 'Blizzard', 'Typhoon']);
      });

    it('should return top event counts correctly with date range', async () => {    
        // Call the processData function with test inputs
        const result = await processData(null, null, null);
    
        // Assert the expected output based on mock JSON data and test inputs
        expect(result[1]).toEqual([2, 1, 1, 1, 1, 1, 1, 1]);
      });

    it('should return top event names correctly with date range', async () => {
      // Define test inputs with filters
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-12-31');
      const year = '2024';
  
      // Call the processData function with test inputs
      const result = await processData(startDate, endDate, year);
  
      // Assert the expected output based on mock JSON data and test inputs
      expect(result[0]).toEqual(['Floods', 'Drought', 'Wildfire', 'Tornado', 'Blizzard', 'Typhoon', 'Volcano Eruption', 'Landslide']);
    });
  
    it('should return top event counts correctly with date range', async () => {
      // Define test inputs with filters
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-12-31');
      const year = '2024';
  
      // Call the processData function with test inputs
      const result = await processData(startDate, endDate, year);
  
      // Assert the expected output based on mock JSON data and test inputs
      expect(result[1]).toEqual([1, 1, 1, 1, 1, 1, 1, 1]);
    });

    it('should return month names correctly without year inputted', async () => {
        // Call the processData function with test inputs
        const result = await processData(null, null, null);
    
        // Assert the expected output based on mock JSON data and test inputs
        expect(result[2]).toEqual(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']);
      });

      it('should return month counts correctly without year inputted', async () => {
        // Call the processData function with test inputs
        const result = await processData(null, null, null);
    
        // Assert the expected output based on mock JSON data and test inputs
        expect(result[3]).toEqual([1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 0, 0]);
      });
  
    it('should return month names correctly with year inputted', async () => {
      // Define test inputs with filters
      const year = '2024';
  
      // Call the processData function with test inputs
      const result = await processData(null, null, year);
  
      // Assert the expected output based on mock JSON data and test inputs
      expect(result[2]).toEqual(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']);
    });
  
    it('should return month counts correctly with year inputted', async () => {
      // Define test inputs with filters
      const year = '2024';
  
      // Call the processData function with test inputs
      const result = await processData(null, null, year);
  
      // Assert the expected output based on mock JSON data and test inputs
      expect(result[3]).toEqual([1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0]);
    });
  
    it('should return top countries with most frequent disasters correctly', async () => {
      // Define test inputs with filters
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-12-31');
      const year = '2024';
  
      // Call the processData function with test inputs
      const result = await processData(startDate, endDate, year);
  
      // Assert the expected output based on mock JSON data and test inputs
      expect(result[4]).toEqual([
        { country: 'USA', number: 2, disaster: 'Floods' },
        { country: 'Italy', number: 2, disaster: 'Volcano Eruption' },
        { country: 'Japan', number: 1, disaster: 'Earthquake' },
        { country: 'India', number: 1, disaster: 'Cyclone' },
        { country: 'Australia', number: 1, disaster: 'Drought' },
        { country: 'Canada', number: 1, disaster: 'Tornado' },
        { country: 'Russia', number: 1, disaster: 'Blizzard' },
        { country: 'Philippines', number: 1, disaster: 'Typhoon' },
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
  
