// Purpose: To run on load on the html document scheduledTrips to display the list of the user's upcoming trips
// Team: 39
// Author(s): Ashley KOK & Jason LE
// Last Edited: 30/10/2020

"use strict";

// This function tripIdCollector retrieves the table row and runs the function afterClick
// Inputs: none
// Outputs: none 
function tripIdCollector() 
{
    let table = document.getElementById("scheduledDisplay"); // Retrieving the trips table
    let rows = table.getElementsByTagName("tr"); // Retrieving table rows
    for (let i = 0; i < rows.length; i++) // For the number of rows
    { 
        let currentRow = table.rows[i]; // Setting the currentRow to the current table row
       
        currentRow.onclick = afterClick(currentRow); // Onclick function 'afterClick' will run after a row is clicked
    }
}

// The function afterClick takes a row and gets the value in the '#' cell (the trip number)
// Input: table row
// Output: none
function afterClick(row) 
        { 
            return function () // Returning the function after it is called
            {
                let cell = row.getElementsByTagName("td")[0]; // Getting the first cell of the row
                let tripNumber = cell.innerHTML; // Getting the value in that cell (the trip number)
                let theTripIndex = Number(tripNumber) - 1; // Getting the trip index (rather than number)
                localStorage.setItem(CURRENT_TRIP_KEY, JSON.stringify(theTripIndex)); // Setting the index to local storage
                window.location = "detailedScheduledTrips.html"; // Redirecting to Detailed Scheduled Trips
            };
        };

// The function displayTrips displays the list of trips stored under the user in a table
// Inputs: None
// Outputs: None 
function displayTrips()
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
        if (currentDate <= tripDate)
        {
            // Defining the country, airport, date and trip number of the trip
            let country = listOfUsers.users[scheduleIndex].trips[j].country;
            let airport;

            if (listOfUsers.users[scheduleIndex].trips[j].flights[0] == undefined){ // If the airport is undefined
                airport = "Airport Name: Not Found"; // Set the airport variable to 'Airport Name: Not Found'
            }
            else { // If the airport is found 
                airport = listOfUsers.users[scheduleIndex].trips[j].flights[0].departureCity; // Setting it to the airport variable 
            }
            
            // Retrieving the date of the trip and setting it to the right format
            let startDate = new Date(listOfUsers.users[scheduleIndex].trips[j].timeBooked);
            let startDateFormatted = startDate.getDate() +"-"+(startDate.getMonth()+1)+"-"+startDate.getFullYear();
            tripNumber++ // Incrementing the trip number

            // The output that will be sent to the HTML file scheduledTrips.html
            output += `<tr> 
                    <td class="mdl-data-table__cell--non-numeric">${tripNumber}</td> 
                    <td class="mdl-data-table__cell--non-numeric">${country}</td>
                    <td class="mdl-data-table__cell--non-numeric">${airport}</td>
                    <td class="mdl-data-table__cell--non-numeric">${startDateFormatted}</td>
                    </tr>`;
        }
    }
    // Sending the output HTML code to the ID 'tripsDisplay'
    let tripDisplayRef = document.getElementById("tripsDisplay");
    tripDisplayRef.innerHTML = output;
}

// Code that runs on load
buttonOrName();
displayTrips();
tripIdCollector();