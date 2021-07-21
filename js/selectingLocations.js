// Purpose: To allow users to view routes from an airport, click on the route they wish to 
// add to their trip and then view the next routes until their trip is complete
// Team: 39
// Author: Jack ROGERS
// Last Edited: 30/10/2020

"use strict";
// Creating a map from mapBox api
mapboxgl.accessToken = "pk.eyJ1IjoicG1hcm9iZXJ0cyIsImEiOiJja2ZuaW1ybGgxZWM0MzhxdXN5ZnZlaG5lIn0.pEIxRQmI-wdpsdH_gb7jZg";
let map = new  mapboxgl.Map({
	container: 'mapSelectingLocations',
	zoom: 2.5,
	style: 'mapbox://styles/mapbox/streets-v9'
});
// Getting the User ID from local storage
let currentUserRef = localStorage.getItem(CURRENT_USER_KEY);
let selectedCountry = listOfUsers.users[currentUserRef].trips[listOfUsers.users[currentUserRef].trips.length - 1].country;
// Initialising global variables
let selectedCityId = "";
let airportLocations = [];
let airportRoutes = [];
let validAirportRoutes = [];
let newValidAirportRoutes = [];
let markers = [];
let selectedRoutesArray = [];

let outputAreaRef = document.getElementById("currentTrip");

const SELECTED_ROUTE_KEY = "selectedRouteKey";

localStorage.setItem(SELECTED_ROUTE_KEY, selectedRoutesArray)
getData(selectedCountry);


// Will get the appropriate city to display routes for. If there are no flights in the trip, this is the first flight and will start 
// at the city selected by the user on the home page. If not, then it will use the last flight destination 
if (listOfUsers.users[currentUserRef].trips[listOfUsers.users[currentUserRef].trips.length - 1].flights.length === 0)
{
    //Retrieving the start city the user selected on the homepage
    selectedCityId = listOfUsers.users[currentUserRef].trips[listOfUsers.users[currentUserRef].trips.length - 1].startCityId;
}
else 
{
    // Getting the most recent flight for the most recent trip for the current user from the list of users. 
    selectedCityId = listOfUsers.users[currentUserRef].trips[listOfUsers.users[currentUserRef].trips.length - 1].flights[listOfUsers.users[currentUserRef].trips[listOfUsers.users[currentUserRef].trips.length - 1].flights.length - 1].destinationCode
}

// This function will get the data for a given country from the Monash openFlights api
// Input: Selected country 
// Output: Airports and their data for a country
function getData(country)
{
    let callback = "getAirports";
    let url = `https://eng1003.monash/OpenFlights/airports/`;
    let params = `?country=${country}&callback=${callback}`;
    let script = document.createElement('script');
    script.src = url + params;
    document.body.appendChild(script);
}
// This function will get the required information from the openFlights api and 
// push it into the array airportLocations
// Input: Array with all of the airport information
// Output: airportLocations array with the required infromation
function getAirports(data)
{   
    // Assigning airport imformation and pushing into the airportLocations array
    for (let i = 0; i < data.length; i++)
    {        
        let lat = data[i].latitude;
        let long = data[i].longitude;
        let airportDescription = `Airport Name: ${data[i].name}, City: ${data[i].city}`
        let airportCode = data[i]["IATA-FAA"];
        let airportID = data[i].airportId;
        let airportObject = {
            coordinates:[long, lat],
            description: airportDescription,
            IataFaa: airportCode,
            ID: airportID
        }
        airportLocations.push(airportObject);
    }
    // Run the next function for getting routes, had to be done inside functions to ensure they were run at the right time
    getRoutesForAirport(selectedCityId);
}
// This function will get all of the routes for an airport
// Input: Airport ID code
// Output: Routes for an airport
function getRoutesForAirport(airport)
{
    let callback = "findRoutesForAirport";
    let url = `https://eng1003.monash/OpenFlights/routes/`;
    let params = `?sourceAirport=${airport}&callback=${callback}`;
    let script = document.createElement('script');
    script.src = url + params;
    document.body.appendChild(script);
}

// This function will get the required information for each route from an airport
// Input: Array with all of the airports
// Output: airportRoutes array containing routes for an airport

function findRoutesForAirport(data)
{
    airportRoutes = []; // Ensuring the airportRoutes array is blank each time the function is run for a new airport
	for (let i = 0; i < airportLocations.length; i++)
	{
        for (let j = 0; j < data.length; j++)
        {
            // Checking the source airport and assigning the route the appropriate information
		    if (data[j].sourceAirportId == airportLocations[i].ID )
		    {
			    let routesObject = {
                destination: {code: data[j].destinationAirport, id: data[j].destinationAirportId ,coordinates: ""},
                source: {code: data[j].sourceAirport, id: data[j].sourceAirportId, coordinates: ""},
                airline: data[j].airline,
                stops: data[j].stops
                }
			    airportRoutes.push(routesObject)
            }
        }
    }
    //Run the next function for getting routes, had to be done inside functions to ensure they were run at the right time
    checkAirportDomestic()
}

// This function will check if the routes in the validRoutes array are domestic by checking if the destination
// and source airport are in the airportLocations array containing all the airports for the given country 
// Input: None
// Output: validAirportRoutes array containing all domestic routes

function checkAirportDomestic()
{
    validAirportRoutes = []; // Ensuring the array is always blank so no extra routes are carried over
    for (let i = 0; i < airportRoutes.length; i++)
    {
        for (let j = 0; j < airportLocations.length; j++)
        {
            // Double for loop to go through all routes and airport locations to ensure the route exists in the country, meaning it is domestic
            if (airportRoutes[i].destination.code === airportLocations[j].IataFaa)
            {
                airportRoutes[i].destination.coordinates = airportLocations[j].coordinates;
                airportRoutes[i].destination.description = airportLocations[j].description;
                validAirportRoutes.push(airportRoutes[i]); //If the route is valid, it is pushed to validAirportRoutes array
            } 
        }  
    }
    for (let i = 0; i < airportRoutes.length; i++)
    {
        for (let j = 0; j < airportLocations.length; j++)
        {
            //Another double for loop to push the coordinates of the source (the "from" airport) to the route
            if (airportRoutes[i].source.code === airportLocations[j].IataFaa)
            {
                for (let k = 0; k < validAirportRoutes.length; k++)
                {
                    validAirportRoutes[k].source.coordinates = airportLocations[j].coordinates;
                    validAirportRoutes[k].source.description = airportLocations[j].description;
                }
            }
        }
    }
    // Checking if the airport has no routes
    if (airportRoutes.length === 0)
    {
        alert("The Airport you have selected has no routes, you will be redirected to the Home Page ")
        let currentUserRef = localStorage.getItem(CURRENT_USER_KEY);
        listOfUsers.users[currentUserRef].deleteTrip(listOfUsers.users[currentUserRef].trips.length - 1);
        updateLocalStorage(listOfUsers,USERS_DATA_KEY);
        window.location = "homePage.html"
    }
    checkDuplicates()
}

// This function will check if the route already exists by checking if the destination already appears
// in the validRoutesArray
// Input: None
// Output: newValidAirportRoutes with no duplicate routes 
function checkDuplicates()
{
    newValidAirportRoutes = [];
    let newArray = []; 
    //New array holds route ids. The for loop makes sure a route id is never added twice. 
    for (let i = 0; i < validAirportRoutes.length; i++)
    {
        if(!newArray.includes(validAirportRoutes[i].destination.id))
        {
            //If the id of the route being checked is not in newArray, the id is added to new array and the route
            //is added to newValidAirportRoutes
            newArray.push(validAirportRoutes[i].destination.id)
            newValidAirportRoutes.push(validAirportRoutes[i])
        }
    }
    showAirportRoutes()
} 
// This function will show all of the routes in the newValidAirportRoutes array as a polyline on the map
// This will also display markers at the destination and source airport
// Input: None
// Output: Array with all markers
function showAirportRoutes()
{
    removeMarkers(markers); //Removing old markers
    showMarkers(newValidAirportRoutes); //Showing the markeres for the airports bookending the routes
    showMarkers(selectedRoutesArray); //Showing the markers for the airports bookending the routes the user has user

    let location = newValidAirportRoutes[0].source;
	let marker = new mapboxgl.Marker({ "color": "#FF8C00" });
	marker.setLngLat(location.coordinates);
	let popup = new mapboxgl.Popup({ offset: 45});
	popup.setHTML(location.description);

	marker.setPopup(popup);

	// Display the marker.
    marker.addTo(map);
    markers.push(marker)
    
	// Display the popup.
    popup.addTo(map);
    map.setCenter(location.coordinates);

    //Adding all the routes to the map
    for (let i = 0 ; i < newValidAirportRoutes.length; i++)
    {
        let object = {
        type: "geojson",
        data: {
        type: "Feature",
        properties: {},
        geometry: {
        type: "LineString",
        coordinates: [newValidAirportRoutes[i].destination.coordinates, newValidAirportRoutes[i].source.coordinates]
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
        map.on('click', `routes${i}`, function () {
            onRouteClick(i)
        })
    }
    showSelectedRoutes(selectedRoutesArray, "selectedRoutes");
    updateFlightDisplay();    
}


// This function will run when a route is clicked on the map, adding the flight to the trip for the user
// This will also update local storage with all the new information
// Input: Route ID
// Output: None
function onRouteClick(i)
{
    if(!checkIfDataExistsLocalStorage(SELECTED_ROUTE_KEY))
    {
       updateLocalStorage(selectedRoutesArray, SELECTED_ROUTE_KEY);
    }
    selectedRoutesArray = localStorage.getItem(SELECTED_ROUTE_KEY);
    selectedRoutesArray = JSON.parse(selectedRoutesArray);
    //Removes all  the old routes (for the previous city)
    for (let j = 0; j < newValidAirportRoutes.length; j++)
    {
        map.removeLayer(`routes${j}`)
        map.removeSource(`routes${j}`)
    }
    selectedRoutesArray.push(newValidAirportRoutes[i]) //Adding the route just chosen to the selectedRoutesArray
    removeMarkers(markers) //Removes old markers (from the previous city)
    let userRecentTrip = listOfUsers.users[currentUserRef].trips[listOfUsers.users[currentUserRef].trips.length - 1]; //Pulling the currently unfinalised trip from local storage
    userRecentTrip.createFlight(newValidAirportRoutes[i].source.code, newValidAirportRoutes[i].destination.code, newValidAirportRoutes[i].airline, newValidAirportRoutes[i].source.description, newValidAirportRoutes[i].destination.description, newValidAirportRoutes[i].stops) //Creating the flight for the trip just clicked on
    let userRecentFlight = listOfUsers.users[currentUserRef].trips[listOfUsers.users[currentUserRef].trips.length - 1].flights[listOfUsers.users[currentUserRef].trips[listOfUsers.users[currentUserRef].trips.length - 1].flights.length - 1]; //Getting the flight we just created
    userRecentFlight.setDestinationCode(newValidAirportRoutes[i].destination.id); //Setting the destination for the flight
    userRecentFlight.setStops(newValidAirportRoutes[i].stops); //Setting the stops for the old flight
    userRecentFlight.setDestinationCoordinates(newValidAirportRoutes[i].destination.coordinates); //Setting the destination coordinates for the old flight
    userRecentFlight.setSourceCoordinates(newValidAirportRoutes[i].source.coordinates); //Setting the source coordinates for the old flight
    updateLocalStorage(listOfUsers, USERS_DATA_KEY); //Updating local storage for the user (ie. the flight they just added)
    getRoutesForAirport(newValidAirportRoutes[i].destination.id); //Loads all the routes for the destination airport
    updateLocalStorage(selectedRoutesArray, SELECTED_ROUTE_KEY); //Updating the local storage for selectedRoutesArray
}

// This function will remove all routes from the map by removing the layers and sources
// Input: Routes array to be removed and ID for the layers
// Output: None
function removeRoutes(routes, id)
{
    for (let i = 0; i < routes.length; i++)
    {
        map.removeLayer(`${id}${i}`);
        map.removeSource(`${id}${i}`);
    }
}

// This function will display markers at each airport location in the inputted array
// Input: Routes array with all airports to be displayed
// Output: markers array with all markers
function showMarkers(routes)
{
    for (let i = 0; i < routes.length; i++)
    {
        //Code to run for the first route (because it needs a source)
        if (i === 0)
        {
            let location = routes[0].source;
            let marker = new mapboxgl.Marker({ "color": "#FF8C00" }); //Creating the marker
            marker.setLngLat(location.coordinates); //Setting its coordinates
            let popup = new mapboxgl.Popup({ offset: 45}); //Creating the popup
            popup.setHTML(location.description); //Setting its contents
            marker.setPopup(popup); //Adding the popup to the marker
            marker.addTo(map); //Displaying the marker
            markers.push(marker); //Adding it to the markers array
        }
        
        //Code to run for the rest of the routes. See above for more detailed comments
	    let location = routes[i].destination;
        let marker = new mapboxgl.Marker({ "color": "#FF8C00" });
        marker.setLngLat(location.coordinates);
        let popup = new mapboxgl.Popup({ offset: 45});
        popup.setHTML(location.description);
        marker.setPopup(popup);
        marker.addTo(map);
        markers.push(marker);
    }
}

// This function will remove all markers from the map
// Input: mark - array that contains all markers to be removed
// Output: None
function removeMarkers(mark)
{
    //Running through all markers
    for (let i = 0; i < mark.length; i++)
    {
        //Running through the markers in selected routes array
        for (let j = 0; j < selectedRoutesArray.length; j++)
        {
            //This if statement makes sure that markers in the selectedRoutesArray (ones the user has already booked)
            if ((mark[i]._lngLat.lng !== selectedRoutesArray[j].destination.coordinates[0] && mark[i]._lngLat.lat !== selectedRoutesArray[j].destination.coordinates[1]) || (mark[i]._lngLat.lng !== selectedRoutesArray[j].source.coordinates[0] && mark[i]._lngLat.lat !== selectedRoutesArray[j].source.coordinates[1]))
            {
                mark[i].remove();
            }
        }
    }
}

// This function will show routes as a polyline on the map
// Input: routes - array containing routes to be shown on the map, id - string - desired id for the layers
// Output: None
function showSelectedRoutes(routes, id)
{
    //Adds polyline for each route in the inputted array
    for (let j = 0; j < routes.length; j++)
    { 
        //Creating the line object
        let object = {
        type: "geojson",
        data: {
        type: "Feature",
        properties: {},
        geometry: {
        type: "LineString",
        coordinates: [routes[j].destination.coordinates, routes[j].source.coordinates]
        }
        }
        };
        //Adding it to the layer
        map.addLayer({
        id: `${id}${j}`,
        type: "line",
        source: object,
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": "#555", "line-width": 6 }
        });
        map.moveLayer(`${id}${j}`) //Makes sure all the layers have a unique id
        
    }
}

// This function will go to the trip confirmation page as it is only accessible from selecting locations page
// Input: None
// Output: None
function goToConfirmationPage()
{
    window.location = "tripConfirmation.html"
}

// This function will update the output area to the right of the map with the current trip flight information
// Input: None
// Output: None
function updateFlightDisplay()
{
    //Runs through selected routes array and displays summary on the right of the page
    outputAreaRef.innerHTML = ``;
    for (let i = 0; i < selectedRoutesArray.length; i++)
    {
        outputAreaRef.innerHTML += `Flight ${i + 1}: Departure: ${selectedRoutesArray[i].source.code}, Arrival: ${selectedRoutesArray[i].destination.code}, No. of stops ${selectedRoutesArray[i].stops} <br>`;
    }
}
// This function will allow the user to undo last flight. It will delete the flight from the user instance
// and update teh local storage
// Input: None
// Output: None
function undoFlight()
{
    selectedRoutesArray = localStorage.getItem(SELECTED_ROUTE_KEY);
    selectedRoutesArray = JSON.parse(selectedRoutesArray);
    removeRoutes(selectedRoutesArray, "selectedRoutes"); //Removes the scheduledRoutesArray from the map
    selectedRoutesArray.pop(); //Deletes the last scheduled route
    listOfUsers.users[currentUserRef].trips[listOfUsers.users[currentUserRef].trips.length - 1].flights.pop() //Deletes the corresponding flight
    updateLocalStorage(listOfUsers, USERS_DATA_KEY); //Updates local storage for the user
    updateFlightDisplay(); //Redisplays the flight info
    updateLocalStorage(selectedRoutesArray, SELECTED_ROUTE_KEY); //Updates selectedRoutesArray
    removeRoutes(newValidAirportRoutes, "routes") //Removes the cities routes on the map
    if (selectedRoutesArray.length > 0)
    {
        //If flight undone is not the first, runs getRoutesForAirport for the previous flight
        getRoutesForAirport(selectedRoutesArray[selectedRoutesArray.length - 1].destination.id);
    }
    else 
    {
        //If it is the first, runs getRoutesForAirport for the city selected on the homepage
        getRoutesForAirport(selectedCityId);
    }
    showSelectedRoutes(selectedRoutesArray, "selectedRoutes"); //Reshow selected routes array, without the deleted route
}

