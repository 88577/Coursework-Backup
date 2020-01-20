function pageLoad() {

    document.getElementById("bookingDiv").style.display = 'none';
    //Hides the bookingDiv
    let mySchedule = '<table class="mySchedule">'
        + '<tr class="mySchedule">'
        + '<th class="mySchedule" style="width:100px">Timing</th>'
        + '<th class="mySchedule" style="width:150px">Monday</th>'
        + '<th class="mySchedule" style="width:150px">Tuesday</th>'
        + '<th class="mySchedule" style="width:150px">Wednesday</th>'
        + '<th class="mySchedule" style="width:150px">Thursday</th>'
        + '<th class="mySchedule" style="width:150px">Friday</th>'
        + '<th class="mySchedule" style="width:150px">Saturday</th>'
        + '</tr>';
    //Creates the table that all the retrieved information will be put on

    fetch('/ScheduleController/ListAllBookings', {method:'get'}
    ).then(response => response.json()
    ).then(bookings => {
        // Calls the 'ListAllBookings' API call and places the retrieved information, in JSON format, in 'bookings'

            for (let i = 9; i < 19; i++) {
                // Repeats for each hour of the day
                let bookingArray = [];
                let bookingIDArray = [];
                let bookingColourArray = [];
                let dayArray = [];
                for(let j = 1; j < 7; j++){
                    dayArray[j-1] = j;
                    // Repeats for each day of the week
                    for(let booking of bookings){
                        // Looks through each booking object inside the bookings array
                        if((booking.day == j) && (booking.time == i)){
                            // If the booking is of this time and day
                            bookingArray[j-1] = "Booked";

                            bookingIDArray[j-1] = booking.bookingID;

                            bookingColourArray[j-1] = "green";

                            // Populates three new arrays for each day of a specific timing
                        }
                    }
                    if (bookingArray[j-1] == null){
                        // If there is no booking at this time
                        bookingArray[j-1] = "Empty";
                        bookingIDArray[j-1] = -1;
                        bookingColourArray[j-1] = "red";
                    }
                }

                mySchedule += `<tr>` +
                    `<td class="mySchedule">${i}:00</td>` +
                    `<td class="mySchedule" style="background-color: ${bookingColourArray[0]}"><button class="scheduleButton" data-id="${bookingIDArray[0]}" time-id="${i}:00 - ${i+1}:00" day="${dayArray[0]}" time="${i}">${bookingArray[0]}</button></td>` +
                    `<td class="mySchedule" style="background-color: ${bookingColourArray[1]}"><button class="scheduleButton" data-id="${bookingIDArray[1]}" time-id="${i}:00 - ${i+1}:00" day="${dayArray[1]}" time="${i}">${bookingArray[1]}</button></td>` +
                    `<td class="mySchedule" style="background-color: ${bookingColourArray[2]}"><button class="scheduleButton" data-id="${bookingIDArray[2]}" time-id="${i}:00 - ${i+1}:00" day="${dayArray[2]}" time="${i}">${bookingArray[2]}</button></td>` +
                    `<td class="mySchedule" style="background-color: ${bookingColourArray[3]}"><button class="scheduleButton" data-id="${bookingIDArray[3]}" time-id="${i}:00 - ${i+1}:00" day="${dayArray[3]}" time="${i}">${bookingArray[3]}</button></td>` +
                    `<td class="mySchedule" style="background-color: ${bookingColourArray[4]}"><button class="scheduleButton" data-id="${bookingIDArray[4]}" time-id="${i}:00 - ${i+1}:00" day="${dayArray[4]}" time="${i}">${bookingArray[4]}</button></td>` +
                    `<td class="mySchedule" style="background-color: ${bookingColourArray[5]}"><button class="scheduleButton" data-id="${bookingIDArray[5]}" time-id="${i}:00 - ${i+1}:00" day="${dayArray[5]}" time="${i}">${bookingArray[5]}</button></td>` +
                    `</tr>`;
                // Populates the table for a timing with each booking
            }
            mySchedule += '</table>';
            // Ends the table
            document.getElementById("tableDiv").innerHTML = mySchedule;
            // Makes the tableDiv on index.html the table
            let scheduleButtons = document.getElementsByClassName("scheduleButton");
            for(let button of scheduleButtons){
                button.addEventListener("click", book);
            }
            // Prepares the event handlers for each Book button
    });
    checkLogin();
}

function book(event){
    document.getElementById("bookButton").removeEventListener("click", bookNewBooking);
    document.getElementById("bookButton").removeEventListener("click", bookBooking);
    let id = event.target.getAttribute("data-id");
    let time = event.target.getAttribute("time-id");



    let btn = document.getElementById("bookButton");


    document.getElementById("bookButton").setAttribute("time", event.target.getAttribute("time"));
    document.getElementById("bookButton").setAttribute("day", event.target.getAttribute("day"));
    // Creates a variable for the specific bookingID
    if(id == -1){
        // If there is no bookingID
        document.getElementById("bookButton").addEventListener("click", bookNewBooking);
        document.getElementById("description").innerHTML = 'No Current Booking';
        document.getElementById("time").innerHTML = time;
        document.getElementById("bookingDiv").style.display = 'block';
        document.getElementById("bookButton").style.display = 'block';


    } else{
        // If there is a bookingID
        fetch('/BookingsController/ListBookings/' + id, {method: 'get'}
        ).then(response => response.json()
        ).then(booking => {
            console.log(booking.bookingType);
            // Fetches the booking information for that bookingID
            if(booking.hasOwnProperty('error')){
                alert(booking.error);
                // Error checking
            } else{
                document.getElementById("description").innerHTML = booking.description;
                document.getElementById("bookingDiv").style.display = 'block';
                document.getElementById("time").innerHTML = time;
                btn.setAttribute("bookingID", id);
                document.getElementById("bookButton").addEventListener("click", bookBooking);
            }
            if(booking.bookingType == 1){
                document.getElementById("bookButton").style.display = 'block';
            } else if(booking.bookingType == 2){
                document.getElementById("bookButton").style.display = 'block';
            } else{
                document.getElementById("bookButton").style.display = 'none';
            }
        });

        // Prepares event handler for button
        }
}
function bookNewBooking(event){
    const userID = Cookies.get("userID");
    // Gets logged in user's id
    fetch('/BookingsController/ListAllBookings', {method: 'get'}
    ).then(response => response.json()
    ).then(bookings => {
        for(let booking of bookings){
            let i = booking.bookingID + 1;
        }
    });

    let bookingID = "3";
    console.log("booking...");
    event.preventDefault();


    let formData = new FormData();
    formData.append("bookingID","3");
    // Freeplay booking
    formData.append("day", event.target.getAttribute("day"));
    // Set day of booking
    formData.append("time", event.target.getAttribute("time"));
    // Set time of booking

    fetch('/ScheduleController/InsertBookingTiming', {method: 'post', body: formData}
    ).then(response => response.json()
    ).then(responseData => {
        // Inserting into the Schedule Table
        if (responseData.hasOwnProperty('error')) {
            alert(responseData.error);
        }
        pageLoad();
        // Update the page with the new booking
    });


    console.log("New Booking");
    console.log(userID + " " + bookingID);
    document.getElementById("bookButton").removeEventListener("click", bookNewBooking);
    document.getElementById("bookButton").removeEventListener("click", bookBooking);
    // Reset the event listeners for the button
}

function bookBooking() {
    let userID = Cookies.get("userID");
    // Gets logged in user's id
    let bookingID = document.getElementById("bookButton").getAttribute("bookingID");
    // Gets the bookingID
    console.log("Existing Booking");
    console.log(userID + " " + bookingID);
    document.getElementById("bookButton").removeEventListener("click", bookBooking);
    document.getElementById("bookButton").removeEventListener("click", bookNewBooking);

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

        logInHTML = "Logged in as " + name + ". <a href='/client/login.html?logout'>Log out</a>" + "<p><a href='/client/account.html'>My Account</a></p>";

    }



    document.getElementById("loggedInDetails").innerHTML = logInHTML;

}



