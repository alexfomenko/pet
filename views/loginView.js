import {userLogIn} from '../api/auth.js';

let button = document.getElementById('sign-in-button');

button.addEventListener('click', async(e) => {
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    let sendSignInRequest = await userLogIn(email, password);
})