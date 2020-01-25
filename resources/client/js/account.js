function pageLoad() {
    let name = Cookies.get("firstName");
    const id = Cookies.get("userID");
    document.getElementById("header").innerHTML = name;



    let myBookings = '<table>' +
        '<tr>' +
        '<th>Booking</th>' +
        '<th>Timing</th>' +
        '<th>Remove Booking</th>' +
        '</tr>';
    // Creates a table for the bookings

        listUsers();
        // Populates the UserDetails part of the account page
        fetch('/PersonalBookingsController/ListAllUserBookings/' + id, {method: 'get'}
        ).then(response => response.json()
        ).then(bookings => {
            // Gets all the bookings for the logged in user
           for(let booking of bookings){
                // Loops through the bookings retrieved
               myBookings += `<tr>` +
                   `<td>${booking.description}</td>` +
                   `<td id="${booking.bookingID}">${timing(booking.bookingID, booking.bookingType)}</td>` +
                   `<td>` +
                   `<button class='removeButton' booking-id="${booking.bookingID}" booking-type="${booking.bookingType}">Remove Booking</button>` +

                    `</td>` +
                   `</tr>`;
                // Populates the table with the collected information

           }
            myBookings += '</table>';

            document.getElementById("bookingDetails").innerHTML = myBookings;
            // Populates the Div in the HTML file with the table
            addEventListeners();



        });



    checkLogin();
}

function timing(bookingID, bookingType){
    if(bookingType == 3){
        // If it is a freeplay booking
        fetch('/ScheduleController/ListFreeplayBookingTiming/' + bookingID, {method: "get"}
        ).then(response => response.json()
        ).then(timing => {
        // Retrieves the day and time of the booking

            if (timing.day == 1){
                document.getElementById(bookingID).innerHTML = "Monday, " + timing.time + ":00 - " + (timing.time + 1) +":00";
                // Sets the innerHTML of the section of the table to the day and the time
            }else if (timing.day == 2){
                document.getElementById(bookingID).innerHTML = "Tuesday, " + timing.time + ":00 - " + (timing.time + 1) +":00";

            }else if (timing.day == 3){
                document.getElementById(bookingID).innerHTML = "Wednesday, " + timing.time + ":00 - " + (timing.time + 1) +":00";


            }else if (timing.day == 4){
                document.getElementById(bookingID).innerHTML = "Thursday, " + timing.time + ":00 - " + (timing.time + 1) +":00";

            }else if (timing.day == 5){
                document.getElementById(bookingID).innerHTML = "Friday, " + timing.time + ":00 - " + (timing.time + 1) +":00";

            }else{
                document.getElementById(bookingID).innerHTML = "Saturday, " + timing.time + ":00 - " + (timing.time + 1) +":00";

            }
            // If statements depending on which day of the week
        });
    }
    else{
        // If it is not a freeplay booking (lasts longer than one hour)
        let max = 0;
        let min = 19;
        // Set a min and a max
        fetch('/ScheduleController/ListBookingTiming/' + bookingID, {method: "get"}
        ).then(response => response.json()
        ).then(timings => {
            // Gets the day and time of a booking
            console.log(timings);
            for(let timing of timings){
                if(max < timing.time){
                    max = timing.time;
                }
                if (min > timing.time){
                    min = timing.time;
                }
                // Finds the start and end times

                if (timing.day == 1){
                    document.getElementById(bookingID).innerHTML = "Monday, " + min + ":00 - " + max +":00";
                    // Sets the innerHTML of the section of the table to the day and the time
                }else if (timing.day == 2){
                    document.getElementById(bookingID).innerHTML = "Tuesday, " + min + ":00 - " + max +":00";

                }else if (timing.day == 3){
                    document.getElementById(bookingID).innerHTML = "Wednesday, " + min + ":00 - " + max +":00";


                }else if (timing.day == 4){
                    document.getElementById(bookingID).innerHTML = "Thursday, " + min + ":00 - " + max +":00";

                }else if (timing.day == 5){
                    document.getElementById(bookingID).innerHTML = "Friday, " + min + ":00 - " + max +":00";

                }else{
                    document.getElementById(bookingID).innerHTML = "Saturday, " + min + ":00 - " + max +":00";

                }
                // If statements depending on which day of the week
            }
        });
    }
}

function addEventListeners() {

    let removeButton = document.getElementsByClassName("removeButton");
    // Gets each button
    for(let button of removeButton) {
        button.addEventListener("click", removeBooking);
        // Calls the removeBooking function on click
    }
}

function listUsers(){

    let id = Cookies.get("userID");

    fetch('/UserController/ListUser/' + id, {method:'get'}
    ).then(response => response.json()
    ).then(userDetails => {
        let detailsArray = [userDetails.firstName, userDetails.lastName, userDetails.password, userDetails.email];


        document.getElementById("firstNameDetails").innerHTML=detailsArray[0];
        document.getElementById("lastNameDetails").innerHTML=detailsArray[1];
        document.getElementById("emailDetails").innerHTML=detailsArray[3];
        document.getElementById("passwordDetails").innerHTML=detailsArray[2];
        document.getElementById("resetEmail").innerHTML="<a href='newEmail.html'>Change Email</a>";
        document.getElementById("resetPassword").innerHTML="<a href='newPassword.html'>Change Password</a>";

    });
}

function removeBooking(event){

    let ok = confirm("Are you sure?");
    // An alert pops up with a yes or no option
    if(ok === true){
        // If they select yes
        console.log(event.target.getAttribute("booking-type"));
        let bookingID = event.target.getAttribute("booking-id");
        let bookingType = event.target.getAttribute("booking-type");
        let userID = Cookies.get("userID");
        // Gets all of the booking/user data
        let formData = new FormData();
        formData.append("userID", userID);
        formData.append("bookingID", bookingID);
        // Creates and appends the information to the formData list

        if(bookingType == 3){
            // If it is a freeplay booking (can delete the whole booking)
            console.log("deleting");
            fetch('/PersonalBookingsController/DeleteUsersBooking', {method: 'post', body: formData}
            ).then(response => response.json()
            ).then(responseData => {
                if (responseData.hasOwnProperty('error')) {
                    alert(responseData.error);
                }
            });
        }else{
            // If it is not a freeplay booking (can delete the user's connection with the booking, but not the booking itself)
            fetch('/PersonalBookingsController/DeleteUsersExistingBooking', {method: 'post', body: formData}
            ).then(response => response.json()
            ).then(responseData => {
                if (responseData.hasOwnProperty('error')) {
                    alert(responseData.error);
                }
            });
        }
        pageLoad();
        // Refreshes the page
    }
}

function checkLogin() {

    let email = Cookies.get("email");
    let name = Cookies.get("firstName");
    let logInHTML = '';

    if (email === undefined) {

        let editButtons = document.getElementsByClassName("editButton");
        for (let button of editButtons) {
            button.style.visibility = "hidden";
        }

        let deleteButtons = document.getElementsByClassName("deleteButton");
        for (let button of deleteButtons) {
            button.style.visibility = "hidden";
        }

        logInHTML = "Not logged in. <a href='/client/login.html'>Log in</a>";
    } else {

        let editButtons = document.getElementsByClassName("editButton");
        for (let button of editButtons) {
            button.style.visibility = "visible";
        }

        let deleteButtons = document.getElementsByClassName("deleteButton");
        for (let button of deleteButtons) {
            button.style.visibility = "visible";
        }

        logInHTML = "Logged in as " + name + ". <a href='/client/login.html?logout'>Log out</a>" + "<p><a href='/client/index.html'>Schedule</a></p>";

    }



    document.getElementById("loggedInDetails").innerHTML = logInHTML;

}
