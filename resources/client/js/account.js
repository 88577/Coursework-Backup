function pageLoad() {
    let name = Cookies.get("firstName");
    const id = Cookies.get("userID");
    document.getElementById("header").innerHTML = name;



    let myBookings = '<table>' +
        '<tr>' +
        '<th>Booking</th>' +
        '<th>Remove Booking</th>' +
        '</tr>';


    fetch('/UserController/ListUser/' + id, {method:'get'}
    ).then(response => response.json()
    ).then(userDetails => {
        let detailsArray = [userDetails.firstName, userDetails.lastName, userDetails.password, userDetails.email];


        document.getElementById("firstNameDetails").innerHTML=detailsArray[0];
        document.getElementById("lastNameDetails").innerHTML=detailsArray[1];
        document.getElementById("emailDetails").innerHTML=detailsArray[3];
        document.getElementById("passwordDetails").innerHTML=detailsArray[2];

    });
        fetch('/PersonalBookingsController/ListAllUserBookings/' + id, {method: 'get'}
        ).then(response => response.json()
        ).then(bookings => {
           console.log("hallo");
           for(let booking of bookings){

               myBookings += `<tr>` +
                   `<td>${booking.description}</td>` +
                   `<td>` +
                   `<button class="removeButton" booking-id="${booking.bookingID}">Remove Booking</button>` +

                    `</td>` +
                   `</tr>`;

           }
            myBookings += '</table>';

            let removeButtons = document.getElementsByClassName("removeButton");
            for (let button of removeButtons) {
                button.addEventListener("click", removeBooking);
            }


            document.getElementById("bookingDetails").innerHTML = myBookings;
        });



    checkLogin();
}

function removeBooking(event){
    const ok = confirm("Are you sure?");
    if(ok === true){
        let bookingID = event.target.getAttribute("booking-id");
        let userID = Cookies.get("userID");

        let formData = new FormData();
        formData.append("userID", userID);
        formData.append("bookingID", bookingID);


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
