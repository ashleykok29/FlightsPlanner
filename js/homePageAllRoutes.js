// Purpose: To show all of the routes in a given country
// Team: 39
// Author: Jack ROGERS & Peter ROBERTS
// Last Edited: 30/10/2020

"use strict";
// Global variables
let countryData = ["Afghanistan","Albania","Algeria","American Samoa","Angola","Anguilla","Antarctica","Antigua and Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Brazil","British Indian Ocean Territory","British Virgin Islands","Brunei","Bulgaria","Burkina Faso","Burma","Burundi","Cambodia","Cameroon","Canada","Cape Verde","Cayman Islands","Central African Republic","Chad","Chile","China","Christmas Island","Cocos (Keeling) Islands","Colombia","Comoros","Congo (Brazzaville)","Congo (Kinshasa)","Cook Islands","Costa Rica","Cote d'Ivoire","Croatia","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","East Timor","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Guiana","French Polynesia","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guadeloupe","Guam","Guatemala","Guernsey","Guinea","Guinea-Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Johnston Atoll","Jordan","Kazakhstan","Kenya","Kiribati","Korea","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Martinique","Mauritania","Mauritius","Mayotte","Mexico","Micronesia","Midway Islands","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Myanmar","Namibia","Nauru","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","Niue","Norfolk Island","North Korea","Northern Mariana Islands","Norway","Oman","Pakistan","Palau","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Helena","Saint Kitts and Nevis","Saint Lucia","Saint Pierre and Miquelon","Saint Vincent and the Grenadines","Samoa","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Georgia and the Islands","South Korea","South Sudan","Spain","Sri Lanka","Sudan","Suriname","Svalbard","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Togo","Tonga","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Turks and Caicos Islands","Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","Uruguay","Uzbekistan","Vanuatu","Venezuela","Vietnam","Virgin Islands","Wake Island","Wallis and Futuna","West Bank","Western Sahara","Yemen","Zambia","Zimbabwe"];
let selectedCountry = "";
let airportLocations = [];
let routes = [];
let validRoutes = [];


//onload functions
buttonOrName();
countriesDropdownMenu();

//Code for adding the map
mapboxgl.accessToken = "pk.eyJ1IjoicG1hcm9iZXJ0cyIsImEiOiJja2ZuaW1ybGgxZWM0MzhxdXN5ZnZlaG5lIn0.pEIxRQmI-wdpsdH_gb7jZg";
let map = new  mapboxgl.Map({
	container: 'mapAllRoutes',
	zoom: 1,
	style: 'mapbox://styles/mapbox/streets-v9'
});


//Code for the country menu

// This function will show all countries in a drop down list on the webpage
// Input: None
// Output: Drop down list containing the countries
function countriesDropdownMenu()
{
	let datalistRef = document.getElementById("countriesDropdown");
	let output = "";
    // For loop to add countries to the drop down list
	for(let i = 0; i < countryData.length; i++)
	{
		output += `<option value = "${countryData[i]}">`
	}

	datalistRef.innerHTML = output;
}

document.getElementById("submitCountryButton").addEventListener('click',function(){submitCountry()})

// This function will load all routes for the given country
// Input: None
// Output: None
function submitCountry()
{
    let userCountry = document.getElementById("countriesId").value;
    selectedCountry = userCountry; // Assinging the country the user selected to the selectedCountry variable 
    getData(userCountry); // Getting the routes for the coutnry, this is all controlled by the one function.
    // To ensure that only one country is displayed on the map at a time as this will cause issues with the arrays and id's in the map
    // After submitting a country and deciding to display another, the page will refresh first. 
    document.getElementById("replaceOnPress").innerHTML = `
    <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect" style="color:black;"
        id="refreshButton" onclick = "refreshForNewCountry()">
        Choose New Country
    </button>    
    `
}
// This function will refresh the page
// Input: None
// Output: None
function refreshForNewCountry()
{
    location.reload();
}

// This function will get all the airports for a country from the Monash openFlights Api.
// Input: Code for country, 3 or 4 digit number
// Output: Airport information for a country 
function getData(country)
{
    let callback = "showAirports";
    let url = `https://eng1003.monash/OpenFlights/airports/`;
    let params = `?country=${country}&callback=${callback}`;
    let script = document.createElement('script');
    script.src = url + params;
    document.body.appendChild(script);
}

// This function will display all airports in a country on the map as a marker. The marker will have a popup when clicked but not by default
// Input: Airport data for a country, from the Api
// Output: Displays markers 
function showAirports(data)
{    
    for (let i = 0; i < data.length; i++)
    {
        // Extracting required information for each airport
        let lat = data[i].latitude;
        let long = data[i].longitude;
        let airportDescription = `Airport Name: ${data[i].name}, City: ${data[i].city}`
        let airportCode = data[i]["IATA-FAA"];
        let airportID = data[i].airportId;
        let airportObject = {  // Creating a temporary variable to store each airport description
            coordinates:[long, lat],
            description: airportDescription,
            IataFaa: airportCode,
            ID: airportID
        }
        airportLocations.push(airportObject); // Pushing the temporary variable to the array

        let location = airportLocations[i]; // Creating a temporary variable to hold the airport

        if (location.coordinates !== "")
        {
            // Creating a marker for each airport
            let marker = new mapboxgl.Marker({ "color": "#FF8C00" });
            marker.setLngLat(location.coordinates); // Setting the coordinates for the marker
           
            let popup = new mapboxgl.Popup({ offset: 45}); // Creating a popup for each marker with airport description as text
            popup.setHTML(location.description);

            marker.setPopup(popup);

            // Display the marker
            marker.addTo(map);
        }
    }
    // Running the next function
    getRoutesForCountry(selectedCountry);
}

// This function will get all of the routes for a given country
// Input: Country code
// Output: Country routes
function getRoutesForCountry(country)
{
    let callback = "findRoutesForCountry";
    let url = `https://eng1003.monash/OpenFlights/allroutes/`;
    let params = `?country=${country}&callback=${callback}`;
    let script = document.createElement('script');
    script.src = url + params;
    document.body.appendChild(script);
}

// This function will get all of the data about the routes in the country
// Input: Array with all the information about the routes
// Output: routes array containing all routes for the country
function findRoutesForCountry(data)
{
    for (let i = 0; i < data.length; i++)
    {
        let routesObject = { // Creating a temporary variable to hold route information
            destination: {code: data[i].destinationAirport, coordinates: ""},
            source: {code: data[i].sourceAirport, coordinates: ""},
            airline: data[i].airline,
            stops: data[i].stops
        }
        routes.push(routesObject) // Pushing the temporary variable to the routes array
    }
    // Run the next function to check if the routes are domestic
    checkDomestic();
}

// This function will check if all routes are domestic by checking the destination and source code and
// ensuring they are in teh airport locations array for the country
// Input: None
// Output: validRoutes array containing all domestic routes
function checkDomestic()
{
    for (let i = 0; i < routes.length; i++)
    {
        for (let j = 0; j < airportLocations.length; j++)
        {
            // Assigning airports their coordinates and description by checking if the code is the same as in the airportLocations array
            if (routes[i].destination.code === airportLocations[j].IataFaa)
            {
                routes[i].destination.coordinates = airportLocations[j].coordinates; // Assigning coordinates
                routes[i].destination.description = airportLocations[j].description; // Assigning description
                validRoutes.push(routes[i]); // Pushing to the new validRoutes array
            }
        }
    }
    for (let i = 0; i < validRoutes.length; i++)
    {
        for (let j = 0; j < airportLocations.length; j++)
        {
            // Assigning airports their coordinates and description by checking the from the airportLocations array 
            if (validRoutes[i].source.code === airportLocations[j].IataFaa)
            {
                validRoutes[i].source.coordinates = airportLocations[j].coordinates; // Assigning coordinates
                validRoutes[i].source.description = airportLocations[j].description; // Assigning description
            }
        }
    }
    // Running the show routes function to display all routes
    showRoutes()
}

// This function will show all routes on the map by making a polyline from the desired coordinates
// Input: None
// Output: Will display routes on the map
function showRoutes()
{
    // Creating a polyline for each route in the validRoutes array 
    for (let i = 0 ; i < validRoutes.length; i++)
    {
        let object = {
        type: "geojson",
        data: {
        type: "Feature",
        properties: {},
        geometry: {
        type: "LineString",
        coordinates: [validRoutes[i].destination.coordinates, validRoutes[i].source.coordinates]
        }
        }
        };
        map.addLayer({
        id: `routes${i}`,
        type: "line",
        source: object,
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": "#888", "line-width": 6 }
        });
        //Set center of map in the country (the 0 magic number is for the first airport, as countries don't have coordinates)
        map.setCenter(airportLocations[0].coordinates);
    }
}