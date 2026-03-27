import {getReviews, sendPostRequest} from '../api/reviewsApi.js';
import {createNewRow} from "./newReviewRow.js";
import {createReviewColumn} from "./newReviewRow.js";
// import {createReviewColumn} from "../utils/utils.js";
import {createButton} from "./reviewButton.js";
import {appState} from "../views/reviewsView.js";
import {getAllCompanies} from "../api/reviewsApi.js";

let showFormButton = document.getElementById('showFormButton');
let reviewForm = document.getElementById('reviewForm');
let sendReviewButton = document.getElementById('sendReviewButton');
let reviewContainer = document.getElementById('reviewsContainer');
console.log('FORM:', document.getElementById('reviewForm'));

// SHOW FORM

if(showFormButton) {
    showFormButton.addEventListener('click', () => {
        // reviewForm.classList.toggle('.hidden');
        // console.log("Hello")
        reviewForm.style.display = reviewForm.style.display === 'block' ? 'none' : 'block';
    })
}
else {
    console.log("error")
}

sendReviewButton.addEventListener('click', async (e) => {
    // e.preventDefault(); is required only for submit

    //saving data from the form
    let reviewsContainer = document.getElementById('reviewsContainer');

    let companyValue = document.getElementById('company').value.trim();
    let ratingValue = document.getElementById('rating').value.trim();
    let reviewValue = document.getElementById('review').value.trim();

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
    // let date = today.toLocaleDateString('ru-RU', {day: 'numeric', month: 'short', year: 'numeric'});

    // unifying data
    let data = {
        company: companyValue,
        rating: ratingValue,
        review: reviewValue,
        date: currentDate,
    };

    //adding review to the page if the request was successful
    let requestResult = await sendPostRequest(data);
    let reviewId = requestResult.json.id;
    console.log(reviewId)
    // if(requestResult.status === 201) {    or   // if(requestResult.success === 201) {

    if (requestResult.ok) {
//         // creating a new row
//         let newReviewItem = document.createElement('div');
//         newReviewItem.classList.add("review-item");
//         // newReviewItem.appendChild(deleteButton);
//
//         //adding review data to the table
//         newReviewItem.dataset.id = reviewId;
// //         newReviewItem.innerHTML = `
// //              <div class="column company"> ${companyValue} </div>
// //              <div class="column rating"> ${ratingValue} </div>
// //              <div class="column review"> ${reviewValue} </div>
// //              <div class="column date"> ${date} </div>
// //              <button class ="edit-btn" title = "Update review"> ✏️</button>
// //              <button class = 'delete-btn' title="Delete review">🗑️</button>
// // `
//         newReviewItem.appendChild(createReviewColumn(companyValue, 'column', 'company'));
//         newReviewItem.appendChild(createReviewColumn(ratingValue, 'column', 'rating'));
//         newReviewItem.appendChild(createReviewColumn(reviewValue, 'column', 'review'));
//         newReviewItem.appendChild(createReviewColumn(date, 'column', 'date'));
//
//         newReviewItem.appendChild(createButton('edit-btn', 'Update review', '✏️'));
//         newReviewItem.appendChild(createButton('delete-btn', 'Delete review', '🗑️'));

        let newReviewItem = createNewRow(reviewId, companyValue, ratingValue, reviewValue, currentDate);
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

// 1st iteration - static array of companies
// searchInput.addEventListener('click', (event) => {
//     showCompanies(companies);
// })

//2nd iteration - sending the request to get the array of companies
// searchInput.addEventListener('click', async(event) => {
//     let sendGetReviewRequest = await getReviews(1, 100);
//     let response = sendGetReviewRequest.items;
//     // allCompanies = [...new Set(response.map((item) => item.company))]; //only unique
//     allCompanies = Array.from(new Set(response.map((item) => item.company))); //only unique
//     showCompanies(allCompanies);
// })

//3rd iteration - the work of filtering was moved to backend
searchInput.addEventListener('click', async(event) => {
    let sendGetAllCompaniesRequest = await getAllCompanies();
    allCompanies = sendGetAllCompaniesRequest.items;
    // allCompanies = [...new Set(response.map((item) => item.company))]; //only unique
    // allCompanies = Array.from(new Set(response.map((item) => item.company))); //only unique
    showCompanies(allCompanies);
})

function showCompanies(list) {
    results.style.display = "block";
    results.innerHTML = "";

    list.forEach((country) => {
        let li = document.createElement('li');
        li.textContent = country;
        results.appendChild(li);

        li.addEventListener('click', (event) => {
            searchInput.value = li.textContent;
            results.style.display = "none";
        })
    })
}

searchInput.addEventListener('input', (e) => {
    results.style.display = "block";
    results.innerHTML = "";

    let userCompanySearch = searchInput.value.toLowerCase();
    if(userCompanySearch) {
        let matchingCountries = allCompanies.filter((country) => {
            return country.toLowerCase().includes(userCompanySearch);
        })

        showCompanies(matchingCountries);

        // matchingCountries.forEach((country) => {
        //     let li = document.createElement('li');
        //     li.textContent = country;
        //     results.appendChild(li);
        //
        //     li.addEventListener('click', (event) => {
        //         searchInput.value = li.textContent;
        //         results.style.display = "none";
        //
        //     })
        // })
    }
})

