function pageLoad() {
    let name = Cookies.get("firstName");
    let id = Cookies.get("userID");
    document.getElementById("header").innerHTML = name ;


    fetch('/UserController/ListUser/' + id, {method:'get'}
    ).then(response => response.json()
    ).then(userDetails => {
        let detailsArray = [userDetails.firstName, userDetails.lastName, userDetails.password, userDetails.email];

        document.getElementById("firstNameDetails").innerHTML=detailsArray[0];
        document.getElementById("lastNameDetails").innerHTML=detailsArray[1];
        document.getElementById("emailDetails").innerHTML=detailsArray[3];
        document.getElementById("passwordDetails").innerHTML=detailsArray[2];

    });
    let myBookings = '<table>'
        + '<tr>'
        + '<th>Booking</th>'
        + '<th>Timing</th>'
        + '</tr>';
    fetch('PersonalBookingsController/ListAllUserBookings/' + id, {method: 'get'}
    ).then(response => response.json()
    ).then(bookings => {
       for(let booking of bookings){
           console.log(booking.bookingID);
           fetch('BookingsController/ListBookings/' + booking.bookingID, {method: 'get'}
           ).then(response => response.json()
           ).then(bookingDetails => {
               let detailsArray = [bookingDetails.description];
                   myBookings += '<tr>' +
                       '<td>${detailsArray[0]}</td>' +
                       '<td>beep</td>' +
                       '</tr>';

           });

       }

    });
    myBookings += '</table>';
    document.getElementById("bookingDetails").innerHTML = myBookings;

    checkLogin();
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
