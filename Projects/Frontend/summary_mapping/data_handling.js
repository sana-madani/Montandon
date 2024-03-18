// const jsonFilePath = 'event_Level_2000-01-01_2024-02-05_TC.json'; // Relative path to JSON file
// var countries = [];
// const monthNames = {
//     "01": "Jan",
//     "02": "Feb",
//     "03": "Mar",
//     "04": "Apr",
//     "05": "May",
//     "06": "Jun",
//     "07": "Jul",
//     "08": "Aug",
//     "09": "Sep",
//     "10": "Oct",
//     "11": "Nov",
//     "12": "Dec"
// };

// const processData = async () => {
//     try {
//         const response = await fetch(jsonFilePath);
//         const jsonData = await response.json();

//         let topEventNames = [];
//         let topEventCounts = [];

//         let eventDict = {};
//         let monthCount = {};
//         let countryCount = {};

//         jsonData.forEach(entry => {
//             const event = entry.ev_name;
//             const eventDate = entry.ev_sdate;

//             if (event) {
//                 let standardizedName = event.substring(event.indexOf("\\") + 1, event.lastIndexOf("\\")).trim();

//                 if (standardizedName.includes("Earthquake")) {
//                     standardizedName = "Earthquake";
//                 }
//                 if (standardizedName.includes("Flood")) {
//                     standardizedName = "Floods";
//                 }
//                 if (standardizedName.includes("Cyclone")) {
//                     standardizedName = "Cyclone";
//                 }
//                 if (standardizedName.includes("Drought")) {
//                     standardizedName = "Drought";
//                 }

//                 eventDict[standardizedName] = (eventDict[standardizedName] || 0) + 1;
//             }

//             if (eventDate) {
//                 const month = eventDate.split("-")[1];
//                 const monthName = monthNames[month];
//                 monthCount[monthName] = (monthCount[monthName] || 0) + 1;
//             }

//             const country = entry.Country;
//             countries.push(country);
//             if (country) {
//                 countryCount[country] = (countryCount[country] || 0) + 1;
//             }
//         });
//         const monthNamesKeys = Object.keys(monthCount);
//         const monthCountsValues = Object.values(monthCount);

//         const sortedEventDict = Object.entries(eventDict).sort((a, b) => b[1] - a[1]);
//         eventDict = Object.fromEntries(sortedEventDict);

//         const sortedCountryCount = Object.entries(countryCount).sort((a, b) => b[1] - a[1]);
//         countryCount = Object.fromEntries(sortedCountryCount);

//         const events = Object.keys(eventDict);
//         const num_of_top_events = 8;
//         for (let i = 0; i < num_of_top_events; i++) {
//             topEventNames.push(events[i]);
//             topEventCounts.push(eventDict[events[i]]);
//         }

//         const topCountries = Object.fromEntries(
//             Object.entries(countryCount)
//                 .sort((a, b) => b[1] - a[1])
//                 .slice(0, 5)
//         );

//         return [topEventNames, topEventCounts, monthNamesKeys, monthCountsValues, topCountries, countries, countryCount];
//     } catch (error) {
//         console.error('Error fetching or parsing JSON data:', error);
//         return [[], [], [], []];
//     }
// };

// export default processData;


const jsonFilePath = 'event_Level_2000-01-01_2024-02-05_TC.json'; // Relative path to JSON file
var countries = [];
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

const processData = async (startDate, endDate, year) => {
    try {
        const response = await fetch(jsonFilePath);
        const jsonData = await response.json();

        const disasterMapping = {
            "Earthquake": "Earthquake",
            "Flood": "Floods",
            "Cyclone": "Cyclone",
            "Drought": "Drought"
        };

        let topEventNames = [];
        let topEventCounts = [];

        let eventDict = {};
        let monthCount = {};
        let countryCount = {};

        const sortedMonthNames = Object.values(monthNames).sort((a, b) => {
            const monthOrder = { "Jan": 1, "Feb": 2, "Mar": 3, "Apr": 4, "May": 5, "Jun": 6, "Jul": 7, "Aug": 8, "Sep": 9, "Oct": 10, "Nov": 11, "Dec": 12 };
            return monthOrder[a] - monthOrder[b];
        });

        // Initialize month counts
        sortedMonthNames.forEach(monthName => {
            monthCount[monthName] = 0;
        });

        jsonData.forEach(entry => {
            const event = entry.ev_name;
            const event_sdate = new Date(entry.ev_sdate);
            const eventDate = entry.ev_sdate;

            if (startDate && endDate) {
                if (event_sdate >= startDate && event_sdate <= endDate) {
                    let standardizedName = event.substring(event.indexOf("\\") + 1, event.lastIndexOf("\\")).trim();;
                    // Iterate through the disaster mapping
                    for (const [substring, disaster] of Object.entries(disasterMapping)) {
                        if (standardizedName.includes(substring)) {
                            standardizedName = disaster;
                            break;
                        }
                    }

                    eventDict[standardizedName] = (eventDict[standardizedName] || 0) + 1;
                }
            } else {
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
            }

            if (!year) {
                if (eventDate) {
                    const month = eventDate.split("-")[1];
                    const monthName = monthNames[month];
                    monthCount[monthName]++; // Increment the count for the event's month
                }
            } else {
                const event_year = eventDate.split("-")[0];
                if (year == event_year) {
                    const month = eventDate.split("-")[1];
                    const monthName = monthNames[month];
                    monthCount[monthName] = (monthCount[monthName] || 0) + 1;
                }
            }

            const country = entry.Country;
            countries.push(country);
            if (country) {
                countryCount[country] = (countryCount[country] || 0) + 1;
            }
        });

        const monthNamesKeys = Object.keys(monthCount);
        const monthCountsValues = Object.values(monthCount);

        const sortedEventDict = Object.entries(eventDict).sort((a, b) => b[1] - a[1]);
        eventDict = Object.fromEntries(sortedEventDict);

        const sortedCountryCount = Object.entries(countryCount).sort((a, b) => b[1] - a[1]);
        countryCount = Object.fromEntries(sortedCountryCount);

        const events = Object.keys(eventDict);
        const num_of_top_events = 8;
        for (let i = 0; i < num_of_top_events; i++) {
            topEventNames.push(events[i]);
            topEventCounts.push(eventDict[events[i]]);
        }

        // Get the top 10 countries
        const topCountries = Object.entries(countryCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);

        // Array to store the most frequent disasters for each top country
        let topCountriesMostFrequentDisasters = [];

        // Iterate through the top 10 countries
        topCountries.forEach(([country, disaster_count]) => {
            // Filter the data to include only entries for the current country
            const countryData = jsonData.filter(entry => entry.Country === country);

            // Count occurrences of each standardized disaster
            let disasterCount = {};
            countryData.forEach(entry => {
                const event = entry.ev_name;
                let standardizedName = event.substring(event.indexOf("\\") + 1, event.lastIndexOf("\\")).trim();

                // Standardize the disaster name
                for (const [key, value] of Object.entries(disasterMapping)) {
                    if (standardizedName.includes(key)) {
                        standardizedName = value;
                        break;
                    }
                }

                // Increment the count for the standardized disaster
                disasterCount[standardizedName] = (disasterCount[standardizedName] || 0) + 1;
            });

            // Find the disaster with the highest count
            const mostFrequentDisaster = Object.entries(disasterCount).reduce((prev, curr) => {
                return curr[1] > prev[1] ? curr : prev;
            });

            // Add the most frequent disaster to the result array
            topCountriesMostFrequentDisasters.push({
                country: country,
                number: disaster_count,
                disaster: mostFrequentDisaster[0],
            });
        });
        return [topEventNames, topEventCounts, monthNamesKeys, monthCountsValues, topCountriesMostFrequentDisasters, countries, countryCount];
    } catch (error) {
        console.error('Error fetching or parsing JSON data:', error);
        return [[], [], [], []];
    }

};

export default processData;
