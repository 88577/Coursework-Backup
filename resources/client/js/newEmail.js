function pageLoad(){
    document.getElementById("currentEmail").value = Cookies.get("email");
    document.getElementById("userID").value = Cookies.get("userID");
    // Gets the needed data about the logged in user
    document.getElementById("updateEmailButton").addEventListener("click", updateEmail);
    // Sets an event listener to call the function 'updateEmail'
}

function updateEmail(event) {
    event.preventDefault();
    let ok = confirm("Set email to " + document.getElementById("currentEmail").value);
    // Checks the user really wants to reset their email - shows the email their resetting to
    if(ok === true) {
        const form = document.getElementById("newEmailForm");
        const formData = new FormData(form);
        // Puts the inputted email into formData list
        formData.append("userID", Cookies.get("userID"));

        fetch('/UserController/UpdateUserEmail', {method: "post", body: formData}
        ).then(response => response.json()
        ).then(responseData => {
            if (responseData.hasOwnProperty('error')) {
                alert(responseData.error);
            }else {
                alert("Email Updated");
            }
            window.location.href = '/client/account.html';
            // Returns to accounts page
        });

    }
}