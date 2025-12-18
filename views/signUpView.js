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

    // // saving current values
    // let name = signupForm.elements.name.value;
    // let email = signupForm.elements.email.value;
    // let password = signupForm.elements.password.value;
    // // let confirmPassword = signupForm.querySelector('input[name="confirmPassword"]').value;
    // let confirmPassword = signupForm.elements.confirmPassword.value;
    //
    // //checking values are not empty
    // if(!name || !email || !password || ! confirmPassword) return alert("Please fill out all the fields");
    //
    // //checking email
    // if(!email.includes('@')) return alert("Incorrect email");
    //
    // //checking passwords are matching and have correct length
    // let passwordIsValid = password === confirmPassword && password.length > 2;
    // if(!passwordIsValid) return alert("Passwords do not match or length is less than 2");

    //sending the request
    let sendSignInRequest = await userSignUp(name.value, email.value, password.value, confirmPassword.value);
})

// LIVE TESTING
signupForm.addEventListener('input', async(e) => {
    if(e.target.name === "name" && name.value.length < 3) {
        // name.classList.add('error');
        // nameError.textContent = "Name cannot be empty";
        addErrorClass(name, nameError,"Name must be at least 3 characters");
    }
    else if(e.target.name === "name") {
        // name.classList.remove('error');
        // nameError.textContent = "";
        removeErrorClass(name, nameError)
    }
    if (e.target.name === "email" && (email.value.length < 3 || !email.value.includes('@'))) {
        addErrorClass(email, emailError, "Email should be more than 5 characters and contain @");
    }
    else if(e.target.name === "email") {
        removeErrorClass(email, emailError);
    }
    if (e.target.name === "password" && password.value.length < 3) {
        addErrorClass(password, passWordError,"Password should be more than 2 characters");
    }
    else if(e.target.name === "password") {
        removeErrorClass(password, passWordError);
    }
    if (e.target.name === "confirmPassword" && password.value !== confirmPassword.value) {
        addErrorClass(confirmPassword, confirmPassWordError,"Passwords don't match");
    }
    else if(e.target.name === "confirmPassword") {
        removeErrorClass(confirmPassword, confirmPassWordError);
    }

    checkFormIsValid();
})

function addErrorClass(inputField, errorField, text) {
    inputField.classList.add('error');
    errorField.textContent = text;
}

function removeErrorClass(inputField, errorField) {
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

