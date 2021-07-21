// Purpose: To display the home page of the web application
// Team: 39
// Author: Peter Roberts & Jack Rogers
// Last Edited: 01/11/2020

"use strict";

// The function countriesDropdownMenu creates a dropdown menu of all the countries
// Inputs: None
// Ouputs: None
function countriesDropdownMenu()
{
	let datalistRef = document.getElementById("countriesDropdown"); // Defining the HTML ID 'countriesDropdown'
	let output = ""; // Initialising output as a blank string

	// The following code will run for every element in the countryData array
	for(let i = 0; i < countryData.length; i++) 
	{
		output += `<option value = "${countryData[i]}">` // Creating an option value for the country
	}

	datalistRef.innerHTML = output; // Sending output to the HTML ID 
}

// The function getData sends a web service call
// Inputs: Country
// Outputs: None
function getData(country)
{
    let callback = "afterButtonPress"; // Defining the callback function 
    let url = `https://eng1003.monash/OpenFlights/airports/`; // Defining the URL to access the web service
    let params = `?country=${country}&callback=${callback}`; // Defining the parameters for the web service call 
    let script = document.createElement('script'); // Creating a script element
    script.src = url + params; // Specifying the external URL 
    document.body.appendChild(script); // Appending the script to the bottom of the body of the HTML file
}

// The function submitCountry initialises a trip from the homepage
// Inputs: None
// Outputs: None
function submitCountry()
{
    let currentUserRef = localStorage.getItem(CURRENT_USER_KEY); // Retrieving the current user key
    let userCountry = document.getElementById("countriesId").value; // Retrieving the user input country 
    let userStartDate = new Date(document.getElementById("tripStartDate").value); // Retrieving the user input date
	
	// Checking that the date is in the future
	if(userStartDate >= Date.now())
    {
        let countryValid = false; // Sets country as invalid
		
		// The following code will run for the length of the country array 
		for(let i = 0; i < countryData.length;i++)
        {
            if(userCountry === countryData[i]) // Checks that the user's selected country is in the array
            {
                countryValid = true; // Set country as valid
                listOfUsers.users[currentUserRef].createTrip(userStartDate,currentUserRef,userCountry); // Creating a new trip using the information
				updateLocalStorage(listOfUsers,USERS_DATA_KEY); // Updating local storage
				getData(userCountry); // Retrieving the country selected by the user 
				break;
            }
        }
        if(!countryValid) // If the country is invalid 
        {
            alert("Invalid Country"); // Alerting the user that the country is invalid
            location.reload(); // Refreshes the page 
        }
    }
    else // If the date is in the past
    {
        alert("Invalid Date: Please select a date in the future"); // Alerting the user that the date is invalid
        location.reload(); // Refreshes the page 
    }           
}

// The function afterButtonPress is the callback for getData().
// Its purpose is to populate a datalist with airports from the users chosen country and display said datalist
// Inputs: data (As retrieved by the getData() API call) 
// Outputs: None
function afterButtonPress(data)
{
	// Initialising blank strings as the output and outputCities variables
	let output = "";
	let outputCities = "";

	//Code to alert the user if they choose a country with only one airport
	if(data.length == 1)
	{
		alert("This country only has one airport, try another");
		location.reload();
	}

	//Puts the airport ID and name into the relevant arrays
	for (let i = 0; i < data.length; i++)
    {        
		citiesArray.push(data[i].name);
		citiesIdArray.push(data[i].airportId);
	}
	
	// For the length of the cities array, the following code will run
	for(let i = 0; i < citiesArray.length; i++)
	{
		// An option for the city will be added to the dropdown list 
		outputCities += `<option value = "${citiesArray[i]}">`
	}

	// Defining the output
	output = `<div>
				<p style = font-size:15px>Type Your City Below</p>
				<input list = "cities" name = "citiesName" id = "citiesId">
				<datalist id = "cities">
					<div id = citiesDropdown></div>
					${outputCities}
				</datalist>
			</div>
			<br>
			<div>
				<button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect" style = "color:black;" id = "startPlanTrip" onclick = "toSelectingLocations()">
					Start Planning Trip
				</button>
			</div>
			<br>
			<div>
				<button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect" style = "color:black;" onclick = "cancel()">
					Cancel
				</button>
			</div>`;

	document.getElementById("replaceOnPress").innerHTML = output;
}

// The function cancel cancels a trip
// It is used for cancelling "half-booked" trips: i.e. when the user hasn't selected any flights yet
// Inputs: None
// Outputs: None
function cancel()
{
	let currentUserRef = localStorage.getItem(CURRENT_USER_KEY); // Retrieving the user key
	listOfUsers.users[currentUserRef].deleteTrip(listOfUsers.users[currentUserRef].trips.length - 1); // Deleting the most recent trip
	updateLocalStorage(listOfUsers,USERS_DATA_KEY); // Updating local storage
	location.reload(); 
}


// The function toSelectingLocations sends the user to selectingLocations.html once 
// country, start city and date have all been chosen.
function toSelectingLocations()
{
	let cityValid = false;
	let currentUserRef = localStorage.getItem(CURRENT_USER_KEY); //Retrieves current logged in user
	let city = document.getElementById("citiesId").value; //Retrieves the data inputted by the user in the datalist
	for(let i = 0; i < citiesArray.length; i++) //This for loop makes sure the chosen city exists in the chosen country
	{
		if(city === citiesArray[i])
		{
			cityValid = true;
			listOfUsers.users[currentUserRef].trips[listOfUsers.users[currentUserRef].trips.length - 1].setStartCityId(citiesIdArray[i]);
			updateLocalStorage(listOfUsers,USERS_DATA_KEY);;
			window.location = "selectingLocations.html";
			break;
		}
	}
	if(!cityValid) //If the city is invalid (doesn't exist in chosen country) this code runs, as cityValid has not been set to true in the for loop
	{
		alert("Invalid City");
		cancel();
	}
}

// Defining the array of countries
let countryData = ["Afghanistan","Albania","Algeria","American Samoa","Angola","Anguilla","Antarctica","Antigua and Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Brazil","British Indian Ocean Territory","British Virgin Islands","Brunei","Bulgaria","Burkina Faso","Burma","Burundi","Cambodia","Cameroon","Canada","Cape Verde","Cayman Islands","Central African Republic","Chad","Chile","China","Christmas Island","Cocos (Keeling) Islands","Colombia","Comoros","Congo (Brazzaville)","Congo (Kinshasa)","Cook Islands","Costa Rica","Cote d'Ivoire","Croatia","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","East Timor","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Guiana","French Polynesia","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guadeloupe","Guam","Guatemala","Guernsey","Guinea","Guinea-Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Johnston Atoll","Jordan","Kazakhstan","Kenya","Kiribati","Korea","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Martinique","Mauritania","Mauritius","Mayotte","Mexico","Micronesia","Midway Islands","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Myanmar","Namibia","Nauru","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","Niue","Norfolk Island","North Korea","Northern Mariana Islands","Norway","Oman","Pakistan","Palau","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Helena","Saint Kitts and Nevis","Saint Lucia","Saint Pierre and Miquelon","Saint Vincent and the Grenadines","Samoa","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Georgia and the Islands","South Korea","South Sudan","Spain","Sri Lanka","Sudan","Suriname","Svalbard","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Togo","Tonga","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Turks and Caicos Islands","Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","Uruguay","Uzbekistan","Vanuatu","Venezuela","Vietnam","Virgin Islands","Wake Island","Wallis and Futuna","West Bank","Western Sahara","Yemen","Zambia","Zimbabwe"];

document.getElementById("submitCountryButton").addEventListener('click',function(){submitCountry()}) //Event listener for submit country

//Global arraus for the cities and cities Ids for the chosen country
let citiesArray = [];
let citiesIdArray = [];

//onload functions
buttonOrName();
countriesDropdownMenu();

//Code for adding the map
mapboxgl.accessToken = "pk.eyJ1IjoicG1hcm9iZXJ0cyIsImEiOiJja2ZuaW1ybGgxZWM0MzhxdXN5ZnZlaG5lIn0.pEIxRQmI-wdpsdH_gb7jZg";
let map = new  mapboxgl.Map({
	container: 'mapHomePage',
	zoom: 1,
	style: 'mapbox://styles/mapbox/streets-v9'
});

