import {companyReviewsState} from "./companyReviewsState.js";
import {getCompanyReviews} from "../../api/companyApi.js";
import {renderCompanyReviews} from "./companyReviewAricle.js";

let filterBar = document.querySelector('[name="gradeFilter"]');
let reviewContainer = document.querySelector(".content-reviews");

filterBar.addEventListener('change', async(e) => {
    let selectedRating = e.target.value;
    reviewContainer.innerHTML = "";

    companyReviewsState.filter = selectedRating;
    companyReviewsState.currentPage = 1;

    let companyName = document.querySelector('.company-name').textContent;

    let results = await getCompanyReviews(companyName, companyReviewsState.currentPage, companyReviewsState.currentPageLimit, companyReviewsState.filter, companyReviewsState.sort); //new endpoint create

    console.log(results.items);

    renderCompanyReviews(results.items);
})