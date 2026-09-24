import {userSignUp} from "../api/authApi.js";

let signupForm = document.getElementById('signUpForm');
let button = document.querySelector('.btn-primary');

let name = signupForm.elements.name;
let email = signupForm.elements.email;
let password = signupForm.elements.password;
let confirmPassword = signupForm.elements.confirmPassword;

let nameError = document.getElementById('nameError');
let emailError = document.getElementById('emailError');
let passWordError = document.getElementById('passWordError');
let confirmPassWordError = document.getElementById('confirmPassWordError');

button.addEventListener('click', async(e) => {
    e.preventDefault();

    if(!checkFormIsValid()) return;

    //sending the request
    let sendSignUpRequest = await userSignUp(name.value, email.value, password.value, confirmPassword.value);

    if(sendSignUpRequest.success === false) {
        showToast(sendSignUpRequest.message)
        return;
    }

    showToast(sendSignUpRequest.message);

    localStorage.setItem("token", sendSignUpRequest.token);
    localStorage.setItem("userName", sendSignUpRequest.user.name);

    window.location.href ='/html/reviews';
})

// LIVE TESTING
signupForm.addEventListener('input', async(e) => {
    if(e.target.name === "name" && name.value.length < 3) {
        addSignUpFieldError(name, nameError,"Name must be at least 3 characters");
    }
    else if(e.target.name === "name") {
        removeSignUpFieldError(name, nameError)
    }
    if (e.target.name === "email" && (email.value.length < 3 || !email.value.includes('@'))) {
        addSignUpFieldError(email, emailError, "Email should be more than 5 characters and contain @");
    }
    else if(e.target.name === "email") {
        removeSignUpFieldError(email, emailError);
    }
    if (e.target.name === "password" && password.value.length < 3) {
        addSignUpFieldError(password, passWordError,"Password should be more than 2 characters");
    }
    else if(e.target.name === "password") {
        removeSignUpFieldError(password, passWordError);
    }
    if (e.target.name === "confirmPassword" && password.value !== confirmPassword.value) {
        addSignUpFieldError(confirmPassword, confirmPassWordError,"Passwords don't match");
    }
    else if(e.target.name === "confirmPassword") {
        removeSignUpFieldError(confirmPassword, confirmPassWordError);
    }

    checkFormIsValid();
})

function addSignUpFieldError(inputField, errorField, text) {
    inputField.classList.add('error');
    errorField.textContent = text;
}

function removeSignUpFieldError(inputField, errorField) {
    inputField.classList.remove('error');
    errorField.textContent = "";
}

function checkFormIsValid() {
    let isNameValid = name.value.length > 3;
    let isEmailValid = email.value.includes('@');
    let isPasswordValid = password.value.length > 3;
    let isConfirmPasswordValid = password.value === confirmPassword.value;

    let isFormValid =isNameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid;

    button.disabled = !isFormValid;

    return isFormValid;
}

function showToast(text, ms = 2500) {
    let toast = document.getElementById("toast");
    toast.textContent = text;
    toast.classList.add("show");

    clearTimeout(toast.timerId);
    toast.timerId = setTimeout(()=> toast.classList.remove("show"), ms)
}
