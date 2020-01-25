function pageLoad(){
    document.getElementById("createAccountButton").addEventListener("click", createAccount);
    // Adds an event listener to call the 'createAccount' function
}

function createAccount(event){
    event.preventDefault();
    const form = document.getElementById("newAccountForm");
    const formData = new FormData(form);
    // Collects all the data inputted in the form

    fetch('/UserController/InsertNewUser', {method: "post", body: formData}
    ).then(response => response.json()
    ).then(responseData => {
        if (responseData.hasOwnProperty('error')) {
            alert(responseData.error);
        }
        window.location.href = '/client/login.html';
        // Returns to the login page
    });
}