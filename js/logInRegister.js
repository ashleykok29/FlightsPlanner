// Purpose: To login / register a user 
// Team: 39
// Author: Peter ROBERTS
// Last Edited: 30/10/2020

"use strict";

// The function addNewUser creates a new user
// Inputs: None
// Outputs: None
function addNewUser()
{
    // Retrieving the values input by the user     
    let firstName = document.getElementById("firstName").value;
    let lastName = document.getElementById("lastName").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirmPassword").value;

    if(password === confirmPassword) // Checking that passwords match
    {
       if(password.length >= 8) // Checking the password is greater than or equal to 8 characters long
       {
            let emailIsNew = true // Initialising the variable emailIsNew to be true 
            
            // The following code will run for the length of the listOfUsers array            
            for(let i = 0; i < listOfUsers.usersLength; i++)
            {
                if(email === listOfUsers.getUser(i).email) // If the provided email matches any of those in the list of users
                {
                    emailIsNew = false; // Set the variable emailIsNew to be false 
                    break; // Breaking out of the for loop
                }
            }
            if(emailIsNew) // If the email is new and not previously used
            {
                listOfUsers.addUser(email, password, firstName, lastName); // Adding a new user using the user input values 
                updateLocalStorage(listOfUsers,USERS_DATA_KEY); // Updating local storage 
                localStorage.setItem(CURRENT_USER_KEY,listOfUsers.usersLength - 1); // Logging the user in 
                window.location = "homePage.html"; // Directing the user to the homepage
            }
            else // If the email has been previously used by a user
            {
                alert("An account already exists with this email. Please login."); // Alerting user to log in rather than register
                location.reload() // Reloading the page
            }    
       }
       else // If the password is not long enough
       {
            alert("Password needs to be at least 8 characters"); // Alerting the user that their password needs to be longer
       }
    }
    else // If the passwords do not match
    {
        alert("Passwords do not match"); // Alerting the user that the two passwords do not match
    }
}

// The function login logs the user in
// Inputs: None
// Outputs: 'successful login' or 'email wrong'
function login()
{
    // Retrieving the values input by the user     
    let userEmail = document.getElementById("userEmail").value;
    let userPassword = document.getElementById("userPassword").value;
    
    // Finding User's Email
    let foundUserIndex = null; // Initialising the foundUserIndex to null
    
    // The following code will run for the length of the list of users
    for(let i = 0; i < listOfUsers.usersLength; i++)
    {
        if(userEmail === listOfUsers.getUser(i).email) // If the user entered email matches any emails
        {
            foundUserIndex = i; // Defining foundUserIndex to be the current index 
            break; // Breaking out of the for loop 
        }
    }
    
    if(foundUserIndex === null) // If the user does not exist
    {
        alert("Your account does not exist, please register"); // Alerting the user that the account does not exist
        location.reload(); // Reloading the page
        return "email wrong"; // Returning that the email was wrong 
    }
    
    if(userPassword === listOfUsers.getUser(foundUserIndex).password) // If the entered password is the same as the user's saved password
    {
        localStorage.setItem(CURRENT_USER_KEY,foundUserIndex); // Logging the user in
        window.location = "homePage.html"; // Directing the user to scheduled trips
        return "successful login"; // Returning that the login was successful 
    }
    else
    {
        alert("Your password is incorrect"); // Alerting the user that their password was incorrect
        location.reload(); // Reloading the page
        return "wrong password"; // Returning that the password is wrong
    }
}