function pageLoad(){
    document.getElementById("createAccountButton").addEventListener("click", createAccount);
}

function createAccount(event){
    event.preventDefault();
    const form = document.getElementById("newAccountForm");
    const formData = new FormData(form);

    fetch('/UserController/InsertNewUser', {method: "post", body: formData}
    ).then(response => response.json()
    ).then(responseData => {
        if (responseData.hasOwnProperty('error')) {
            alert(responseData.error);
        }
        window.location.href = '/client/login.html';
    });
}