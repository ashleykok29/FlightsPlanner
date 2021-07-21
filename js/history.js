// Purpose: To run on load on the html document history to display the list of the user's past trips
// Team: 39
// Author(s): Jason LE & Ashley KOK
// Last Ammended: 30/10/2020

"use strict";

// The function tripIdCollector retrieves the contents of a table row 
// Inputs: None
// Outputs: None
function tripIdCollector() 
{
    let table = document.getElementById("historyDisplay"); // Retrieving the trips table
    let rows = table.getElementsByTagName("tr"); // Retrieving table rows
    for (let i = 0; i < rows.length; i++) // For the number of rows
    { 
        let currentRow = table.rows[i]; // Setting the currentRow to the current table row
        currentRow.onclick = afterID(currentRow); // Onclick function run after a row is clicked
    }
}

// The function afterID saves the trip index to Local Storage
// Inputs: Table Row
// Outputs: None (but it returns itself)
function afterID(row) 
{ 
    return function() 
    {
        let cell = row.getElementsByTagName("td")[0]; // Getting the first cell of the row
        let tripNumber = cell.innerHTML; // Getting the value in that cell (the trip number)
        let theTripIndex = Number(tripNumber) - 1; // Getting the trip index (rather than number)
        localStorage.setItem(CURRENT_TRIP_KEY, JSON.stringify(theTripIndex)); // Setting the index to local storage
        window.location = "detailedHistory.html"; // Redirecting to Detailed Scheduled Trips
    };
};

// The function displayHistoricTrips displays the list of past trips stored under the user in a table
// Inputs: None
// Outputs: None 
function displayHistoricTrips()
{
    let scheduleIndex = localStorage.getItem(CURRENT_USER_KEY); // Getting the user index
    let output = ""; // Setting output as a blank string
    let tripNumber = 0;

    // For every trip stored under the current user, the following code will run
    for (let j = 0; j < listOfUsers.users[scheduleIndex].trips.length; j++) 
    {
        let currentDate = new Date(); // Getting the current date
        let tripDate = new Date(listOfUsers.users[scheduleIndex].trips[j].timeBooked); // Changing the trip date to a date object

        // If the current date is earlier than the trip date, the following code will run
        if (currentDate > tripDate)
        {
            // Defining the country, airport, date and trip number of the trip
            let country = listOfUsers.users[scheduleIndex].trips[j].country;
            let airport;
            if (listOfUsers.users[scheduleIndex].trips[j].flights[0] == undefined){
                airport = "Airport Name: Not Found";
            }
            else {
                airport = listOfUsers.users[scheduleIndex].trips[j].flights[0].departureCity;
            }
            let startDate = new Date(listOfUsers.users[scheduleIndex].trips[j].timeBooked);
            let startDateFormatted = startDate.getDate() +"-"+(startDate.getMonth()+1)+"-"+startDate.getFullYear();
            tripNumber++

             // The output that will be sent to the HTML file history.html
            output += `<tr> 
                    <td class="mdl-data-table__cell--non-numeric">${tripNumber}</td> 
                    <td class="mdl-data-table__cell--non-numeric">${country}</td>
                    <td class="mdl-data-table__cell--non-numeric">${airport}</td>
                    <td class="mdl-data-table__cell--non-numeric">${startDateFormatted}</td>
                    </tr>`;
        }
    }
    // Sending the output HTML code to the ID 'historyTripsDisplay'
    let tripDisplayRef = document.getElementById("historyTripsDisplay");
    tripDisplayRef.innerHTML = output;
}

// Code that runs on load
buttonOrName();
displayHistoricTrips();
tripIdCollector();
