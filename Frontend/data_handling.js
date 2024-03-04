// dataProcessor.js

const jsonFilePath = 'event_Level_2000-01-01_2024-02-05_TC.json'; // Relative path to JSON file

const monthNames = {
    "01": "Jan",
    "02": "Feb",
    "03": "Mar",
    "04": "Apr",
    "05": "May",
    "06": "Jun",
    "07": "Jul",
    "08": "Aug",
    "09": "Sep",
    "10": "Oct",
    "11": "Nov",
    "12": "Dec"
};

const processData = async () => {
    try {
        const response = await fetch(jsonFilePath);
        const jsonData = await response.json();

        let topEventNames = [];
        let topEventCounts = [];

        let eventDict = {};
        let monthCount = {};
        let countryCount = {};

        jsonData.forEach(entry => {
            const event = entry.ev_name;
            if (event) {
                let standardizedName = event.substring(event.indexOf("\\") + 1, event.lastIndexOf("\\")).trim();

                if (standardizedName.includes("Earthquake")) {
                    standardizedName = "Earthquake";
                }
                if (standardizedName.includes("Flood")) {
                    standardizedName = "Floods";
                }
                if (standardizedName.includes("Cyclone")) {
                    standardizedName = "Cyclone";
                }
                if (standardizedName.includes("Drought")) {
                    standardizedName = "Drought";
                }

                eventDict[standardizedName] = (eventDict[standardizedName] || 0) + 1;
            }

            const eventDate = entry.ev_sdate;
            if (eventDate) {
                const month = eventDate.split("-")[1];
                const monthName = monthNames[month];
                monthCount[monthName] = (monthCount[monthName] || 0) + 1;
            }

            const country = entry.Country;
            if (country) {
                countryCount[country] = (countryCount[country] || 0) + 1;
            }
        });

        // Sort event count
        const sortedEventDict = Object.entries(eventDict).sort((a, b) => b[1] - a[1]);
        eventDict = Object.fromEntries(sortedEventDict);

        // Extract first 8 items into separate arrays
        const events = Object.keys(eventDict);
        const num_of_top_events = 8;
        for (let i = 0; i < num_of_top_events; i++) {
            topEventNames.push(events[i]);
            topEventCounts.push(eventDict[events[i]]);
        }

        return [topEventNames, topEventCounts];
    } catch (error) {
        console.error('Error fetching or parsing JSON data:', error);
        return [[], []]; // Return empty arrays in case of error
    }
};

export default processData;
