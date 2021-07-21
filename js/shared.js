// Purpose: To share functions and information between the different HTML pages
// Team: 39
// Author: Peter ROBERTS, Jack ROGERS, Jason LE, Ashley KOK
// Last Edited: 01/11/2020

"use strict";

// Defining the keys for local storage
const USERS_DATA_KEY = "userDataKey";
const CURRENT_USER_KEY = "currentUserKey";
const CURRENT_TRIP_KEY = "currentTripKey";

// The UserList Class
class UserList
{
    constructor()
    {
        this._users = []; 
    }
    // Accessors
    get users()
    {
        return this._users;
    }

    get usersLength()
    {
        return this._users.length;
    }

    // Methods
    // addUser creates a new user
    // Inputs: email, password, first name, last name
    addUser(email, password, firstName, lastName)
    {
        let newUser = new User(email, password, firstName, lastName);
        this._users.push(newUser);
        return "user created";
    }

    // getUser returns the information of a user
    // Inputs: user index 
    // Outputs: the user class
    getUser(index)
    {
        return this._users[index];
    }

    // fromData takes the stringified data stored in local storage and pushes it onto an array
    // Inputs: The User List
    fromData(data)
    {
        this._users = []; // An empty array for the new user list

        // The following code will run for every user stored in local storage
        for(let i = 0; i < data._users.length; i++)
        {
            let user = new User(); // Creating a new User class 
            user.fromData(data._users[i]); // Using the fromData method of the User class to access data
            this._users.push(user); // Pushing the new user onto the users array 
        }
    }
}

// The User Class
class User
{
    constructor(email, password, firstName, lastName)
    {
        this._email = email;
        this._password = password;
        this._trips = [];
        this._firstName = firstName;
        this._lastName = lastName;
    }
    //Accessors
    get email()
    {
        return this._email;
    }
    get password()
    {
        return this._password;
    }
    get trips()
    {
        return this._trips;
    }
    get firstName()
    {
        return this._firstName;
    }
    get lastName()
    {
        return this._lastName;
    }

    // Methods
    // createTrip creates a new trip
    // Inputs: Trip Date, User, Country
    createTrip(date,user,country)
    {
        let trip = new Trip(date,user,country);
        this._trips.push(trip);
    }

    // deleteTrip deletes a trip
    // Inputs: Trip Index    
    deleteTrip(index)
    {
        this._trips.splice(index,1);
    }

    // fromData takes the stringified data stored in local storage and converts it into a class
    // Inputs: The user object
    fromData(object)
    {
        // Getting the properties of the object
        this._email = object._email;
        this._password = object._password;
        this._firstName = object._firstName;
        this._lastName = object._lastName;

        this._trips = []; // An empty trips array
        
        // The following code will run for every trip that exists under the user
        for(let i = 0; i < object._trips.length; i++)
        {
            let trip = new Trip(); // Creating a new trip class
            trip.fromData(object._trips[i]); // Using the fromData method in the Trip class
            this._trips.push(trip); // Pushing the trip into the trips array
        }
    }
}

// The Trip Class
class Trip
{
    constructor(date,user,country)
    {
    this._timeBooked = date;
    this._user = user;
    this._country = country;
    this._flights = [];
    this._startCityId = "";
    }
    
    // Accessors
    get timeBooked()
    {
        return this._timeBooked;
    }
    get user()
    {
        return this._user;
    }
    get country()
    {
        return this._country;
    }
    get flights()
    {
        return this._flights;
    }
    get flightsLength()
    {
        return this._flights.length;
    }
    get startCityId()
    {
        return this._startCityId;
    }
    
    // Methods
    // setStartCityId saves the departure location ID to the flight
    // Inputs: Departure City ID
    setStartCityId(cityId)
    {
        this._startCityId = cityId;
    }

    // createFlight creates a new flight
    // Inputs: Depature Location, Arrival Location, Airline Code, Departure City, Arrival City, Number of Stops
    createFlight(departureLocation,arrivalLocation, airlineCode, departureCity,arrivalCity, stops)
    {
        let flight = new Flights(departureLocation,arrivalLocation, airlineCode, departureCity,arrivalCity, stops);
        this._flights.push(flight);
    }

    // fromData extracts data from an object and puts it into a flight class
    // Inputs: A Trip Object 
    fromData(data)
    {
        this._timeBooked = data._timeBooked;
        this._user = data._user;
        this._country = data._country;
        this._startCityId = data._startCityId;

        this._flights = []; // Initialing an empty flights array

        // The following code will run for every flight available in the trip
        for (let i = 0; i < data._flights.length; i++)
        {
            let flight = new Flights(); // Creating a new Flight class instance
            flight.fromData(data._flights[i]); // Uses the fromData method in the flight class 
            this._flights.push(flight); // Pushing the new flight to the empty array
        }
    }
}

// The Flights class
class Flights
{
    constructor(departureLocation,arrivalLocation, airlineCode, departureCity,arrivalCity)
    {
        this._departureLocation = departureLocation;
        this._arrivalLocation = arrivalLocation;
        this._airlineCode = airlineCode;
        this._departureCity = departureCity;
        this._arrivalCity = arrivalCity;
        this._destinationCode = "";
        this._destinationCoordinates = [];
        this._sourceCoordinates = [];
        this._stops = "";
        
    }
    // Accessors
    get departureLocation()
    {
        return this._departureLocation;
    }
    get arrivalLocation()
    {
        return this._arrivalLocation;
    }
    get airlineCode()
    {
        return this._airlineCode; 
    }
    get departureCity()
    {
        return this._departureCity;
    }
    get arrivalCity()
    {
        return this._arrivalCity;
    }
    get destinationCode()
    {
        return this._destinationCode;
    }
    get stops()
    {
        return this._stops;
    }
    get destinationCoordinates()
    {
        return this._destinationCoordinates;
    }
    get sourceCoordinates()
    {
        return this._sourceCoordinates;
    }

    // Methods
    // setDestinationCode saves the destination code to the flight
    // Input: Destination City Code
    setDestinationCode(code)
    {
        this._destinationCode = code;
    }

    // setStops saves the number of stops to the flight
    // Input: Number of Stops
    setStops(stop)
    {
        this._stops = stop;
    }

    // setDestinationCoordinates saves the distination coordinates to the flight 
    // Input: Destination Coordinates
    setDestinationCoordinates(coords)
    {
        this._destinationCoordinates = coords;
    }

    // setSourceCoordinates saves the source coordinates to the flight 
    // Input: Source Coordinates
    setSourceCoordinates(coords)
    {
        this._sourceCoordinates = coords;
    }

    // fromData extracts the properties from a given object
    // Input: A Flight Object
    fromData(object)
    {
        this._departureLocation = object._departureLocation;
        this._arrivalLocation = object._arrivalLocation;
        this._airlineCode = object._airlineCode;
        this._departureCity = object._departureCity;
        this._arrivalCity = object._arrivalCity;
        this._destinationCode = object._destinationCode;
        this._stops = object._stops;
        this._destinationCoordinates = object._destinationCoordinates;
        this._sourceCoordinates = object._sourceCoordinates;
    }
}

// The function checkIfDataExistsLocalStorage checks if there is data stored in local storage
// Inputs: Local Storage Key 
// Outputs: Boolean (true or false)
function checkIfDataExistsLocalStorage(key)
{
    let data = localStorage.getItem(key); // Getting the the data using the key
    
    // If the data is not an empty string, not undefined and not null
    if(data != "" && typeof data != "undefined" && data != null) 
    {
        return true;
    }
    else
    {
        return false;
    }
}

// The function checkIfLoggedInUserExists checks if there is a logged in user
// Inputs: None
// Ouptuts: Boolean (true or false)
function checkIfLoggedInUserExists()
{
    let data = localStorage.getItem(CURRENT_USER_KEY);
    if(data != "" && typeof data != "undefined" && data != null && data != 0)
    {
        return true;
    }
    else
    {
        return false;
    }
}

// The function loginRedirectScheduled checks if the user is logged in before redirecting appropriately
// Inputs: None
// Outputs: None
function loginRedirectScheduled() 
{
    // If there is no user logged in
    if (checkIfLoggedInUserExists() == false) 
    {
        // An alert will warn the user that they have to log in first 
        let msg = confirm("Please log in first to view scheduled trips");
        if (msg == true) // If they choose 'confirm', they will be redirected to the log in / register page
        {
            window.location = "logInRegister.html"; // Directing the user
        }
    }
    else 
    {
        window.location = "scheduledTrips.html"; // Directing the user
    }
}

// The function loginRedirectHistory checks if the user is logged in before redirecting appropriately
// Inputs: None
// Outputs: None
function loginRedirectHistory()
{
    // If there is no user logged in
    if (checkIfLoggedInUserExists() == false) 
    {
        // An alert will warn the user that they have to log in first 
        let msg = confirm("Please log in first to view historical trips");
        if (msg == true) // If they choose 'confirm', they will be redirected to the log in / register page
        {
            window.location = "logInRegister.html"; // Directing the user
        }
    }
    else 
    {
        window.location = "history.html"; // Directing the user
    }
}

// The function redirectAllRoutes() directs the user to homePageAllRoutes.html
// Inputs: None
// Outputs: None
function redirectAllRoutes()
{
    window.location = "homePageAllRoutes.html" // Directing the user
}

// The function updateLocalStorage updates the local storage 
// Inputs: Data, Local Storage Key
function updateLocalStorage(data,key)
{
    // If the data is an object
    if (typeof(data) === "object")
    {
        data = JSON.stringify(data); // Stringifying the data first
    }
    
    localStorage.setItem(key,data); // Setting the item into local storage
}

// The function getDataLocalStorage retrieves data from the local storage
// Inputs: Local Storage Key
// Outputs: None
function getDataLocalStorage(key)
{
    let data = localStorage.getItem(key); // Initialising the data by getting item using its key
    try
    {
        data = JSON.parse(data); // Parsing the data
    }
    catch(e)
    {
        console.log(e)
    }
    finally
    {
        return data; // Returning the data 
    }
}

// The function sendToLogInRegister directs the user to the login/register page 
// Inputs: None
// Outputs: None
function sendToLogInRegister()
{
	window.location = "logInRegister.html"; // Directing the user
}

// The function buttonOrName determines whether there is a login/register button or a logout button
// Inputs: None
// Outputs: None 
function buttonOrName()
{
	let buttonRef = document.getElementById("logInRegisterButton"); // Initialising the html reference where the code will be sent
    
    // If there is a user currently logged in
    if(checkIfLoggedInUserExists())
	{
		let currentUserIndex = localStorage.getItem(CURRENT_USER_KEY); // Retrieving the user index
        
        // The html code for the Logout button, and addressing the user by their first name 
        buttonRef.innerHTML = `<br>
							<button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect" style = "color:white;" onclick = "logout()">
                                Logout
                            </button>
                            <p>Welcome, ${listOfUsers.getUser(currentUserIndex).firstName}</p>`
	}
	else
	{
        // The html code for a Login/Register button 
        buttonRef.innerHTML = `
                            <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect" style = "color:white;" onclick = "sendToLogInRegister()">
							    Login/Register
                            </button>`
	}
}

// The function logout logs a user out by clearing the User Index
// Input: None
// Output: None
function logout()
{
	localStorage.setItem(CURRENT_USER_KEY,0); // Setting the user key to 0 (the guest user)
	alert("You have successfully logged out"); // Alerting the user using a pop up box
    window.location = "homePage.html" // Directing the user to the home page 
}

// The function longDateFormat changes a date object into a long date format
// Input: Date (a date object)
// Output: A String of the formatted date
function longDateFormat(startDate) {
    let startDateFormatted = ""; // Initialising an empty string to store the formatted date

    if (startDate.getDate() == 11 || startDate.getDate() == 12 || startDate.getDate() == 13) { // if 11, 12 or 13, suffix is 'th', which does not follow traditional rules
        startDateFormatted += `${startDate.getDate()}th`;
    }
    else if (startDate.getDate() % 10 == 1) { // if last digit is 1, suffix 'st'
        startDateFormatted += `${startDate.getDate()}st`;
    }
    else if (startDate.getDate() % 10 == 2) { // if last digit is 2, suffix 'nd'
        startDateFormatted += `${startDate.getDate()}nd`;
    }
    else if (startDate.getDate() % 10 == 3) { // if last digit is 3, suffix 'rd'
        startDateFormatted += ` ${startDate.getDate()}rd`;
    }
    else { // for all other numbers, suffix 'th'
        startDateFormatted += `${startDate.getDate()}th`;
    }

    // Since Javascript utilises an index for the month, the months start a 0 = January
    if (startDate.getMonth() == 0) {
        startDateFormatted += ' January, ';
    }
    else if (startDate.getMonth() == 1) {
        startDateFormatted += ' February, ';
    }
    else if (startDate.getMonth() == 2) {
        startDateFormatted += ' March, ';
    }
    else if (startDate.getMonth() == 3) {
        startDateFormatted += ' April, ';
    }
    else if (startDate.getMonth() == 4) {
        startDateFormatted += ' May, ';
    }
    else if (startDate.getMonth() == 5) {
        startDateFormatted += ' June, ';
    }
    else if (startDate.getMonth() == 6) {
        startDateFormatted += ' July, ';
    }
    else if (startDate.getMonth() == 7) {
        startDateFormatted += ' August, ';
    }
    else if (startDate.getMonth() == 8) {
        startDateFormatted += ' September, ';
    }
    else if (startDate.getMonth() == 9) {
        startDateFormatted += ' October, ';
    }
    else if (startDate.getMonth() == 10) {
        startDateFormatted += ' November, ';
    }
    else if (startDate.getMonth() == 11) {
        startDateFormatted += ' December, ';
    }

    // Adding the year
    startDateFormatted += startDate.getFullYear();

    // Returning the formatted date
    return startDateFormatted;
}

// Code that runs on load 
let listOfUsers = new UserList(); // Creating global function listOfUsers as a new UserList 

// Checking if there is data in local storage
if(checkIfDataExistsLocalStorage(USERS_DATA_KEY))
{
    // If there is data in local storage, it is saved to the variable listOfUsers
    let data = getDataLocalStorage(USERS_DATA_KEY);
    listOfUsers = new UserList();
    listOfUsers.fromData(data);
}
else
{
    // Otherwise, listOfUsers is a new, blank UserList class instance
    updateLocalStorage(listOfUsers,USERS_DATA_KEY);
}

// Creating the anonymous/guest user 
if(listOfUsers.usersLength === 0)
{
    // If there are no users in listOfUsers
    listOfUsers.addUser("anon","7EQb{_!3JFsKPTzxxzD83h.Xnk}&<Sxc","anon"); // Adding a new user with 'anon' properties. Password needs to be "unguessable"
    updateLocalStorage(listOfUsers,USERS_DATA_KEY); // Updating local storage
    localStorage.setItem(CURRENT_USER_KEY,0); // Updating the user key
}