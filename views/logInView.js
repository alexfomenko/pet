import {userLogIn} from '../api/authApi.js';

let button = document.getElementById('sign-in-button');

button.addEventListener('click', async(e) => {
    e.preventDefault();
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    let sendSignInRequest = await userLogIn(email, password);


})