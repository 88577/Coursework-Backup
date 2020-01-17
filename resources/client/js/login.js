function pageLoad() {

    if(window.location.search === '?logout') {
        document.getElementById('content').innerHTML = '<h1>Logging out, please wait...</h1>';
        logout();
    } else {
        document.getElementById("loginButton").addEventListener("click", login);
    }

}

function login(event) {

    event.preventDefault();

    const form = document.getElementById("loginForm");
    const formData = new FormData(form);

    fetch("/UserController/login", {method: 'post', body: formData}
    ).then(response => response.json()
    ).then(responseData => {

        if (responseData.hasOwnProperty('error')) {
            alert(responseData.error);
        } else {
            Cookies.set("email", responseData.email);
            Cookies.set("token", responseData.token);
            Cookies.set("userID", responseData.userID);
            Cookies.set("firstName", responseData.firstName);

            window.location.href = '/client/index.html';
        }
    });
}

function logout() {

    fetch("/UserController/logout", {method: 'post'}
    ).then(response => response.json()
    ).then(responseData => {
        if (responseData.hasOwnProperty('error')) {

            alert(responseData.error);

        } else {

            Cookies.remove("email");
            Cookies.remove("token");

            window.location.href = '/client/index.html';

        }
    });

}
