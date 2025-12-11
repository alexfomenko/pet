import {userSignUp} from "../api/auth.js";

let button = document.querySelector('.btn-primary');

button.addEventListener('click', async(e) => {
    e.preventDefault();

    // saving current values
    let signupForm = document.getElementById('signUpForm');
    let name = signupForm.elements.name.value;
    let email = signupForm.elements.email.value;
    let password = signupForm.elements.password.value;
    // let confirmPassword = signupForm.querySelector('input[name="confirmPassword"]').value;
    let confirmPassword = signupForm.elements.confirmPassword.value;

    //checking values are not empty
    if(!name || !email || !password || ! confirmPassword) return alert("Please fill out all the fields");

    //checking email
    if(!email.includes('@')) return alert("Incorrect email");

    //checking passwords are matching and have correct length
    let isValid = password === confirmPassword && password.length > 2;
    if(!isValid) return alert("Passwords do not match or length is less than 2");

    //sending the request
    let sendSignInRequest = await userSignUp(name, email, password, confirmPassword);
})