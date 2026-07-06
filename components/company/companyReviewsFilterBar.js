import {appState} from "../../appState.js";
import {getCompanyReviews} from "../../api/companyApi.js";
import {renderReviewsV2} from "./companyReviewAricle.js";

let filterBar = document.querySelector('[name="gradeFilter"]');
let reviewContainer = document.querySelector(".content-reviews");

filterBar.addEventListener('change', async(e) => {
    let selectedRating = e.target.value;
    reviewContainer.innerHTML = "";

    appState.filter = selectedRating;
    appState.currentPage = 1;

    let companyName = document.querySelector('.company-name').textContent;

    let results = await getCompanyReviews(companyName, appState.currentPage, appState.currentPageLimit, appState.filter, appState.sort); //new endpoint create

    console.log(results.items);

    renderReviewsV2(results.items);
})