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

        listUsers();

        fetch('/PersonalBookingsController/ListAllUserBookings/' + id, {method: 'get'}
        ).then(response => response.json()
        ).then(bookings => {

           for(let booking of bookings){

               myBookings += `<tr>` +
                   `<td>${booking.description}</td>` +
                   `<td id="${booking.bookingID}">${timing(booking.bookingID, booking.bookingType)}</td>` +
                   `<td>` +
                   `<button class='removeButton' booking-id="${booking.bookingID}" booking-type="${booking.bookingType}">Remove Booking</button>` +

                    `</td>` +
                   `</tr>`;


           }
            myBookings += '</table>';

            document.getElementById("bookingDetails").innerHTML = myBookings;

            addEventListeners();



        });



    checkLogin();
}

function timing(bookingID, bookingType){
    if(bookingType == 3){
        fetch('/ScheduleController/ListFreeplayBookingTiming/' + bookingID, {method: "get"}
        ).then(response => response.json()
        ).then(timing => {


            if (timing.day == 1){
                document.getElementById(bookingID).innerHTML = "Monday, " + timing.time + ":00 - " + (timing.time + 1) +":00";

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
        });
    }
    else{
        let max = 0;
        let min = 19;
        fetch('/ScheduleController/ListBookingTiming/' + bookingID, {method: "get"}
        ).then(response => response.json()
        ).then(timings => {
            console.log(timings);
            for(let timing of timings){
                if(max < timing.time){
                    max = timing.time;
                }
                if (min > timing.time){
                    min = timing.time;
                }

                if (timing.day == 1){
                    document.getElementById(bookingID).innerHTML = "Monday, " + min + ":00 - " + max +":00";

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
            }
        });
    }
}

function addEventListeners() {

    let removeButton = document.getElementsByClassName("removeButton");
    for(let button of removeButton) {
        button.addEventListener("click", removeBooking);
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
    if(ok === true){
        console.log(event.target.getAttribute("booking-type"));
        let bookingID = event.target.getAttribute("booking-id");
        let bookingType = event.target.getAttribute("booking-type");
        let userID = Cookies.get("userID");
        let formData = new FormData();
        formData.append("userID", userID);
        formData.append("bookingID", bookingID);

        if(bookingType == 3){
            console.log("deleting");
            fetch('/PersonalBookingsController/DeleteUsersBooking', {method: 'post', body: formData}
            ).then(response => response.json()
            ).then(responseData => {
                if (responseData.hasOwnProperty('error')) {
                    alert(responseData.error);
                }
            });
        }else{
            fetch('/PersonalBookingsController/DeleteUsersExistingBooking', {method: 'post', body: formData}
            ).then(response => response.json()
            ).then(responseData => {
                if (responseData.hasOwnProperty('error')) {
                    alert(responseData.error);
                }
            });
        }
        pageLoad();

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
