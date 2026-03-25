import {sendPostRequest} from "../api/reviewsApi.js";
import {renderReviewsV2} from "./newReviewArticleV2.js";
import {getCompanyReviews} from "../api/reviewsApiV2.js";
import {appState} from "../appState.js";


let addReviewButton =  document.querySelector('.title-button');
let closeButton = document.querySelector('.close-btn');
let overlay = document.getElementById('overlay');
let sendReviewButton = document.querySelector('.submit-btn');
let cancelButton = document.querySelector('.cancel-btn');

addReviewButton.addEventListener('click', async (e) => {
    // modal.style.display = 'flex';
    overlay.classList.add('active');
});
[closeButton, cancelButton].forEach(btn => {
    btn.addEventListener('click', () => {
        overlay.classList.remove('active');
    });
});

sendReviewButton.addEventListener('click', async (e) => {
    let company = document.querySelector('.company-name').textContent;
    let rating = Number(document.getElementById('company_rating').value);
    let review = document.getElementById('company_review').value;
    let name = document.getElementById('person_name').value; //TODO
    let email = document.getElementById('person_email').value; //TODO
    let date = new Date().toDateString();
    let data = {
        company,
        rating,
        review,
        name,
        email,
        date,
    };

    let request = await sendPostRequest(data);
    // let reviewId = requestResult.json.id; //TODO do I need ?
    // console.log(reviewId)

    if(request.ok) {
        let companyReviews = await getCompanyReviews(company, appState.currentPage, appState.currentPageLimit, appState.filter, appState.sort);
        let reviews = companyReviews.items;
        renderReviewsV2(reviews);

        //TODO add clear form

        overlay.classList.remove('active'); //hide form
    }
})

overlay.addEventListener('click',(e) => {
    if(e.target === overlay) {
        // modal.style.display = 'none';
        overlay.classList.remove('active');
    }
})

//TODO 2 - change server for sendReview making name and email optional 3 - send post update
