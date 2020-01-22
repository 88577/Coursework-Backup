function pageLoad(){

    document.getElementById("userID").value = Cookies.get("userID");
    document.getElementById("updatePasswordButton").addEventListener("click", updatePassword);
}

function updatePassword(event) {
    event.preventDefault();
    if (document.getElementById("currentPassword").value !== document.getElementById("confirmPassword").value){
        alert("Passwords do not match");
        return;
    }
    let ok = confirm("Reset Password?");

    if(ok === true) {
        const password = document.getElementById("confirmPassword").value;
        const formData = new FormData();
        formData.append("userID", Cookies.get("userID"));
        formData.append("password", password);

        fetch('/UserController/UpdateUserPassword', {method: "post", body: formData}
        ).then(response => response.json()
        ).then(responseData => {
            if (responseData.hasOwnProperty('error')) {
                alert(responseData.error);
            }else{
                alert("Password Updated");
            }
            window.location.href = '/client/account.html';
        });

    }

}