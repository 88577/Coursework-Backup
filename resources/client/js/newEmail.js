function pageLoad(){
    document.getElementById("currentEmail").value = Cookies.get("email");
    document.getElementById("userID").value = Cookies.get("userID");
    document.getElementById("updateEmailButton").addEventListener("click", updateEmail);
}

function updateEmail(event) {
    event.preventDefault();
    let ok = confirm("Set email to " + document.getElementById("currentEmail").value);
    if(ok === true) {
        const form = document.getElementById("newEmailForm");
        const formData = new FormData(form);
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
        });

    }
}