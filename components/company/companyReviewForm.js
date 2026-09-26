import {submitReview} from "../../api/reviewsApi.js";
import {renderCompanyReviews} from "./companyReviewAricle.js";
import {getCompanyReviews} from "../../api/companyApi.js";
import {companyReviewsState} from "./companyReviewsState.js";


let addReviewButton =  document.querySelector('.title-button');
let overlay = document.getElementById('overlay');
let modal = document.querySelector('.modal');
let closeButton = document.querySelector('.close-btn');
let sendReviewButton = document.querySelector('.submit-btn');
let cancelButton = document.querySelector('.cancel-btn');

let rating = document.querySelector('#company_rating_2');
let review = document.querySelector('#company_review');

let ratingErrorField = document.querySelector('.rating-error');
let reviewErrorField = document.querySelector('.review-error');

addReviewButton.addEventListener('click', async () => {
    //show modal
    overlay.classList.add('active');

    //check if user is logged in and we should show name&email fields
    let token = localStorage.getItem('token');
    if(!token) {
        document.getElementById('personal_data').classList.remove('hidden');
    }

    //clear form
    document.querySelectorAll('.star-rating span').forEach((star) => {
        star.classList.remove('active');
    })
    document.querySelector('#company_rating_2').value = "";
    ratingErrorField.classList.remove('error');
    ratingErrorField.textContent = '';

    review.value = "";
    reviewErrorField.classList.remove('error');
    reviewErrorField.textContent = '';
});
[closeButton, cancelButton].forEach(btn => {
    btn.addEventListener('click', () => {
        overlay.classList.remove('active');
    });
});

overlay.addEventListener('click',(e) => {
    if(e.target === overlay) {
        overlay.classList.remove('active');
    }
})

//LIVE TESTING ON INPUT
modal.addEventListener('input', (e) => {
    if(e.target.id === "company_rating_2" || e.target.id === "company_review") {
        validateForm();
    }
})

//SHOWING ERRORS WHEN LEAVING THE FIELD
modal.addEventListener('blur', (e) => {
    if(e.target.id === "company_rating_2" || e.target.id === "company_review") {
        validateForm();
    }
}, true)

//SEND FORM
sendReviewButton.addEventListener('click', async () => {
    if(!validateForm()) return;
    let company = document.querySelector('.company-name').textContent;
    let rating = Number(document.getElementById('company_rating_2').value);
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

        let request = await submitReview(data);

        if(request.success) {
            let companyReviews = await getCompanyReviews(company, companyReviewsState.currentPage, companyReviewsState.currentPageLimit, companyReviewsState.filter, companyReviewsState.sort);
            let reviews = companyReviews.items;
            renderCompanyReviews(reviews, companyReviews.reviewsTotalNumber);
            //TODO add clear form
            overlay.classList.remove('active'); //hide form
        }
})

function validateForm() {
    let isValid = true;

    let ratingValue = Number(rating.value);
    if (!ratingValue) {
        ratingErrorField.classList.add("error");
        ratingErrorField.textContent = "Please select rating value";
        isValid = false;
    } else if (ratingValue < 1 || ratingValue > 5) {
        ratingErrorField.classList.add("error");
        ratingErrorField.textContent = "Rating should be 1-5";
        isValid = false;
    } else {
        ratingErrorField.classList.remove("error");
        ratingErrorField.textContent = "";
    }
        if(review.value.length < 10) {
            reviewErrorField.classList.add('error');
            reviewErrorField.textContent ="Text not less than 10";
            isValid = false;
        }
        else {
            reviewErrorField.classList.remove('error');
            reviewErrorField.textContent ="";
        }
    return isValid;
}

//rating stars
document.querySelectorAll('.star-rating span').forEach((star) => {
    star.addEventListener('click', () => {
        let starValue = star.dataset.value;
        document.querySelector('#company_rating_2').value = starValue;

        document.querySelectorAll('.star-rating span').forEach((star, index) => {
            star.classList.toggle('active', index < starValue);
        })
        ratingErrorField.classList.remove('error');
        ratingErrorField.textContent = '';
    })
})
