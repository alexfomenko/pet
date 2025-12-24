import {userLogIn} from '../api/authApi.js';

let button = document.getElementById('sign-in-button');
let error = document.getElementById("loginError");

button.addEventListener('click', async(e) => {
    e.preventDefault();
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    let sendSignInRequest = await userLogIn(email, password);

    if(!sendSignInRequest.success) {
        error.textContent = sendSignInRequest.message;
    }

    //set token
    localStorage.setItem("token", sendSignInRequest.token)
})