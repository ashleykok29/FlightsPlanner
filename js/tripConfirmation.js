// Purpose: To allow the user to review and confirm their planned trip
// Team: 39
// Author(s): Jack ROGERS
// Last Edited: 30/10/2020
buttonOrName();

mapboxgl.accessToken = "pk.eyJ1IjoiZW5nMTAwMy10ZWFtMDM5IiwiYSI6ImNrZm5pczY5YzI1bmEzMnAxcWU0bDJrZTUifQ.Zk_otQX5HhgwcLR6Dldg5g";
let map = new  mapboxgl.Map({
	 container: 'mapTripConfirmation',
	center: [144.9648731,-37.8182711],
	zoom: 2.5,
	style: 'mapbox://styles/mapbox/streets-v9'
});

let scheduleIndex = localStorage.getItem(CURRENT_USER_KEY);
let tripIndex = localStorage.getItem(CURRENT_TRIP_KEY);
let currentUserTrip = listOfUsers.users[scheduleIndex].trips[listOfUsers.users[scheduleIndex].trips.length - 1]; // As this can only be accessed from selectingLocations.html the last trip added will always be displayed
function displayFlightInfo() {
    let output = ""; // Setting a blank string to output

    document.getElementById("country").innerHTML = currentUserTrip.country;
    let startDate = new Date(currentUserTrip.timeBooked);
    let formattedDate = longDateFormat(startDate);
    document.getElementById("departDate").innerHTML = formattedDate;

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
    // Sending the output to the id fightInfo on the html page
    document.getElementById("flightInfo").innerHTML = output;
}

// The function deleteTrip deletes a trip and does not save it
// Inputs: None
// Output: None
function deleteTrip()
{
    // Popup box comfirming that the user wants to delete the trip
    let confirmDelete = confirm("Are you sure you want to delete the trip?");
    
    if (confirmDelete == true) // If the the user confirms
    {
        listOfUsers.users[scheduleIndex].deleteTrip(listOfUsers.users[scheduleIndex].trips.length - 1); // Accessing the deleteTrip method in the Users class
        updateLocalStorage(listOfUsers,USERS_DATA_KEY); // Updating local storage 
        alert("Trip has been deleted"); // Alerting the user again
        window.location = "homePage.html"; // Redirecting the user back to the home page
    }    
}

function showTripMarkers(routes)
{
    for (let i = 0; i < routes.length; i++)
    {
        
	    let location = routes[i];
        if (location.coordinates !== "")
        {
			let cityDescription = "";
			if (i === routes.length - 1)
			{
				cityDescription = `Final City: `
			}
			else 
			{
				cityDescription = `City ${i + 2}: `
			}
            let marker = new mapboxgl.Marker({ "color": "#FF8C00" });
            marker.setLngLat(location.destinationCoordinates);
           
			let popup = new mapboxgl.Popup({ offset: 45});
			
            popup.setHTML(`${cityDescription}${location.arrivalCity}`);

            marker.setPopup(popup);

            // Display the marker.
            marker.addTo(map);
            
            // uncomment these to display all information about
            // Display the popup.
            popup.addTo(map);
        }
	}
	// source Marker
	let location = routes[0];
	let marker = new mapboxgl.Marker({ "color": "#FF8C00" });
	marker.setLngLat(location.sourceCoordinates);
           
    let popup = new mapboxgl.Popup({ offset: 45});
    popup.setHTML(`Starting City: ${location.departureCity}`);

    marker.setPopup(popup);

    // Display the marker.
    marker.addTo(map);
    popup.addTo(map);
}
function displayTrips(routes, id)
{
	map.setCenter(currentUserTrip.flights[0].destinationCoordinates);
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
	showTripMarkers(currentUserTrip.flights)
}
function goToScheduled()
{
    if(checkIfLoggedInUserExists())
    {
        window.location = "scheduledTrips.html"
    }
    if(!checkIfLoggedInUserExists())
    {
        let msg = confirm("Please log in or register to save your trip");
        if (msg == true)
        {
            window.location.href = "logInRegisterGhost.html";
        }
    }
}
displayFlightInfo()

setTimeout(() => displayTrips(currentUserTrip.flights, "userTrip"), 1000);
