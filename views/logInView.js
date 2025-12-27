import {userLogIn} from '../api/authApi.js';

let button = document.getElementById('sign-in-button');
let error = document.getElementById("loginError");
// let toast = document.getElementById("toast");

button.addEventListener('click', async(e) => {
    e.preventDefault();
    //1
    let email = document.getElementById('email').value;
    //2
    let password = document.getElementById('password').value;
    //3

    let sendSignInRequest = await userLogIn(email, password);
    //4

    //showing error
    // if(!sendSignInRequest.success) {
    //     error.textContent = sendSignInRequest.message;
    // }

    //showing toast error
    // без привидения типов
    // if (sendSignInRequest.success === false) {
    // }
    // с привидением типов
    if(!sendSignInRequest.success) {
        // toast.textContent = sendSignInRequest.message;
        // toast.classList.add("show");
        //
        // clearTimeout(toast.timerId);
        // toast.timerId = setTimeout(()=> toast.classList.remove("show"), 2500)
        showToast(sendSignInRequest.message)
        //5
        return;
    }

    showToast(sendSignInRequest.message)
    //6

    //set token
    localStorage.setItem("token", sendSignInRequest.token)
    //7

    // open review page
    window.location.href = '/html/reviews'


    //8

})

function showToast(text, ms = 2500) {
    let toast = document.getElementById("toast");
    // toast.textContent = sendSignInRequest.message;
    toast.textContent = text;
    toast.classList.add("show");

    clearTimeout(toast.timerId);
    toast.timerId = setTimeout(()=> toast.classList.remove("show"), ms)
}