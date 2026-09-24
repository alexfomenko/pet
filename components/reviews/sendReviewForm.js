import {submitReview} from '../../api/reviewsApi.js';
import {createNewRow} from "./newReviewRow.js";
import {getAllCompanies} from "../../api/reviewsApi.js";

let showFormButton = document.getElementById('showFormButton');
let reviewForm = document.getElementById('reviewForm');
let sendReviewButton = document.getElementById('sendReviewButton');

// SHOW FORM

if(showFormButton) {
    showFormButton.addEventListener('click', () => {
        //check if user is logged in in order to show/hide name&email fields
        let token = localStorage.getItem('token');
        if(!token) {
            document.getElementById('personalData').classList.remove('hidden');
        }
        reviewForm.style.display = reviewForm.style.display === 'block' ? 'none' : 'block';
    })
}
else {
    console.log("error")
}

sendReviewButton.addEventListener('click', async () => {
    //saving data from the form
    let reviewsContainer = document.getElementById('reviewsContainer');

    let companyValue = document.getElementById('company').value.trim();
    let ratingValue = document.getElementById('rating').value.trim();
    let reviewValue = document.getElementById('review').value.trim();

    //getting userName fro, storage
    let userNameValue = localStorage.getItem('userName') || "Anonymous";

    //creating delete button
    let deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-btn');
    deleteButton.title = 'Delete review';
    deleteButton.textContent = '🗑️';

    // checking all the fields were filled out
    if (!companyValue || !ratingValue || !reviewValue) {
        alert("Please fill out all the fields")
        return;
    }

    // getting the current date and converting it
    let currentDate = new Date().toISOString();
    // unifying data
    let data = {
        company: companyValue,
        rating: ratingValue,
        review: reviewValue,
        date: currentDate,
    };

    //adding review to the page if the request was successful
    let requestResult = await submitReview(data);
    if (requestResult.success) {
        let reviewId = requestResult.parsedResponse.id;
        let userId = requestResult.parsedResponse.userId;
        console.log(reviewId)
        console.log(userId);
        let newReviewItem = createNewRow(reviewId, userId, companyValue, userNameValue, ratingValue, reviewValue, currentDate);
        reviewsContainer.appendChild(newReviewItem);

        //clean the form
        document.getElementById('company').value = '';
        document.getElementById('rating').value = '';
        document.getElementById('review').value = '';

        //hide the form
        document.getElementById('reviewForm').style.display = 'none';
    }
})


let searchInput = document.getElementById("company");
let results = document.getElementById("results"); //ul
let allCompanies;

searchInput.addEventListener('click', async() => {
    let sendGetAllCompaniesRequest = await getAllCompanies();
    allCompanies = sendGetAllCompaniesRequest.items;
    showCompanies(allCompanies);
})

function showCompanies(list) {
    results.style.display = "block";
    results.innerHTML = "";

    list.forEach((country) => {
        let li = document.createElement('li');
        li.textContent = country;
        results.appendChild(li);

        li.addEventListener('click', () => {
            searchInput.value = li.textContent;
            results.style.display = "none";
        })
    })
}

searchInput.addEventListener('input', () => {
    results.style.display = "block";
    results.innerHTML = "";

    let userCompanySearch = searchInput.value.toLowerCase();
    if(userCompanySearch) {
        let matchingCountries = allCompanies.filter((country) => {
            return country.toLowerCase().includes(userCompanySearch);
        })

        showCompanies(matchingCountries);

    }
})
