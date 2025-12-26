import {userLogIn} from '../api/authApi.js';

let button = document.getElementById('sign-in-button');
let error = document.getElementById("loginError");
// let toast = document.getElementById("toast");

button.addEventListener('click', async(e) => {
    e.preventDefault();
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    let sendSignInRequest = await userLogIn(email, password);

    //showing error
    // if(!sendSignInRequest.success) {
    //     error.textContent = sendSignInRequest.message;
    // }

    //showing toast error
    if(!sendSignInRequest.success) {
        // toast.textContent = sendSignInRequest.message;
        // toast.classList.add("show");
        //
        // clearTimeout(toast.timerId);
        // toast.timerId = setTimeout(()=> toast.classList.remove("show"), 2500)
        showToastError(sendSignInRequest.message)
        return;
    }

    showToastError(sendSignInRequest.message)

    //set token
    localStorage.setItem("token", sendSignInRequest.token)
})

function showToastError(text, ms =2500) {
    let toast = document.getElementById("toast");
    // toast.textContent = sendSignInRequest.message;
    toast.textContent = text;
    toast.classList.add("show");

    clearTimeout(toast.timerId);
    toast.timerId = setTimeout(()=> toast.classList.remove("show"), ms)
}