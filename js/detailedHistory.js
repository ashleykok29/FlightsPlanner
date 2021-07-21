// Purpose: To run on load on the html page detailedHistory.html to display information regarding a selected trip
// Team: 39
// Author(s): Ashley KOK & Jason LE
// Last Edited: 01/11/2020

"use strict"

// The function displayFlightInfo retrieves all the flight detail of a specific trip and displays it in a table
// Inputs: None
// Outputs: None
function displayFlightInfo() {
    // Defining output to be an empty string 
    let output = "";

    // Sending the country to the IDs 'historyCountry' in detailedHistory.html 
    document.getElementById("historyCountry").innerHTML = currentUserTrip.country;
    
    // Turning the date into a Date Object and formatting
    let startDate = new Date(currentUserTrip.timeBooked);
    let formattedDate = longDateFormat(startDate);

    // Sending the country to the ID 'historyDepartDate' in detailedHistory.html 
    document.getElementById("historyDepartDate").innerHTML = formattedDate;

    // For every flight in the trip, this code runs
    for (let i = 0; i < currentUserTrip.flights.length; i++) {
        output +=   `<tr><td class="mdl-data-table__cell--non-numeric"><u>Flight ${i+1}: ${currentUserTrip.flights[i].departureLocation} to ${currentUserTrip.flights[i].arrivalLocation}</u></td>
                    <td class="mdl-data-table__cell--non-numeric"></td></tr>
                    <td class="mdl-data-table__cell--non-numeric">Airline:</td>
                    <td class="mdl-data-table__cell--non-numeric">${currentUserTrip.flights[i].airlineCode}</td></tr>
                    <td class="mdl-data-table__cell--non-numeric">Stops:</td>
                    <td class="mdl-data-table__cell--non-numeric">${currentUserTrip.flights[i].stops}</td></tr>
                    <td class="mdl-data-table__cell--non-numeric">Departure:</td>
                    <td class="mdl-data-table__cell--non-numeric">${currentUserTrip.flights[i].departureCity}</td></tr>
                    <td class="mdl-data-table__cell--non-numeric">Arrival:</td>
                    <td class="mdl-data-table__cell--non-numeric">${currentUserTrip.flights[i].arrivalCity}</td></tr>`;
    }
    // Sending the variable output to the "historyFlightInfo" ID
    document.getElementById("historyFlightInfo").innerHTML = output;
}

// The function showTripMarkers helps displays the markers and popups for the flights
// Inputs: The Route of the Trip
// Outputs: None
function showTripMarkers(routes)
{
    //Will for for every iteration of the routes array
    for (let i = 0; i < routes.length; i++)
    {
        // Defining the variable location as the current location in the route
        let location = routes[i];
        
        // If location.coordinates is not empty string, it will run create a marker which will display on the map
        if (location.coordinates !== "")
        {
            let cityDescription = ""; // Initialising cityDescription to a blank string

            // The if loop checks if the current index is the final city or a 'middle city' for the trip and will describe the popup accordingly
			if (i === routes.length - 1) // If it is the last element, it is the final city 
			{
				cityDescription = `Final City: `;
			}
			else // Otherwise, the city number is dependant on the current iteration
			{
				cityDescription = `City ${i + 2}: `;
            }
            
            // Creating the Marker
            let marker = new mapboxgl.Marker({ "color": "#FF8C00" });
            marker.setLngLat(location.destinationCoordinates);
            
            // Creating the Popup
			let popup = new mapboxgl.Popup({ offset: 45});
		    popup.setHTML(`${cityDescription}${location.arrivalCity}`);
            marker.setPopup(popup);

            // Displaying the marker.
            marker.addTo(map);
            
            // Displayubg the popup.
            popup.addTo(map);
        }
	}
	// Source Marker; Creating the popup for the initial city (Starting Location)
	let location = routes[0]; // The first element in the routes array
	let marker = new mapboxgl.Marker({ "color": "#FF8C00" }); // Initialising a marker and setting its colour
	marker.setLngLat(location.sourceCoordinates); // Setting the location of the marker 
           
    let popup = new mapboxgl.Popup({ offset: 45}); // Intialising a popup and offsetting it
    popup.setHTML(`Starting City: ${location.departureCity}`); // Setting the HTML of the popup 

    marker.setPopup(popup); // Setting the popup to the marker 

    // Displaying the marker and the popup 
    marker.addTo(map);
    popup.addTo(map);
}

// The function displayTrips displays the markers and popups for the flights as well as lines connecting each flight
// Inputs: Routes array, MapBox route ID
// Outputs: None
function displayTrips(routes, id)
{
    // Will center the map to the destination location
    map.setCenter(currentUserTrip.flights[0].destinationCoordinates);
    
    // For loops runs for each element in the routes array and will display lines connecting each of the locations
	for (let j = 0; j < routes.length; j++)
    { 
        let object = {
        type: "geojson",
        data: {
        type: "Feature",
        properties: {},
        geometry: {
        type: "LineString",
        coordinates: [routes[j].destinationCoordinates, routes[j].sourceCoordinates]
        }
        }
        };
        map.addLayer({
        id: `${id}${j}`,
        type: "line",
        source: object,
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": "#555", "line-width": 6 }
        });
        map.moveLayer(`${id}${j}`)
        
    }
	showTripMarkers(currentUserTrip.flights) // Running the function showTripMarkers to display the markers and popups
}

// Code that runs on load 
// Add map
mapboxgl.accessToken = "pk.eyJ1IjoicG1hcm9iZXJ0cyIsImEiOiJja2ZuaW1ybGgxZWM0MzhxdXN5ZnZlaG5lIn0.pEIxRQmI-wdpsdH_gb7jZg";
let map = new  mapboxgl.Map({
	container: 'mapHistory',
	zoom: 2.5,
	style: 'mapbox://styles/mapbox/streets-v9'
});

// Retrieving the indicies of the user and trip
let scheduleIndex = localStorage.getItem(CURRENT_USER_KEY);
let tripIndex = localStorage.getItem(CURRENT_TRIP_KEY);
let currentUserTrip = listOfUsers.users[scheduleIndex].trips[tripIndex];

buttonOrName(); 
displayFlightInfo(); // Displaying information for all flights
setTimeout(() => displayTrips(currentUserTrip.flights, "userTrip"), 1000); // Setting a timeout in case the map does not load in adequete time